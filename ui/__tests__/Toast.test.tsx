import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider } from '../components/Toast';
import { IssuesProvider } from '../components/IssuesProvider';
import KanbanBoard from '../components/KanbanBoard';

describe('Toast behavior', () => {
  test('shows error toast when fetch fails', async () => {
    // @ts-ignore
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }));

    render(
      <ToastProvider>
        <IssuesProvider>
          <KanbanBoard />
        </IssuesProvider>
      </ToastProvider>
    );

    await waitFor(() => expect(screen.getByLabelText('toast-error')).toBeInTheDocument());
    expect(screen.getByLabelText('toast-error')).toHaveTextContent(/Failed to fetch issues/i);

    // cleanup
    // @ts-ignore
    global.fetch = undefined;
  });
});
