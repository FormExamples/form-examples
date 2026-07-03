// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with critical-alert rows whose critical findings raised flags.

(function () {
'use strict';
window.CytologyTestResultDashboard =
  window.CytologyTestResultDashboard || {};

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'CYT-2026-0001',
    patientName: 'Aisha Khan',
    specimenType: 'cervical-smear',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'CYT-2026-0002',
    patientName: 'Brian O’Connor',
    specimenType: 'cervical-smear',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CYT-2026-0003',
    patientName: 'Carmen Diaz',
    specimenType: 'cervical-smear',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'CYT-2026-0004',
    patientName: 'David Müller',
    specimenType: 'fine-needle-aspiration-thyroid',
    reportStatus: 'final',
    reportedDate: '2026-06-05',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'CYT-2026-0005',
    patientName: 'Evelyn Wright',
    specimenType: 'urine-cytology',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'CYT-2026-0006',
    patientName: 'Farid Hassan',
    specimenType: 'cervical-smear',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CYT-2026-0007',
    patientName: 'Grace Thompson',
    specimenType: 'fine-needle-aspiration-breast',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-08',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 80,
    flagCount: 2
  }
];

window.CytologyTestResultDashboard.sampleReports = sampleReports;
})();
