import React from 'react';
import { render } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import IssueCard from './IssueCard';

expect.extend(toHaveNoViolations);

const sample = {
  id: 1001,
  title: 'Refactor Gravity Well',
  status: 'todo',
  priority: 'medium',
  points: 5,
  assignee: 'AI',
  type: 'feature'
};

test('IssueCard has no obvious accessibility violations', async () => {
  const { container } = render(<IssueCard issue={sample} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});