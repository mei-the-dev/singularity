import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IssueCard from '../components/IssueCard';

beforeEach(() => { (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success' }) }); });

test('shows pipeline badge for issue', async () => {
  render(<IssueCard issue={{ id: '7', title: 'Has Pipeline', status: 'backlog' }} />);
  await waitFor(() => expect(screen.getByText('success')).toBeInTheDocument());
});
