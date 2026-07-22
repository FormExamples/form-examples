// Plain-JavaScript type-shape helper mirroring the SvelteKit
// `src/lib/config/types.ts` data model for the Hospital Performance
// Indicators form.
//
// IndicatorResponse: { value: number | null, notes: string }

import { PERFORMANCE_INDICATORS } from './indicators.js';

/** Build a fresh, fully-blank per-indicator response map keyed by indicator id. */
function emptyItems() {
  const items = {};
  PERFORMANCE_INDICATORS.forEach(function (item) {
    items[item.id] = { value: null, notes: '' };
  });
  return items;
}

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to ''; numeric indicator values default to null; the
 * `items` map has one entry per indicator id.
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
