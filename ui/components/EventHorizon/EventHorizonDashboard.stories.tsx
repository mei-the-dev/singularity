import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import EventHorizonDashboard from './EventHorizonDashboard'

const meta: Meta<typeof EventHorizonDashboard> = {
  title: 'Dashboard/EventHorizonDashboard',
  component: EventHorizonDashboard,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof EventHorizonDashboard>

export const Default: Story = {}
