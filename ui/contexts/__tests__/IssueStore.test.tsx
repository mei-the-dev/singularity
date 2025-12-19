import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IssueProvider, useIssues } from '../IssueStore';
import React from 'react';

const wrapper = ({ children }: any) => <IssueProvider>{children}</IssueProvider>;

describe('IssueStore', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve([{ number: 1, id: '1', title: 'A', state: 'open' }]) })) as any);
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('refreshes and provides issues', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIssues(), { wrapper });
    await result.current.refresh();
    expect(result.current.issues.length).toBe(1);
    expect(result.current.issues[0].number).toBe(1);
  });

  it('plan does optimistic update and rolls back on failure', async () => {
    const mockFetch = vi.fn();
    mockFetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([{ number: 2, id: '2', title: 'B', state: 'open' }]) })); // initial refresh
    mockFetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve({ msg: 'ok' }) })); // plan success
    vi.stubGlobal('fetch', mockFetch as any);

    const { result } = renderHook(() => useIssues(), { wrapper });
    await result.current.refresh();
    expect(result.current.issues[0].state).toBe('open');

    await result.current.plan(2);
    // after plan, state should be 'in_progress' for issue 2
    expect(result.current.issues.find(i => i.number === 2)?.state).toBe('in_progress');

    // now simulate failure for update - stub fetch to throw
    mockFetch.mockImplementationOnce(() => Promise.reject(new Error('fail')));
    await expect(result.current.update(2, { state: 'closed' })).rejects.toThrow();
    // rollback should keep previous state (in_progress)
    expect(result.current.issues.find(i => i.number === 2)?.state).toBe('in_progress');
  });
});
