// This site has no translated content, so the catalogue is a single locale
// rather than the fleet's four-locale set — LocalePicker still needs a
// non-empty `locales` list (PickerBar's `locales` prop is required, not
// optional), but there is nothing to switch between yet. Add entries here
// the day this site's content is actually translated.

/** A selectable locale: the BCP-47-ish code and a human-readable label. */
export interface LocaleOption {
	value: string;
	label: string;
}

/** The one locale this site's content exists in. */
export const LOCALE_OPTIONS: LocaleOption[] = [{ value: 'en', label: 'English' }];

/** The only selectable locale, so also the default. */
export const DEFAULT_LOCALE = 'en';

/** localStorage key for the persisted locale selection. */
export const LOCALE_STORAGE_KEY = 'form-examples.locale.v1';
