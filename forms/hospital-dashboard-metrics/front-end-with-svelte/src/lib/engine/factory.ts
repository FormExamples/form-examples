import type { MetricResponse, HospitalDashboardMetrics } from './types.js';
import { DASHBOARD_METRICS } from '$lib/config/metrics.js';

function emptyItems(): Record<string, MetricResponse> {
  const out: Record<string, MetricResponse> = {};
  for (const metric of DASHBOARD_METRICS) {
    out[metric.id] = { value: null, notes: '' };
  }
  return out;
}

/** A blank hospital dashboard metrics report with all 67 metrics unanswered. */
export function createEmptyMetrics(): HospitalDashboardMetrics {
  return {
    reportingPeriod: {
      hospitalName: '',
      periodMonth: null,
      periodYear: null,
      preparedByName: '',
    },
    items: emptyItems(),
    summary: {
      overallNotes: '',
      signedAt: '',
    },
  };
}
