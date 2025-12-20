export const getUiBuildingInstructions = async () => {
  const instructions = `# Storybook UI Development Guidelines

## 1. Component Story Format (CSF3)
All stories must be written using CSF3 format. Use named exports for stories and prefer declarative `args` for variants.

## 2. Storybook Best Practices
- Use 
  - *tags: ['autodocs']* for stories that should appear in the components manifest
  - *parameters.layout* for fullscreen/modal stories
- Keep stories focused: one interactive state per story when possible

## 3. Testing & Play functions
- Use Storybook's test-play utilities for interactions and visual regression anchors
- Ensure stable selectors (data-testid) for Playwright tests

## 4. Accessibility
- Add the a11y addon and fix any violations reported for color contrast and keyboard focus

`;
  return { content: [{ type: 'text', text: instructions }] };
};

export default getUiBuildingInstructions;