import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import IssueCard from './IssueCard';

const sample = {
  id: 1001,
  title: 'Refactor Gravity Well',
  status: 'todo',
  priority: 'medium',
  points: 5,
  assignee: 'AI',
  type: 'feature'
};

test('renders IssueCard and handles click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<IssueCard issue={sample} onClick={onClick} />);

  const card = screen.getByTestId('issue-card-1001');
  expect(card).toBeInTheDocument();
  expect(screen.getByText(/Refactor Gravity Well/i)).toBeInTheDocument();

  await user.click(card);
  expect(onClick).toHaveBeenCalled();
});