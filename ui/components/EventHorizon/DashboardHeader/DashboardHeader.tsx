import React from 'react'
import './DashboardHeader.css'

export type ViewType = 'board' | 'tools' | 'status'

export interface DashboardHeaderProps {
  title?: string
  activeView?: ViewType
  openCount?: number
  searchQuery?: string
  onViewChange?: (v: ViewType) => void
  onSearchChange?: (q: string) => void
  onNewIssue?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'EventHorizon',
  activeView = 'board',
  openCount = 0,
  searchQuery = '',
  onViewChange = () => {},
  onSearchChange = () => {},
  onNewIssue = () => {},
}) => {
  return (
    <header className="eh-header">
      <div className="eh-header__left">
        <div className="eh-header__brand">
          <h1 className="eh-header__title">{title}</h1>
          <div className="eh-header__subtitle">Developer dashboard</div>
        </div>

        <nav className="eh-header__tabs" role="tablist" aria-label="Views">
          <button
            className={`eh-tab ${activeView === 'board' ? 'is-active' : ''}`}
            onClick={() => onViewChange('board')}
          >
            Board
          </button>
          <button
            className={`eh-tab ${activeView === 'tools' ? 'is-active' : ''}`}
            onClick={() => onViewChange('tools')}
          >
            MCP Tools
          </button>
          <button
            className={`eh-tab ${activeView === 'status' ? 'is-active' : ''}`}
            onClick={() => onViewChange('status')}
          >
            Status
          </button>
        </nav>
      </div>

      <div className="eh-header__right">
        {activeView === 'board' && (
          <div className="eh-search">
            <input
              aria-label="Search issues"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <div className="eh-actions">
          <button className="eh-btn eh-btn--primary" onClick={onNewIssue}>New Issue</button>

          <div className="eh-header__status" title="Open issues">
            <span className="eh-header__status-dot" />
            <span className="eh-header__status-count">{openCount}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
