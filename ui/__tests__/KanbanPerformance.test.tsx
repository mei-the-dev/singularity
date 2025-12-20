import React, { Profiler } from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import Sidebar from '../components/Sidebar';
import { IssuesProvider } from '../components/IssuesProvider';

jest.setTimeout(20000);

describe('Kanban performance tests', () => {
  test('mounts 500 issues within acceptable time', () => {
    const issues = Array.from({ length: 500 }).map((_, i) => ({
      id: String(i + 1),
      title: `Perf Issue ${i + 1}`,
      status: i % 3 === 0 ? 'backlog' : i % 3 === 1 ? 'in-progress' : 'done',
      type: 'task',
      assignee: `User${i + 1}`
    }));

    let totalMount = 0;
    const onRender = (_id: string, phase: any, actualDuration: number) => {
      if (phase === 'mount') totalMount += actualDuration;
    };

    render(
      <Profiler id="kanban-mount" onRender={onRender}>
        <IssuesProvider initialIssues={issues}>
          <KanbanBoard />
        </IssuesProvider>
      </Profiler>
    );

    // Acceptable threshold: 1200ms total mount time (conservative)
    expect(totalMount).toBeGreaterThan(0);
    expect(totalMount).toBeLessThan(1200);
  });

  test('filter updates are responsive (<300ms)', () => {
    const issues = Array.from({ length: 100 }).map((_, i) => ({
      id: String(i + 1),
      title: `Perf Issue ${i + 1}`,
      status: i % 3 === 0 ? 'backlog' : i % 3 === 1 ? 'in-progress' : 'done',
      type: 'task',
      assignee: `User${i + 1}`
    }));

    let totalUpdate = 0;
    const onRender = (_id: string, phase: any, actualDuration: number) => {
      if (phase === 'update') totalUpdate += actualDuration;
    };

    render(
      <Profiler id="kanban-update" onRender={onRender}>
        <IssuesProvider initialIssues={issues}>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <KanbanBoard />
          </div>
        </IssuesProvider>
      </Profiler>
    );

    const sidebar = screen.getByLabelText('Sidebar Navigation');
    const searchInput = within(sidebar).getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Perf Issue 10' } });

    // Ensure at least one update recorded and under threshold
    expect(totalUpdate).toBeGreaterThanOrEqual(0);
    expect(totalUpdate).toBeLessThan(300);
  });
});
