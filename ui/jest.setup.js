// Jest setup for ui tests
require('@testing-library/jest-dom');
// add any global mocks or polyfills here

// Provide a safe global.fetch for tests (jsdom may not provide fetch)
if (typeof global.fetch !== 'function') {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: async () => ({}) }));
}

// Prevent JSDOM from reporting uncaught errors that are handled by React Error Boundaries
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('error', (e) => {
    // prevent the error from becoming an uncaught exception
    e.preventDefault();
  });
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
  });
}
