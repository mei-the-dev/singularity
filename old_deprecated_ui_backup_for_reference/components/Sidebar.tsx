"use client";
import { Layout, GitPullRequest, Settings, Activity } from 'lucide-react';
import React from 'react';

export default function Sidebar() {
  const navItem = (Icon: any, active?: boolean) => (
    <div className={`p-3 rounded-xl mb-4 transition-all ${active ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-500 hover:text-gray-200'}`}>
      <Icon size={20} />
    </div>
  );
  return (
    <aside className="w-16 border-r border-white/5 flex flex-col items-center py-6 glass-panel z-50">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-yellow-700 mb-8 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
      {navItem(Layout, true)}
      {navItem(GitPullRequest)}
      {navItem(Activity)}
      <div className="mt-auto">{navItem(Settings)}</div>
    </aside>
  );
}