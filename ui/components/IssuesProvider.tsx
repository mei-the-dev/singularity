"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Issue = {
  id: string;
  title: string;
  type?: string;
  priority?: string;
  assignee?: string;
  status: "backlog" | "in-progress" | "done";
};

// Ensure Issue and Filters are top-level
// No stray parenthesis, no duplicate fields
type Filters = {
  assignee?: string;
  label?: string;
  text?: string;
  status?: Issue['status'];
};

type IssuesContextType = {
  issues: Issue[];
  filteredIssues: Issue[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  refresh: () => Promise<void>;
  updateIssueStatus: (id: string, status: Issue["status"]) => Promise<void>;
};

const IssuesContext = createContext<IssuesContextType | null>(null);

export const useIssues = () => {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider");
  return ctx;
};

interface IssuesProviderProps {
  children: React.ReactNode;
  initialIssues?: Issue[];
}

import { useToast } from './Toast';

export const IssuesProvider: React.FC<IssuesProviderProps> = ({ children, initialIssues }) => {
  const toast = useToast();
  const [issues, setIssues] = useState<Issue[]>(initialIssues || []);
  const [filters, setFilters] = useState<Filters>({});

  // If initialIssues is provided, skip fetches (test mode)
  const fetchIssues = async () => {
    if (initialIssues) return;
    try {
      const res = await fetch('/api/issues');
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (e) {
      console.error('fetchIssues error', e);
      // show toast if available (optional)
      try { (toast?.show as any) && toast.show('Failed to fetch issues', 'error'); } catch {}
    }
  };

  useEffect(() => {
    if (initialIssues) return;
    fetchIssues();
    const iv = setInterval(fetchIssues, 15000);
    return () => clearInterval(iv);
  }, []);

  const updateIssueStatus = async (id: string, status: Issue['status']) => {
    if (initialIssues) {
      setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      return;
    }
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update issue');
      await fetchIssues();
      try { toast.show('Issue updated', 'success'); } catch {}
    } catch (e) {
      console.error('updateIssueStatus error', e);
      try { toast.show('Failed to update issue', 'error'); } catch {}
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.assignee && (!issue.assignee || !issue.assignee.toLowerCase().includes(filters.assignee.toLowerCase()))) return false;
    if (filters.label && (!issue.type || !issue.type.toLowerCase().includes(filters.label.toLowerCase()))) return false;
    if (filters.text && !issue.title.toLowerCase().includes(filters.text.toLowerCase())) return false;
    return true;
  });
  return (
    <IssuesContext.Provider value={{ issues, filteredIssues, filters, setFilters, refresh: fetchIssues, updateIssueStatus }}>
      {children}
    </IssuesContext.Provider>
  );
};
