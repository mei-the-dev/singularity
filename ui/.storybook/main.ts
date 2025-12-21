import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  core: {
    disableTelemetry: true,
  },
  
  viteFinal: async (config) => {
    return mergeConfig(config, {
      server: {
        host: '0.0.0.0',
        strictPort: true,
        port: 6006,
      },
    });
  },
  
  staticDirs: ['../public'],
};

export default config;
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx|js|jsx|mjs)'],
  addons: [
    '@storybook/addon-mcp'
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
