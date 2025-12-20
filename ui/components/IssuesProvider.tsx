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

type IssuesContextType = {
  issues: Issue[];
  refresh: () => Promise<void>;
  updateIssueStatus: (id: string, status: Issue["status"]) => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const IssuesContext = createContext<IssuesContextType | null>(null);

export const useIssues = () => {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider");
  return ctx;
};

export const IssuesProvider: React.FC<{ children: React.ReactNode; initialIssues?: Issue[] }> = ({ children, initialIssues }) => {
  const [issues, setIssues] = useState<Issue[]>(initialIssues || []);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchIssues = async () => {
    try {
      // Only fetch from API when initialIssues isn't provided (test-friendly)
      if (initialIssues) return;
      const res = await fetch('/api/issues');
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (e) {
      console.error('fetchIssues error', e);
    }
  };

  useEffect(() => {
    fetchIssues();
    const iv = setInterval(fetchIssues, 15000);
    return () => clearInterval(iv);
  }, []);

  const updateIssueStatus = async (id: string, status: Issue['status']) => {
    try {
      // If fetch isn't available (tests) or initialIssues was used, update locally
      if (typeof fetch !== 'function' || initialIssues) {
        setIssues((prev) => prev.map((iss) => (iss.id === id ? { ...iss, status } : iss)));
        return;
      }

      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update issue');
      await fetchIssues();
    } catch (e) {
      console.error('updateIssueStatus error', e);
    }
  };

  return (
    <IssuesContext.Provider value={{ issues, refresh: fetchIssues, updateIssueStatus, searchTerm, setSearchTerm }}>
      {children}
    </IssuesContext.Provider>
  );
};

export default IssuesProvider;
