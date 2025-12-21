import React from 'react'
import type { Preview } from '@storybook/react'
import './preview.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    backgrounds: {
      default: 'event-horizon',
      values: [
        { name: 'event-horizon', value: '#000000' },
        { name: 'deep-space', value: '#0f0f0f' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="text-amber-100 antialiased selection:bg-amber-500/30 bg-black min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
}

export default preview
