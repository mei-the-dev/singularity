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
};

const IssuesContext = createContext<IssuesContextType | null>(null);

export const useIssues = () => {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider");
  return ctx;
};

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const fetchIssues = async () => {
    try {
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
    <IssuesContext.Provider value={{ issues, refresh: fetchIssues, updateIssueStatus }}>
      {children}
    </IssuesContext.Provider>
  );
};

export default IssuesProvider;
