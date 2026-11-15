// Lily Design System — theme-select (headless, vanilla JS).
// Applies the chosen Lily theme by swapping the single swappable
// <link id="theme-stylesheet"> href — the HTML analogue of the
// front-end-with-svelte convention (front-end-with-svelte/src/lib/config/themes.ts).
// A blocking inline script in <head> already applies any saved choice before
// first paint; this module only wires up the <select> once the DOM is ready.

const STORAGE_KEY = 'pulmonary-function-test-result.theme.v1';
const DEFAULT_THEME = 'light';

function themeHref(theme) {
  return `css/themes/${theme}.css`;
}

// The browser's light/dark setting, as a theme: used while no theme is saved.
function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return DEFAULT_THEME;
  }
}

function hasSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? systemTheme();
  } catch {
    return systemTheme();
  }
}

function applyTheme(theme, persist) {
  const link = document.getElementById('theme-stylesheet');
  if (link) link.setAttribute('href', themeHref(theme));
  document.documentElement.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore quota / privacy errors
    }
  }
}

function init() {
  const select = document.getElementById('theme-select');
  const saved = readSavedTheme();
  applyTheme(saved, false);
  if (!select) return;
  select.value = saved;
  select.addEventListener('change', () => applyTheme(select.value, true));
  // Follow the OS light/dark setting live, until the user chooses a theme.
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (hasSavedTheme()) return;
      const theme = systemTheme();
      applyTheme(theme, false);
      select.value = theme;
    });
  } catch {
    // matchMedia unavailable: the initial scheme still applies
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
