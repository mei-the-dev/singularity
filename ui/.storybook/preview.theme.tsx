import React from 'react'
import '../src/storybook-theme.css'
import { themes } from '@storybook/theming'
import type { Preview } from '@storybook/react'

export const parameters = {
  backgrounds: {
    default: 'canvas',
    values: [
      { name: 'canvas', value: 'var(--color-bg)' },
      { name: 'surface', value: 'var(--color-surface)' },
      { name: 'light', value: '#ffffff' },
    ],
  },
  options: { showPanel: true },
  docs: { theme: themes.light },
}

export const globalTypes = {
  colorMode: {
    name: 'Color Mode',
    description: 'Toggle theme',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
    },
  },
}

export const decorators = [
  (Story, context) => {
    const mode = context.globals?.colorMode || 'dark'
    if (typeof document !== 'undefined') {
      if (mode === 'light') {
        document.documentElement.style.setProperty('--color-bg', '#ffffff')
        document.documentElement.style.setProperty('--color-surface', '#f6f7fb')
        document.documentElement.style.setProperty('--color-text', '#0f1720')
      } else {
        document.documentElement.style.setProperty('--color-bg', 'var(--color-bg)')
        document.documentElement.style.setProperty('--color-surface', 'var(--color-surface)')
        document.documentElement.style.setProperty('--color-text', 'var(--color-text)')
      }
    }
    return <Story />
  },
]

const preview: Preview = {}
export default preview
