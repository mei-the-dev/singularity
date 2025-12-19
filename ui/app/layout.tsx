import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Singularity Nexus", description: "Event Horizon Interface" };

import { IssueProvider } from '../contexts/IssueStore';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-gold/30 selection:text-gold"><IssueProvider>{children}</IssueProvider></body>
    </html>
  );
}