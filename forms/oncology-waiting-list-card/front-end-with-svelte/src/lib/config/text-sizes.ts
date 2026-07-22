// The Lily text-size catalogue: WCAG 2.2 1.4.4 (Resize Text) support.
// Mapped to real typography via `:root[data-text-size]` rules in app.css.

/** A selectable reading text size: the slug and a human-readable label. */
export interface TextSizeOption {
	value: string;
	label: string;
}

/** The text sizes offered by the switcher. */
export const TEXT_SIZE_OPTIONS: TextSizeOption[] = [
	{ value: 'small', label: 'Small' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'large', label: 'Large' },
	{ value: 'x-large', label: 'X Large' }
];

/** The gold-standard default text size. */
export const DEFAULT_TEXT_SIZE = 'medium';

/** localStorage key for the persisted text-size selection. */
export const TEXT_SIZE_STORAGE_KEY = 'oncology-waiting-list-card.text-size.v1';
