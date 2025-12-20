import React from 'react';
import { render } from '@testing-library/react';
import IssueCard from '../components/IssueCard';

test('IssueCard snapshot', () => {
  const { container } = render(<IssueCard issue={{ id: '1', title: 'Snapshot Test', status: 'backlog' }} />);
  expect(container.firstChild).toMatchSnapshot();
});
