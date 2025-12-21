import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Palette from './Palette'

const meta: Meta<typeof Palette> = {
  title: 'Theme/Palette',
  component: Palette,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Palette>

export const Default: Story = {}
