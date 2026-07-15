// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with two critical-alert rows (a bacterial pattern and an SAH pattern).

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'LP-2026-0001',
    patientName: 'Aisha Khan',
    reportingCategory: 'bacterial-pattern',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'LP-2026-0002',
    patientName: 'Brian O’Connor',
    reportingCategory: 'SAH-pattern',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'LP-2026-0003',
    patientName: 'Carmen Diaz',
    reportingCategory: 'normal',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'LP-2026-0004',
    patientName: 'David Müller',
    reportingCategory: 'viral-pattern',
    reportStatus: 'final',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'LP-2026-0005',
    patientName: 'Evelyn Wright',
    reportingCategory: 'inflammatory-demyelinating',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'LP-2026-0006',
    patientName: 'Farid Hassan',
    reportingCategory: 'indeterminate',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-07',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 60,
    flagCount: 1
  }
];

export { sampleReports };
