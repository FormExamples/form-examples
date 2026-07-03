// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with critical-alert rows whose bladder tumours raised two flags.

(function () {
'use strict';
window.CystoscopyTestResultDashboard =
  window.CystoscopyTestResultDashboard || {};

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'CYS-2026-0001',
    patientName: 'Aisha Khan',
    procedure: 'flexible-cystoscopy',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'CYS-2026-0002',
    patientName: 'Brian O’Connor',
    procedure: 'flexible-cystoscopy',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CYS-2026-0003',
    patientName: 'Carmen Diaz',
    procedure: 'flexible-cystoscopy',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'CYS-2026-0004',
    patientName: 'David Müller',
    procedure: 'rigid-cystoscopy',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 80,
    flagCount: 2
  },
  {
    id: 'CYS-2026-0005',
    patientName: 'Evelyn Wright',
    procedure: 'flexible-cystoscopy',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'CYS-2026-0006',
    patientName: 'Farid Hassan',
    procedure: 'flexible-cystoscopy',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  }
];

window.CystoscopyTestResultDashboard.sampleReports = sampleReports;
})();
