import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Param matcher for the `/operation-note/[step=step]/` route. Accepts the
 * integers 1..12 — matching the 12-step Medical Operation Note wizard
 * (Step 1 Operation identification through Step 12 Summary, grade & sign-off).
 */
export const match: ParamMatcher = (value) => /^(?:[1-9]|1[0-2])$/.test(value);
