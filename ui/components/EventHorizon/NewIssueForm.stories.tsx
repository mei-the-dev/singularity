import React, { useState } from 'react'
import NewIssueForm from './NewIssueForm'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof NewIssueForm> = {
  title: 'EventHorizon/NewIssueForm',
  component: NewIssueForm,
}

export default meta

export const Default: StoryObj = {
  render: (args) => {
    const [open, setOpen] = useState(true)
    return <NewIssueForm {...args} open={open} onClose={() => setOpen(false)} onSubmit={(p) => alert(JSON.stringify(p))} />
  },
}
