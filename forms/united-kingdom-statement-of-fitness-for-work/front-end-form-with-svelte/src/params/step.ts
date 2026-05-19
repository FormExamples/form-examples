import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Param matcher for the `[step]` route segment.
 * Accepts the strings "1" through "10" only.
 */
export const match: ParamMatcher = (value) => {
  if (!/^\d{1,2}$/.test(value)) return false;
  const n = Number(value);
  return n >= 1 && n <= 10;
};
