import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IssuesProvider, useIssues } from '../components/IssuesProvider';
import KanbanBoard from '../components/KanbanBoard';

const defaultIssues = [
  { id: '1', title: 'API Issue 1', status: 'backlog', type: 'bug', assignee: 'Alice' },
  { id: '2', title: 'API Issue 2', status: 'in-progress', type: 'feature', assignee: 'Bob' },
];

function TestController() {
  const { updateIssueStatus, refresh } = useIssues();
  return (
    <div>
      <button onClick={() => updateIssueStatus('1', 'in-progress')}>move-1-to-inprogress</button>
      <button onClick={() => refresh()}>refresh</button>
    </div>
  );
}

describe('Kanban API integration', () => {
  let fetchMock: jest.Mock;
  beforeEach(() => {
    let current = [...defaultIssues];
    fetchMock = jest.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';
      if (url.endsWith('/api/issues') && method === 'GET') {
        return { ok: true, json: async () => ({ issues: current }) } as any;
      }
      if (url.endsWith('/api/issues') && method === 'POST') {
        // apply a minimal handler supporting status updates and creation
        const body = init?.body ? JSON.parse(init.body as string) : {};
        if (body.id && body.status) {
          current = current.map(i => i.id === String(body.id) ? { ...i, status: body.status } : i);
          return { ok: true, json: async () => ({ ok: true }) } as any;
        }
        if (body.title) {
          const next = { id: String(current.length + 1), ...body };
          current = [...current, next as any];
          return { ok: true, json: async () => ({ ok: true }) } as any;
        }
        return { ok: true, json: async () => ({ ok: true }) } as any;
      }
      return { ok: false, status: 404, json: async () => ({}) } as any;
    });
    // @ts-ignore
    global.fetch = fetchMock;
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
    fetchMock.mockClear();
  });

  test('fetches issues from API and renders them', async () => {
    render(
      <IssuesProvider>
        <KanbanBoard />
      </IssuesProvider>
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/issues');
    // Wait for an item to appear
    await waitFor(() => expect(screen.getByText('API Issue 1')).toBeInTheDocument());
    expect(screen.getByText('API Issue 2')).toBeInTheDocument();
  });

  test('updateIssueStatus triggers POST and board refreshes', async () => {
    render(
      <IssuesProvider>
        <TestController />
        <KanbanBoard />
      </IssuesProvider>
    );

    // initial check
    await waitFor(() => expect(screen.getByText('API Issue 1')).toBeInTheDocument());

    // trigger update
    const btn = screen.getByText('move-1-to-inprogress');
    fireEvent.click(btn);

    // POST should have been called
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const postCall = fetchMock.mock.calls.find((c: any[]) => c[0] === '/api/issues' && c[1]?.method === 'POST');
    expect(postCall).toBeTruthy();

    // After update, the issue should appear under In Progress column
    await waitFor(() => expect(screen.getByText('API Issue 1')).toBeInTheDocument());
    const inProgressCol = screen.getByLabelText('In Progress');
    expect(inProgressCol).toHaveTextContent('API Issue 1');
  });

  test('creating an issue and refreshing shows new issue', async () => {
    render(
      <IssuesProvider>
        <TestController />
        <KanbanBoard />
      </IssuesProvider>
    );

    // simulate create via POST then refresh
    await waitFor(() => expect(screen.getByText('API Issue 1')).toBeInTheDocument());
    // call POST create
    await fetch('/api/issues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'New API Issue', status: 'backlog' }) });
    // call refresh via controller
    const refreshBtn = screen.getByText('refresh');
    fireEvent.click(refreshBtn);
    // new issue should appear
    await waitFor(() => expect(screen.getByText('New API Issue')).toBeInTheDocument());
  });
});
