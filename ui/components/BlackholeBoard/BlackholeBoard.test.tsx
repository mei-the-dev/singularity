import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlackholeBoard from './BlackholeBoard';

test('renders BlackholeBoard and opens modal on issue click', async () => {
  const user = userEvent.setup();
  render(<BlackholeBoard />);

  const board = screen.getByTestId('blackhole-board');
  expect(board).toBeInTheDocument();

  // Click first issue card and expect modal to open
  const card = await screen.findByTestId('issue-card-1');
  await user.click(card);

  // Modal should show the issue title
  expect(screen.getByText(/Implement authentication module/i)).toBeInTheDocument();
});