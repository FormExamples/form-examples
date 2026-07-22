// Data model for the hospital dashboard metrics form. Authoritative — must
// match the HTML front-end built in parallel (front-end-with-html/js/types.js),
// and the SQL schema in ../../../../sql/. There is no clinical grading engine
// here — this is an operational KPI dashboard, not a diagnostic instrument —
// so the engine output is a completeness tally (see summary.ts), not a
// scored grading engine.

export interface ReportingPeriod {
  hospitalName: string;
  /** 1-12, or null when unanswered. */
  periodMonth: number | null;
  periodYear: number | null;
  preparedByName: string;
}

export interface MetricResponse {
  value: number | null;
  notes: string;
}

export interface DashboardSummary {
  overallNotes: string;
  signedAt: string;
}

export interface HospitalDashboardMetrics {
  reportingPeriod: ReportingPeriod;
  /** Map of metric id (e.g. '1.1', '4.3', '14.6') → response. */
  items: Record<string, MetricResponse>;
  summary: DashboardSummary;
}

/** Per-category reported/total tally, as surfaced in the summary and dashboard. */
export interface CategoryCount {
  category: number;
  categoryTitle: string;
  reported: number;
  total: number;
}

/** Output of summariseMetrics() — a pure completeness tally, not a scored grading engine. */
export interface MetricsSummaryResult {
  reportedCount: number;
  totalCount: number;
  categoryCounts: CategoryCount[];
}
