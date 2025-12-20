import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx|js|jsx|mjs)'],
  addons: [
    'storybook-addon-mcp',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  features: {
    experimentalComponentsManifest: true,
  },
};

export default config;
