import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import NewIssueButton from './NewIssueButton'

const meta: Meta<typeof NewIssueButton> = {
  title: 'Molecules/NewIssueButton',
  component: NewIssueButton,
  tags: ['autodocs','dev','test'],
}

export default meta

type Story = StoryObj<typeof NewIssueButton>

export const Default: Story = {}
export const WithCustomLabel: Story = { args: { label: 'Create Issue' } }
