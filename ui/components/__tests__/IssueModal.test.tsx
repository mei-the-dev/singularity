import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IssueModal from '../IssueModal';

const mockIssue = { number: 42, id: '42', title: 'Hello World', assignee: 'mei', state: 'open', body: '<p>desc</p>' };

describe('IssueModal', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => ({ msg: 'ok' }) })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders and calls run_tests', async () => {
    const onClose = vi.fn();
    render(<IssueModal issue={mockIssue as any} onClose={onClose} />);

    expect(screen.getByText('#42 — Hello World')).toBeTruthy();

    const runBtn = screen.getByTestId('issue-modal-42-run');
    fireEvent.click(runBtn);

    // wait for message to appear
    const msg = await screen.findByTestId('issue-modal-42-msg');
    expect(msg).toHaveTextContent('ok');
  });
});
