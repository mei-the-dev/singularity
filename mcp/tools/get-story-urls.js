import { fetchIndexJson } from './storybook_adapter.js';

export const getStoryUrls = async ({ absoluteStoryPath, exportName, explicitStoryName, baseUrl } = {}) => {
  const base = baseUrl || process.env.STORYBOOK_URL || 'http://localhost:6006';
  try {
    const parsed = await fetchIndexJson(base);
    if (parsed.error) return { error: parsed.error };
    // try to match by importPath suffix
    const importSuffix = (absoluteStoryPath || '').split('/').slice(-1)[0];
    let matchedStories = [];
    for (const comp of parsed) {
      for (const s of comp.stories) {
        if (s.importPath && importSuffix && s.importPath.endsWith(importSuffix)) {
          matchedStories.push({ comp, story: s });
        }
        if (explicitStoryName && s.name && s.name === explicitStoryName) matchedStories.push({ comp, story: s });
        if (exportName && s.name && (s.name.toLowerCase() === exportName.toLowerCase())) matchedStories.push({ comp, story: s });
        if (s.id && s.id.includes((exportName || '').toLowerCase())) matchedStories.push({ comp, story: s });
      }
    }

    if (matchedStories.length === 0) {
      // fallback: try searching all stories for exportName
      for (const comp of parsed) {
        for (const s of comp.stories) {
          if (s.name && exportName && s.name.toLowerCase() === exportName.toLowerCase()) matchedStories.push({ comp, story: s });
        }
      }
    }

    if (matchedStories.length === 0) return { error: 'No matching story found' };

    const urls = matchedStories.map(({ story }) => ({
      id: story.id,
      iframeUrl: `${base}/iframe.html?id=${encodeURIComponent(story.id)}`,
      managerUrl: `${base}/?path=/story/${encodeURIComponent((story.id || '').split('--')[0])}--${encodeURIComponent((story.id || '').split('--')[1] || '')}`
    }));

    return { urls };
  } catch (e) {
    return { error: e && e.message ? e.message : String(e) };
  }
};

export default getStoryUrls;