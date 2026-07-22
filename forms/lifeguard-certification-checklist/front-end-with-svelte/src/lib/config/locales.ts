// The UI locales currently seeded across this repo (see root index.md).
// Presentation-only: switching locale sets <html lang> and persists the
// choice, matching the Lily theme-select convention. No message catalogue
// is wired up for this form yet — see docs/i18n.md for the deferred rollout.

/** A selectable UI locale: a BCP 47 tag and a human-readable label. */
export interface LocaleOption {
	value: string;
	label: string;
}

/** Every seeded locale, in catalogue order. */
export const LOCALE_OPTIONS: LocaleOption[] = [
	{ value: 'en-GB', label: 'English (UK)' },
	{ value: 'en-US', label: 'English (US)' },
	{ value: 'cy-GB', label: 'Cymraeg' },
	{ value: 'de-DE', label: 'Deutsch' }
];

/** The gold-standard default locale. */
export const DEFAULT_LOCALE = 'en-GB';

/** localStorage key for the persisted locale selection. */
export const LOCALE_STORAGE_KEY = 'lifeguard-certification-checklist.locale.v1';
