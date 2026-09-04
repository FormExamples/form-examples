// Summary tally for the Hospital Performance Indicators form — the pure
// engine counterpart of the SvelteKit `src/lib/engine/summary.ts`.
//
// There is no clinical grading engine for this form: it is balanced-scorecard
// KPI data entry with no pass/fail threshold on any indicator, so the
// "engine" is a completeness tally — how many indicators were recorded, per
// perspective. Pure function, no DOM, no side effects.

import { PERFORMANCE_INDICATORS, CATEGORIES } from './indicators.js';

/** An indicator value is recorded when it is any non-blank, non-null value. */
function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

/**
 * Tally the recorded indicators.
 *
 * @param {ReturnType<typeof import('./types.js').emptyAssessment>} data
 * @returns {{
 *   recordedCount: number,
 *   categoryCounts: Record<number, { recorded: number, total: number, title: string }>
 * }}
 */
function summariseIndicators(data) {
  let recordedCount = 0;
  const categoryCounts = {};
  CATEGORIES.forEach(function (c) {
    categoryCounts[c.number] = { recorded: 0, total: 0, title: c.title };
  });

  PERFORMANCE_INDICATORS.forEach(function (item) {
    categoryCounts[item.category].total += 1;
    const resp = (data.items && data.items[item.id]) || { value: null, notes: '' };
    if (isAnswered(resp.value)) {
      categoryCounts[item.category].recorded += 1;
      recordedCount += 1;
    }
  });

  return {
    recordedCount: recordedCount,
    categoryCounts: categoryCounts,
  };
}

export { isAnswered, summariseIndicators };
