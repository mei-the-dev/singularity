# UI Design Tokens

This document describes the design tokens (CSS variables) used by the Singularity UI, their intent, and guidance for use.

## Tokens

- `--bg` — Page background color (space black). Use for full-viewport backgrounds.
  - Value: `#040407`
- `--panel` — Semi-opaque panel backdrop (glass). Use for cards, panels, and surfaces.
  - Value: `rgba(14, 12, 15, 0.6)`
- `--gold` — Primary accent color for the Singularity brand (gold). Use for highlights, subtle borders, and important accents.
  - Value: `#D4AF37`
- `--gold-dim` — Low-opacity gold for glows and focus rings.
  - Value: `rgba(212,175,55,0.12)`
- `--accent` — Secondary accent (cyan/teal) used for headings and small UI indicators.
  - Value: `#00f0ff`
- `--accent-dim` — Low-opacity accent used for subtle backgrounds.
  - Value: `#00f0ff20`

## Usage guidance
- Prefer semantic class names (`.glass-panel`, `.gold-text`, `.drop-highlight`) over raw variables in component markup.
- Use `--panel` for surfaces and apply `backdrop-filter: blur(...)` where appropriate to maintain the glassy aesthetic.
- Keep gold usage subtle — prefer thin borders, small shadows, and text accents. Overuse of `--gold` reduces contrast and impact.

## Accessibility
- Ensure text using `--gold` has sufficient contrast on the background it sits on. If using gold for body text, verify contrast ratio (WCAG AA/AAA as required).
- Focus rings use `--gold-dim` to indicate keyboard focus. Maintain at least a 4px focus ring for keyboard accessibility.

## Theming
- To create alternate themes, override the tokens in `:root` or import a theme css file that sets these variables. Avoid hard-coding colors inside components; prefer referencing variables.

## How to add a new token
1. Add the variable in `ui/app/globals.css` under `:root`.
2. Update this document with the token name, intent, and recommended usage.
3. Add a Storybook story demonstrating the token usage (if it affects components visibly) for reviewers.

---

Document last updated: December 20, 2025
