import type { Preview } from '@storybook/react';
import '../src/index.css';

// Error boundary for debugging
window.addEventListener('error', (e) => {
  console.error('🔴 PREVIEW ERROR:', e.error);
  console.error('Stack:', e.error?.stack);
});

console.log('✓ Preview loading...', {
  clientAPI: typeof window.__STORYBOOK_CLIENT_API__,
  location: window.location.href
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
import type { Preview } from '@storybook/react';

// Minimal non-JSX preview stub to avoid duplicate JSX parsing of .ts file.
const preview: Preview = {};
export default preview;
