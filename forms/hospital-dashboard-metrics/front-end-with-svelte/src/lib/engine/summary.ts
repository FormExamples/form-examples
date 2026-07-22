import type { CategoryCount, HospitalDashboardMetrics, MetricsSummaryResult } from './types.js';
import { CATEGORIES, DASHBOARD_METRICS } from '$lib/config/metrics.js';

/**
 * Pure completeness tally over the 67 metrics — no side effects, no scoring.
 * A metric counts as reported when its value is a non-null number; notes
 * alone do not count as reported. This is a completeness tally, not a
 * scored grading engine — there is no pass/fail threshold on any metric.
 */
export function summariseMetrics(data: HospitalDashboardMetrics): MetricsSummaryResult {
  let reportedCount = 0;
  const byCategory = new Map<number, { reported: number; total: number }>();
  for (const category of CATEGORIES) {
    byCategory.set(category.number, { reported: 0, total: 0 });
  }

  for (const metric of DASHBOARD_METRICS) {
    const response = data.items[metric.id];
    const isReported = response != null && response.value !== null && response.value !== undefined;

    const tally = byCategory.get(metric.category);
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
    totalCount: DASHBOARD_METRICS.length,
    categoryCounts,
  };
}
