// The Lily text-size catalogue: WCAG 2.2 1.4.4 (Resize Text) support.
// Mapped to real typography via `:root[data-text-size]` rules in app.css.
//
// The size set itself comes from `@lilydesignsystem/svelte-text-size-picker`'s
// own `DEFAULT_SIZES` -- the real Lily default seven-step scale -- rather
// than a hand-maintained four-value list, so it can never drift from
// upstream's own catalogue.

import { DEFAULT_SIZES } from "@lilydesignsystem/svelte-picker-bar";
import { sizeName } from "@lilydesignsystem/svelte-text-size-picker";

/** A selectable reading text size: the slug and a human-readable label. */
export interface TextSizeOption {
  value: string;
  label: string;
}

/** The text sizes offered by the switcher: every Lily default size. */
export const TEXT_SIZE_OPTIONS: TextSizeOption[] = DEFAULT_SIZES.map(
  (value) => ({ value, label: sizeName(value) }),
);

/** The gold-standard default text size. */
export const DEFAULT_TEXT_SIZE = "normal";

/** localStorage key for the persisted text-size selection. */
export const TEXT_SIZE_STORAGE_KEY = "geriatrics-waiting-list-card.text-size.v1";
