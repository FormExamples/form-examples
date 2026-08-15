import type { CategoryCount, HospitalPerformanceIndicators, IndicatorsSummaryResult } from './types.js';
import { CATEGORIES, PERFORMANCE_INDICATORS } from '#lib/config/indicators.js';

/**
 * Pure completeness tally over the 50 Balanced Scorecard indicators — no
 * side effects, no scoring. An indicator counts as reported when its value
 * is a non-null number; notes alone do not count as reported. This is a
 * completeness tally, not a scored grading engine — there is no pass/fail
 * threshold on any indicator.
 */
export function summariseIndicators(data: HospitalPerformanceIndicators): IndicatorsSummaryResult {
  let reportedCount = 0;
  const byCategory = new Map<number, { reported: number; total: number }>();
  for (const category of CATEGORIES) {
    byCategory.set(category.number, { reported: 0, total: 0 });
  }

  for (const indicator of PERFORMANCE_INDICATORS) {
    const response = data.items[indicator.id];
    const isReported = response != null && response.value !== null && response.value !== undefined;

    const tally = byCategory.get(indicator.category);
    if (tally) {
      tally.total += 1;
      if (isReported) tally.reported += 1;
    }

    if (isReported) reportedCount += 1;
  }

  const categoryCounts: CategoryCount[] = CATEGORIES.map((category) => {
    const tally = byCategory.get(category.number) ?? { reported: 0, total: 0 };
    return {
      category: category.number,
      categoryTitle: category.title,
      reported: tally.reported,
      total: tally.total,
    };
  });

  return {
    reportedCount,
    totalCount: PERFORMANCE_INDICATORS.length,
    categoryCounts,
  };
}
