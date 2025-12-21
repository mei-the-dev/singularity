import React from 'react'
import NewIssueButton from './NewIssueButton'
import type { Meta } from '@storybook/react'

const meta: Meta<typeof NewIssueButton> = {
  title: 'EventHorizon/NewIssueButton',
  component: NewIssueButton,
}

export default meta

export const Default = () => <NewIssueButton onClick={() => alert('open')} />
