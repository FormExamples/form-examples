// Plain-JavaScript type-shape helper mirroring the SvelteKit
// `src/lib/config/types.ts` data model for the Hospital Dashboard Metrics
// form.
//
// MetricResponse: { value: number | null, notes: string }

import { DASHBOARD_METRICS } from './metrics.js';

/** Build a fresh, fully-blank per-metric response map keyed by metric id. */
function emptyItems() {
  const items = {};
  DASHBOARD_METRICS.forEach(function (item) {
    items[item.id] = { value: null, notes: '' };
  });
  return items;
}

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to ''; numeric metric values default to null; the
 * `items` map has one entry per metric id.
 */
function emptyAssessment() {
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

export { emptyAssessment, emptyItems };
