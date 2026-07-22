// Lily Design System — locale-select (headless, vanilla JS).
// Sets <html lang> and persists the choice, matching the
// front-end-with-svelte convention (front-end-with-svelte/src/lib/config/locales.ts).
// Presentation-only: no message catalogue is wired up for this form yet —
// see docs/i18n.md for the deferred rollout.

const STORAGE_KEY = 'pet-scan-test-request.locale.v1';
const DEFAULT_LOCALE = 'en-GB';

function readSavedLocale() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function applyLocale(locale, persist) {
  document.documentElement.lang = locale;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore quota / privacy errors
    }
  }
}

function init() {
  const select = document.getElementById('locale-select');
  const saved = readSavedLocale();
  applyLocale(saved, false);
  if (!select) return;
  select.value = saved;
  select.addEventListener('change', () => applyLocale(select.value, true));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
