import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Param matcher for the `/checklist/[step=step]/` route. Accepts the integers
 * 0, 1, 2, 3, 4 — matching the WHO Surgical Safety Checklist five wizard
 * steps (Step 0 Case Details through Step 4 Summary).
 */
export const match: ParamMatcher = (value) => /^[0-4]$/.test(value);
