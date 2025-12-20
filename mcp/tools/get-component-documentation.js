import { getComponentDocumentation as adapterDoc } from './storybook_adapter.js';

export const getComponentDocumentation = async ({ componentId, baseUrl } = {}) => {
  const base = baseUrl || process.env.STORYBOOK_URL || 'http://localhost:6006';
  if (!componentId) return { content: [{ type: 'text', text: 'Missing componentId' }], isError: true };
  const res = await adapterDoc(componentId, base);
  if (res && res.error) return { content: [{ type: 'text', text: 'Error: ' + res.error }], isError: true };
  // Prefer markdown if available
  const text = res.markdown || (res.html ? res.html : 'No documentation available');
  return { content: [{ type: 'text', text: typeof text === 'string' ? text : JSON.stringify(text, null, 2) }] };
};

export default getComponentDocumentation;