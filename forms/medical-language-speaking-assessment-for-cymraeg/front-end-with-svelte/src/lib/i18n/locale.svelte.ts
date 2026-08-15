// Runes-based locale store for the i18n pilot.
//
// Mirrors the theme convention (a Svelte 5 `$state` value persisted to
// localStorage via `$effect.root`, plus a `<select>` switcher). The store owns
// the active UI locale and a `t(key)` helper that resolves a message key to the
// active locale's string, with `en` (the source locale) as the implicit fallback.

import { browser } from '$app/env';
import { messages, type Locale, type MessageKey } from './messages';

/** localStorage key for the persisted locale selection. */
export const LOCALE_STORAGE_KEY = 'medical-language-speaking-assessment-for-cymraeg.locale.v1';

/** The default UI locale: English (en-GB), the source locale. */
export const DEFAULT_LOCALE: Locale = 'en';

/** A selectable locale: the code and a human-readable, endonymic label. */
export interface LocaleOption {
	value: Locale;
	label: string;
}

/** The locales offered by the switcher, labelled in their own language. */
export const LOCALE_OPTIONS: LocaleOption[] = [
	{ value: 'en', label: 'English' },
	{ value: 'cy', label: 'Cymraeg' }
];

/** BCP-47 `lang` attribute value per locale (for `<html lang>` / screen readers). */
const HTML_LANG: Record<Locale, string> = {
	en: 'en-GB',
	cy: 'cy'
};

/** Narrow an arbitrary stored string to a known `Locale`. */
function isLocale(value: string | null): value is Locale {
	return value === 'en' || value === 'cy';
}

/**
 * Svelte 5 reactive locale store. The active locale is persisted to
 * localStorage and mirrored onto `<html lang>` so assistive technology
 * announces the correct language.
 */
class LocaleStore {
	/** The active UI locale. */
	current = $state<Locale>(DEFAULT_LOCALE);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
			if (isLocale(saved)) {
				this.current = saved;
			}
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(LOCALE_STORAGE_KEY, this.current);
					document.documentElement.lang = HTML_LANG[this.current];
				});
			});
		}
	}

	/** The BCP-47 language tag for the active locale. */
	get lang(): string {
		return HTML_LANG[this.current];
	}

	/** Set the active locale from an untyped `<select>` value, ignoring unknowns. */
	set = (value: string): void => {
		if (isLocale(value)) {
			this.current = value;
		}
	};

	/**
	 * Resolve a message key to the active locale's string. Reads the reactive
	 * `current`, so any template that calls `t(...)` re-renders on locale change.
	 * Falls back to the source locale (`en`) if a key is missing in the target.
	 */
	t = (key: MessageKey): string => {
		const table = messages[this.current] ?? messages[DEFAULT_LOCALE];
		return table[key] ?? messages[DEFAULT_LOCALE][key];
	};
}

/** The shared locale store instance. */
export const locale = new LocaleStore();
