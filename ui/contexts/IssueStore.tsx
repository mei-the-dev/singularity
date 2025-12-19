"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Issue = { number: number; id: string; title: string; body?: string; state: string; assignee?: string; priority?: string };

type IssueContextValue = {
  issues: Issue[];
  loading: boolean;
  refresh: () => Promise<void>;
  plan: (issueNumber: number) => Promise<void>;
  update: (issueNumber: number, fields: Partial<Issue>) => Promise<void>;
  runTests: (issueNumber: number) => Promise<void>;
  createPR: (issueNumber: number) => Promise<void>;
};

const IssueContext = createContext<IssueContextValue | null>(null);

async function apiCall(action: string, args: any = {}) {
  const res = await fetch('/api/issues', { method: 'POST', body: JSON.stringify({ action, args }), headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  return data;
}

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/issues');
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('refresh failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, []);

  const optimisticUpdate = async (mutator: (prev: Issue[]) => Issue[], action: () => Promise<any>) => {
    const prev = issues;
    setIssues(mutator(prev));
    try {
      await action();
    } catch (e) {
      setIssues(prev); // rollback
      throw e;
    }
  };

  const plan = async (issueNumber: number) => {
    await optimisticUpdate(prev => prev.map(i => i.number === issueNumber ? { ...i, state: 'in_progress' } : i), () => apiCall('plan', { issue_id: issueNumber }));
  };

  const update = async (issueNumber: number, fields: Partial<Issue>) => {
    await optimisticUpdate(prev => prev.map(i => i.number === issueNumber ? { ...i, ...fields } : i), () => apiCall('update', { issue_number: issueNumber, ...fields }));
  };

  const runTests = async (issueNumber: number) => {
    return apiCall('run_tests', { issue_number: issueNumber });
  };

  const createPR = async (issueNumber: number) => {
    return apiCall('create_pr', { issue_number: issueNumber });
  };

  return (
    <IssueContext.Provider value={{ issues, loading, refresh, plan, update, runTests, createPR }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error('useIssues must be used within IssueProvider');
  return ctx;
}
