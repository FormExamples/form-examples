// Data model for the hospital performance indicators form. Authoritative —
// must match the HTML front-end built in parallel
// (front-end-with-html/js/types.js), and the SQL schema in ../../../../sql/.
// There is no clinical grading engine here — this is a strategic
// performance KPI report (a Balanced Scorecard, Kaplan & Norton), not a
// diagnostic instrument — so the engine output is a completeness tally
// (see summary.ts), not a scored grading engine.

export interface ReportingPeriod {
  hospitalName: string;
  /** 1-12, or null when unanswered. */
  periodMonth: number | null;
  periodYear: number | null;
  preparedByName: string;
}

export interface IndicatorResponse {
  value: number | null;
  notes: string;
}

export interface ScorecardSummary {
  overallNotes: string;
  signedAt: string;
}

export interface HospitalPerformanceIndicators {
  reportingPeriod: ReportingPeriod;
  /** Map of indicator id (e.g. '1.1', '2.15', '4.5') → response. */
  items: Record<string, IndicatorResponse>;
  summary: ScorecardSummary;
}

/** Per-category reported/total tally, as surfaced in the summary and dashboard. */
export interface CategoryCount {
  category: number;
  categoryTitle: string;
  reported: number;
  total: number;
}

/** Output of summariseIndicators() — a pure completeness tally, not a scored grading engine. */
export interface IndicatorsSummaryResult {
  reportedCount: number;
  totalCount: number;
  categoryCounts: CategoryCount[];
}
