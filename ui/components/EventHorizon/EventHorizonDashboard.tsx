import React, { useState } from 'react'
import DashboardHeader, { ViewType } from '../EventHorizon/DashboardHeader/DashboardHeader'
import IssueCard from '../../IssueCard/IssueCard'
import type { GitHubIssue } from '../../hooks/useGitHubIssues'
import './EventHorizonDashboard.css'

const sampleIssue: GitHubIssue = {
  id: 1,
  number: 101,
  title: 'Implement authentication module',
  body: 'Add OAuth2 flow and session management',
  state: 'open',
  user: { login: 'alice' },
  comments: 2,
  url: '#',
}

export const EventHorizonDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('board')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="eh-dashboard-root">
      <DashboardHeader
        title="EventHorizon"
        activeView={activeView}
        openCount={7}
        searchQuery={searchQuery}
        onViewChange={(v) => setActiveView(v)}
        onSearchChange={(q) => setSearchQuery(q)}
        onNewIssue={() => alert('New issue flow (TODO)')}
      />

      <main className="eh-dashboard-main">
        {activeView === 'board' && (
          <section className="eh-board">
            <h2 className="eh-board__heading">Backlog</h2>
            <div className="eh-board__list">
              <IssueCard issue={sampleIssue} />
            </div>
          </section>
        )}

        {activeView === 'tools' && (
          <section className="eh-tools">
            <div className="eh-surface">MCP Tools (placeholder)</div>
          </section>
        )}

        {activeView === 'status' && (
          <section className="eh-status">
            <div className="eh-surface">System Status (placeholder)</div>
          </section>
        )}
      </main>
    </div>
  )
}

export default EventHorizonDashboard
