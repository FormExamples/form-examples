import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 8;
};
