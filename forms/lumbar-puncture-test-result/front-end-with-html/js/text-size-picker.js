// Lily Design System — text-size-picker (headless, vanilla JS).
// Sets <html data-text-size> and persists the choice, matching the
// front-end-with-svelte convention (front-end-with-svelte/src/lib/config/text-sizes.ts).
// Supports WCAG 2.2 1.4.4 (Resize Text) / 1.4.12 (Text Spacing).

const STORAGE_KEY = 'lumbar-puncture-test-result.text-size.v1';
const DEFAULT_TEXT_SIZE = 'medium';

function readSavedTextSize() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEXT_SIZE;
  } catch {
    return DEFAULT_TEXT_SIZE;
  }
}

function applyTextSize(size, persist) {
  document.documentElement.dataset.textSize = size;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {
      // ignore quota / privacy errors
    }
  }
}

function init() {
  const select = document.getElementById('text-size-picker');
  const saved = readSavedTextSize();
  applyTextSize(saved, false);
  if (!select) return;
  select.value = saved;
  select.addEventListener('change', () => applyTextSize(select.value, true));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
