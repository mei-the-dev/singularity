import React from 'react'
import type { GitHubIssue } from '../../hooks/useGitHubIssues'

import './IssueCard.css'

export interface IssueCardProps {
  issue: GitHubIssue
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <article className="issue-card">
      <header className="issue-card__header">
        <h3 className="issue-card__title">#{issue.number} — {issue.title}</h3>
        <div className="issue-card__meta">{issue.user?.login} • {issue.comments} comments</div>
      </header>
      <section className="issue-card__body">{issue.body ? issue.body.slice(0, 240) : 'No description'}</section>
      <footer className="issue-card__footer">State: <strong>{issue.state}</strong></footer>
    </article>
  )
}

export default IssueCard
