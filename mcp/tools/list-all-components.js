import { listComponents as adapterList } from './storybook_adapter.js';

export const listAllComponents = async ({ baseUrl } = {}) => {
  const base = baseUrl || process.env.STORYBOOK_URL || 'http://localhost:6006';
  const res = await adapterList(base);
  if (res && res.error) return { content: [{ type: 'text', text: `Error: ${res.error}` }], isError: true };
  return { content: [{ type: 'text', text: JSON.stringify(res.components || [], null, 2) }] };
};

export default listAllComponents;