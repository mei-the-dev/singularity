import React from 'react';
import { render, screen, within } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import { IssuesProvider } from '../components/IssuesProvider';
import Sidebar from '../components/Sidebar';

describe('KanbanBoard Render checks', () => {
  test('renders empty state correctly', () => {
    render(
      <IssuesProvider initialIssues={[]}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <KanbanBoard />
        </div>
      </IssuesProvider>
    );
    // Board exists
    expect(screen.getByRole('list', { name: /Kanban Board Columns/i })).toBeInTheDocument();
    // Columns should show zero counts
    const backlog = screen.getByLabelText('Backlog');
    expect(within(backlog).getByText('0')).toBeInTheDocument();
    const inProgress = screen.getByLabelText('In Progress');
    expect(within(inProgress).getByText('0')).toBeInTheDocument();
    const done = screen.getByLabelText('Done');
    expect(within(done).getByText('0')).toBeInTheDocument();
    // No issue cards
    expect(screen.queryByRole('button', { name: /Issue card:/i })).not.toBeInTheDocument();
  });

  test('renders a large number of issues without crashing', () => {
    const issues = Array.from({ length: 200 }).map((_, i) => ({
      id: String(i + 1),
      title: `Bulk Issue ${i + 1}`,
      status: i % 3 === 0 ? 'backlog' : i % 3 === 1 ? 'in-progress' : 'done',
      type: 'task',
      assignee: `User${i + 1}`
    }));

    render(
      <IssuesProvider initialIssues={issues}>
        <KanbanBoard />
      </IssuesProvider>
    );

    // There should be 200 issue cards present (role=button)
    const issueCards = screen.getAllByRole('button').filter(el => /Issue card:/i.test(el.getAttribute('aria-label') || ''));
    expect(issueCards.length).toBe(200);
    // Spot-check a first and last
    expect(screen.getByText('Bulk Issue 1')).toBeInTheDocument();
    expect(screen.getByText('Bulk Issue 200')).toBeInTheDocument();
  });

  test('has expected ARIA roles for accessibility', () => {
    render(
      <IssuesProvider initialIssues={[]}>
        <KanbanBoard />
      </IssuesProvider>
    );
    // Board role
    expect(screen.getByRole('list', { name: /Kanban Board Columns/i })).toBeInTheDocument();
    // Columns should be listitems
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThanOrEqual(3);
  });
});
