import type { Preview } from '@storybook/react';
import './preview.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    backgrounds: {
      default: 'event-horizon',
      values: [
        { name: 'event-horizon', value: '#000000' },
        { name: 'deep-space', value: '#0f0f0f' }
      ]
    },
    layout: 'centered'
  },
  decorators: []
};

export default preview;
