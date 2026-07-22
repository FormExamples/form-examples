// Lily Design System — theme-select (headless, vanilla JS).
// Applies the chosen Lily theme by swapping the single swappable
// <link id="theme-stylesheet"> href — the HTML analogue of the
// front-end-with-svelte convention (front-end-with-svelte/src/lib/config/themes.ts).
// A blocking inline script in <head> already applies any saved choice before
// first paint; this module only wires up the <select> once the DOM is ready.

const STORAGE_KEY = 'cognitive-assessment.theme.v1';
const DEFAULT_THEME = 'light';

function themeHref(theme) {
  return `css/themes/${theme}.css`;
}

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
