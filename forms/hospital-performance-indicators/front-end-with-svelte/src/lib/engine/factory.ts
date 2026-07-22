import type { IndicatorResponse, HospitalPerformanceIndicators } from './types.js';
import { PERFORMANCE_INDICATORS } from '$lib/config/indicators.js';

function emptyItems(): Record<string, IndicatorResponse> {
  const out: Record<string, IndicatorResponse> = {};
  for (const indicator of PERFORMANCE_INDICATORS) {
    out[indicator.id] = { value: null, notes: '' };
  }
  return out;
}

/** A blank hospital performance indicators report with all 50 indicators unanswered. */
export function createEmptyIndicators(): HospitalPerformanceIndicators {
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
