import type { ParamMatcher } from '@sveltejs/kit';

const STEP_MIN = 1;
const STEP_MAX = 14;

export const match: ParamMatcher = (param) => {
  const n = Number(param);
  return Number.isInteger(n) && n >= STEP_MIN && n <= STEP_MAX;
};
