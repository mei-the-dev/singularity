import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      server: { host: '0.0.0.0', strictPort: true, port: 6006 },
    });
  },
  staticDirs: ['../public'],
};

export default config;
