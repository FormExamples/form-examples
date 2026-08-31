// The theme catalogue, vendored as standalone stylesheets under
// static/themes/<value>.css (see static/themes/light.css for the rationale:
// a hand-authored token file, not a copy of Lily's full component CSS).
//
// This is the single source for the site's multi-stylesheet setup: every
// entry here gets an always-loaded <link rel="stylesheet"> (see the
// {#each} in the root +layout.svelte's <svelte:head>), so ThemePicker's
// runtime switch is pure attribute mutation (`data-theme` on <html>) —
// no stylesheet fetch, ever, on toggle. Adding a theme is one entry here
// plus one CSS file; nothing else needs to change.

/** A selectable theme: the stylesheet basename and a human-readable label. */
export interface ThemeOption {
	value: string;
	label: string;
}

/** Every vendored theme, in catalogue order. */
export const THEME_OPTIONS: ThemeOption[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' }
];

/** The default theme. */
export const DEFAULT_THEME = 'light';

/** localStorage key for the persisted theme selection. */
export const THEME_STORAGE_KEY = 'form-examples.theme.v1';
