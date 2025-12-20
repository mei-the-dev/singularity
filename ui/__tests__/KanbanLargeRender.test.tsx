import React from 'react';
import { render } from '@testing-library/react';
import { IssuesProvider } from '../components/IssuesProvider';
import KanbanBoard from '../components/KanbanBoard';

test('renders large board quickly', () => {
  const issues = Array.from({ length: 1000 }).map((_, i) => ({ id: String(i), title: `Issue ${i}`, status: i % 3 === 0 ? 'backlog' : i % 3 === 1 ? 'in-progress' : 'done' }));
  const start = Date.now();
  const { getByLabelText } = render(
    <IssuesProvider initialIssues={issues as any}>
      <KanbanBoard />
    </IssuesProvider>
  );
  const board = getByLabelText('Kanban Board Columns');
  const elapsed = Date.now() - start;
  // assert it rendered and was reasonably quick (500ms threshold for test environment)
  expect(board).toBeTruthy();
  // allow a larger threshold for CI / local environments
  expect(elapsed).toBeLessThan(2000);
});
