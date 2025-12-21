import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import IssueCard from './IssueCard'
import type { GitHubIssue } from '../../hooks/useGitHubIssues'

const meta: Meta<typeof IssueCard> = {
  title: 'EventHorizon/IssueCard',
  component: IssueCard,
}

export default meta
type Story = StoryObj<typeof IssueCard>

const sampleIssue: GitHubIssue = {
  id: 1,
  number: 42,
  title: 'Sample issue for IssueCard story',
  body: 'This is a sample issue body used in Storybook stories for layout and visual testing.',
  state: 'open',
  user: { login: 'alice', avatar_url: '' },
  comments: 3,
  url: 'https://example.com/issue/42',
}

export const Default: Story = {
  args: { issue: sampleIssue },
}
