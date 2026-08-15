import type { HospitalDashboardMetrics } from '#lib/engine/types.js';
import { DASHBOARD_METRICS } from '#lib/config/metrics.js';
import { summariseMetrics } from '#lib/engine/summary.js';
import { createDefaultMetrics } from '#lib/stores/metrics.svelte.js';

/** A sample reporting period: an identifier and the full data the engine tallies. */
export interface SampleReport {
  id: string;
  hospitalName: string;
  preparedByName: string;
  periodMonth: number | null;
  periodYear: number | null;
  data: HospitalDashboardMetrics;
}

/** A row in the administrator review dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  hospitalName: string;
  preparedByName: string;
  period: string;
  reportedCount: number;
  totalCount: number;
}

/**
 * Build a report recording the given metric ids with a value (and every
 * other metric left unanswered), so the sample reports have a realistic
 * mix rather than either all-blank or all-complete data.
 */
function build(
  reportingPeriod: Partial<HospitalDashboardMetrics['reportingPeriod']>,
  recordedValues: Record<string, number>,
  summary: Partial<HospitalDashboardMetrics['summary']> = {},
): HospitalDashboardMetrics {
  const d = createDefaultMetrics();
  d.reportingPeriod = { ...d.reportingPeriod, ...reportingPeriod };
  d.summary = { ...d.summary, ...summary };
  for (const metric of DASHBOARD_METRICS) {
    const value = recordedValues[metric.id];
    d.items[metric.id] = value !== undefined ? { value, notes: '' } : { value: null, notes: '' };
  }
  return d;
}

/** Fully complete report — every metric recorded. */
function complete(): HospitalDashboardMetrics {
  const values: Record<string, number> = {};
  for (const metric of DASHBOARD_METRICS) values[metric.id] = 1;
  return build(
    {
      hospitalName: 'Aurora District Hospital',
      periodMonth: 5,
      periodYear: 2026,
      preparedByName: 'Dr. Alice Hopper',
    },
    values,
    { overallNotes: 'All 67 metrics reported this period.' },
  );
}

/** Mostly complete, a handful of metrics not yet available. */
function mostlyComplete(): HospitalDashboardMetrics {
  const values: Record<string, number> = {};
  for (const metric of DASHBOARD_METRICS) values[metric.id] = 2;
  delete values['9.1'];
  delete values['13.1'];
  delete values['13.2'];
  delete values['13.3'];
  return build(
    {
      hospitalName: 'Borealis Community Health Centre',
      periodMonth: 5,
      periodYear: 2026,
      preparedByName: 'Bao Nguyen',
    },
    values,
    { overallNotes: 'OVR metrics pending from quality office; radiology awaiting radiation-safety officer sign-off.' },
  );
}

/** About half recorded — early in the reporting cycle. */
function halfway(): HospitalDashboardMetrics {
  const values: Record<string, number> = {};
  DASHBOARD_METRICS.forEach((metric, i) => {
    if (i % 2 === 0) values[metric.id] = 3;
  });
  return build(
    {
      hospitalName: 'Cobalt General Hospital',
      periodMonth: 6,
      periodYear: 2026,
      preparedByName: 'Carmen Diaz',
    },
    values,
  );
}

/** Just started — a few reporting-period fields filled, no metrics yet. */
function justStarted(): HospitalDashboardMetrics {
  return build(
    {
      hospitalName: 'Dusk Regional Medical Centre',
      periodMonth: 7,
      periodYear: 2026,
      preparedByName: 'Dmitri Volkov',
    },
    {},
  );
}

/** The sample reports, keyed by stable id (used to seed the wizard). */
export const sampleReports: SampleReport[] = [
  { id: 'HDM-2026-0001', hospitalName: 'Aurora District Hospital', preparedByName: 'Dr. Alice Hopper', periodMonth: 5, periodYear: 2026, data: complete() },
  { id: 'HDM-2026-0002', hospitalName: 'Borealis Community Health Centre', preparedByName: 'Bao Nguyen', periodMonth: 5, periodYear: 2026, data: mostlyComplete() },
  { id: 'HDM-2026-0003', hospitalName: 'Cobalt General Hospital', preparedByName: 'Carmen Diaz', periodMonth: 6, periodYear: 2026, data: halfway() },
  { id: 'HDM-2026-0004', hospitalName: 'Dusk Regional Medical Centre', preparedByName: 'Dmitri Volkov', periodMonth: 7, periodYear: 2026, data: justStarted() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleReportRows: DashboardRow[] = sampleReports.map((s) => {
  const result = summariseMetrics(s.data);
  const month = s.data.reportingPeriod.periodMonth;
  const year = s.data.reportingPeriod.periodYear;
  return {
    id: s.id,
    hospitalName: s.data.reportingPeriod.hospitalName,
    preparedByName: s.data.reportingPeriod.preparedByName,
    period: month && year ? `${String(month).padStart(2, '0')}/${year}` : '—',
    reportedCount: result.reportedCount,
    totalCount: result.totalCount,
  };
});
