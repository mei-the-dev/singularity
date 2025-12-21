import type { Preview } from '@storybook/react';
import '../src/index.css';

// Error boundary for debugging
window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('🔴 PREVIEW ERROR:', e.error);
  // eslint-disable-next-line no-console
  console.error('Stack:', e.error?.stack);
});

// eslint-disable-next-line no-console
console.log('✓ Preview loading...', {
  clientAPI: typeof (window as any).__STORYBOOK_CLIENT_API__,
  location: window.location.href,
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
  },
};

export default preview;
