import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import ColumnHeader from './ColumnHeader'

const meta: Meta<typeof ColumnHeader> = {
  title: 'Molecules/ColumnHeader',
  component: ColumnHeader,
  tags: ['autodocs','dev','test'],
}

export default meta

type Story = StoryObj<typeof ColumnHeader>

export const Default: Story = { args: { title: 'Backlog', count: 4 } }
