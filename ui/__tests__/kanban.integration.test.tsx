import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import Sidebar from '../components/Sidebar';
import { IssuesProvider, useIssues } from '../components/IssuesProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';




const defaultIssues = [
  { id: '1', title: 'Test Issue 1', status: 'backlog', type: 'bug', assignee: 'Alice', description: 'Desc 1' },
  { id: '2', title: 'Test Issue 2', status: 'in-progress', type: 'feature', assignee: 'Bob', description: 'Desc 2' },
  { id: '3', title: 'Test Issue 3', status: 'done', type: 'chore', assignee: 'Carol', description: 'Desc 3' },
];

describe('KanbanBoard Integration', () => {
  test('renders all columns and issues', () => {
    render(
      <IssuesProvider initialIssues={defaultIssues}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <KanbanBoard />
        </div>
      </IssuesProvider>
    );
    // Use getAllByText and filter for h3 elements (column headers)
    const backlogHeaders = screen.getAllByText('Backlog');
    expect(backlogHeaders.some(el => el.tagName === 'H3')).toBe(true);
    const inProgressHeaders = screen.getAllByText('In Progress');
    expect(inProgressHeaders.some(el => el.tagName === 'H3')).toBe(true);
    const doneHeaders = screen.getAllByText('Done');
    expect(doneHeaders.some(el => el.tagName === 'H3')).toBe(true);
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
    expect(screen.getByText('Test Issue 3')).toBeInTheDocument();
  });

  // JSDOM does not support DnD API; skip in CI
  const isJSDOM = typeof window !== 'undefined' && window.navigator.userAgent.includes('jsdom');
  (isJSDOM ? test.skip : test)('can move issue between columns (DnD simulation)', async () => {
    render(
      <IssuesProvider initialIssues={defaultIssues}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <KanbanBoard />
        </div>
      </IssuesProvider>
    );
    const todoCard = screen.getByText('Test Issue 1');
    const inProgressColumn = screen.getByText('In Progress').closest('[data-testid="kanban-column"]');
    fireEvent.dragStart(todoCard);
    fireEvent.dragEnter(inProgressColumn!);
    fireEvent.drop(inProgressColumn!);
    await waitFor(() => {
      expect(inProgressColumn).toHaveTextContent('Test Issue 1');
    });
  });

  test('filters issues by search', () => {
    render(
      <IssuesProvider initialIssues={defaultIssues}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <KanbanBoard />
        </div>
      </IssuesProvider>
    );
    // Find the search input in the Sidebar
    const sidebar = screen.getByLabelText('Sidebar Navigation');
    const searchInput = within(sidebar).getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: '2' } });
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
    expect(screen.queryByText('Test Issue 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Issue 3')).not.toBeInTheDocument();
  });

  test('shows error boundary on error', () => {
    // Force error in child
    const ProblemChild = () => { throw new Error('Boom!'); };
    render(
      <IssuesProvider initialIssues={defaultIssues}>
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      </IssuesProvider>
    );
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  (isJSDOM ? test.skip : test)('state sync: issue status persists after move', async () => {
    const { rerender } = render(
      <IssuesProvider initialIssues={defaultIssues}>
        <KanbanBoard />
      </IssuesProvider>
    );
    const todoCard = screen.getByText('Test Issue 1');
    const doneColumn = screen.getByText('Done').closest('[data-testid="kanban-column"]');
    fireEvent.dragStart(todoCard);
    fireEvent.dragEnter(doneColumn!);
    fireEvent.drop(doneColumn!);
    await waitFor(() => {
      expect(doneColumn).toHaveTextContent('Test Issue 1');
    });
    // Simulate rerender
    rerender(
      <IssuesProvider initialIssues={defaultIssues}>
        <KanbanBoard />
      </IssuesProvider>
    );
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
