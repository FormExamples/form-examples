import type { ParamMatcher } from '@sveltejs/kit';

// Match step parameter as integer 1-15 inclusive.
export const match: ParamMatcher = (param) => {
  const n = Number(param);
  return Number.isInteger(n) && n >= 1 && n <= 15;
};
