import type { HospitalPerformanceIndicators } from '#lib/engine/types.js';
import { PERFORMANCE_INDICATORS } from '#lib/config/indicators.js';
import { summariseIndicators } from '#lib/engine/summary.js';
import { createDefaultIndicators } from '#lib/stores/indicators.svelte.js';

/** A sample reporting period: an identifier and the full data the engine tallies. */
export interface SampleReport {
  id: string;
  hospitalName: string;
  preparedByName: string;
  periodMonth: number | null;
  periodYear: number | null;
  data: HospitalPerformanceIndicators;
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
 * Build a report recording the given indicator ids with a value (and every
 * other indicator left unanswered), so the sample reports have a realistic
 * mix rather than either all-blank or all-complete data.
 */
function build(
  reportingPeriod: Partial<HospitalPerformanceIndicators['reportingPeriod']>,
  recordedValues: Record<string, number>,
  summary: Partial<HospitalPerformanceIndicators['summary']> = {},
): HospitalPerformanceIndicators {
  const d = createDefaultIndicators();
  d.reportingPeriod = { ...d.reportingPeriod, ...reportingPeriod };
  d.summary = { ...d.summary, ...summary };
  for (const indicator of PERFORMANCE_INDICATORS) {
    const value = recordedValues[indicator.id];
    d.items[indicator.id] = value !== undefined ? { value, notes: '' } : { value: null, notes: '' };
  }
  return d;
}

/** Fully complete report — every indicator recorded. */
function complete(): HospitalPerformanceIndicators {
  const values: Record<string, number> = {};
  for (const indicator of PERFORMANCE_INDICATORS) values[indicator.id] = 1;
  return build(
    {
      hospitalName: 'Aurora District Hospital',
      periodMonth: 5,
      periodYear: 2026,
      preparedByName: 'Dr. Alice Hopper',
    },
    values,
    { overallNotes: 'All 50 Balanced Scorecard indicators reported this period.' },
  );
}

/** Mostly complete, a handful of indicators not yet available. */
function mostlyComplete(): HospitalPerformanceIndicators {
  const values: Record<string, number> = {};
  for (const indicator of PERFORMANCE_INDICATORS) values[indicator.id] = 2;
  delete values['3.5'];
  delete values['3.6'];
  delete values['4.4'];
  delete values['4.5'];
  return build(
    {
      hospitalName: 'Borealis Community Health Centre',
      periodMonth: 5,
      periodYear: 2026,
      preparedByName: 'Bao Nguyen',
    },
    values,
    { overallNotes: 'Learning and Growth / Customer indicators pending from HR and quality office.' },
  );
}

/** About half recorded — early in the reporting cycle. */
function halfway(): HospitalPerformanceIndicators {
  const values: Record<string, number> = {};
  PERFORMANCE_INDICATORS.forEach((indicator, i) => {
    if (i % 2 === 0) values[indicator.id] = 3;
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

/** Just started — a few reporting-period fields filled, no indicators yet. */
function justStarted(): HospitalPerformanceIndicators {
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
  { id: 'HPI-2026-0001', hospitalName: 'Aurora District Hospital', preparedByName: 'Dr. Alice Hopper', periodMonth: 5, periodYear: 2026, data: complete() },
  { id: 'HPI-2026-0002', hospitalName: 'Borealis Community Health Centre', preparedByName: 'Bao Nguyen', periodMonth: 5, periodYear: 2026, data: mostlyComplete() },
  { id: 'HPI-2026-0003', hospitalName: 'Cobalt General Hospital', preparedByName: 'Carmen Diaz', periodMonth: 6, periodYear: 2026, data: halfway() },
  { id: 'HPI-2026-0004', hospitalName: 'Dusk Regional Medical Centre', preparedByName: 'Dmitri Volkov', periodMonth: 7, periodYear: 2026, data: justStarted() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleReportRows: DashboardRow[] = sampleReports.map((s) => {
  const result = summariseIndicators(s.data);
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
