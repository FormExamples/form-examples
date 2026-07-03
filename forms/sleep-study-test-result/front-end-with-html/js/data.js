// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with a critical-alert row whose severe OSA plus desaturation raised
// three flags.

(function () {
'use strict';
window.SleepStudyTestResultDashboard =
  window.SleepStudyTestResultDashboard || {};

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'SS-2026-0001',
    patientName: 'Aisha Khan',
    studyType: 'polysomnography',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'SS-2026-0002',
    patientName: 'Brian O’Connor',
    studyType: 'home-sleep-apnoea-test',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'SS-2026-0003',
    patientName: 'Carmen Diaz',
    studyType: 'overnight-oximetry',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'SS-2026-0004',
    patientName: 'David Müller',
    studyType: 'home-sleep-apnoea-test',
    reportStatus: 'final',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'SS-2026-0005',
    patientName: 'Evelyn Wright',
    studyType: 'multiple-sleep-latency-test',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'SS-2026-0006',
    patientName: 'Farid Hassan',
    studyType: 'polysomnography',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'SS-2026-0007',
    patientName: 'Grace Thompson',
    studyType: 'actigraphy',
    reportStatus: 'final',
    reportedDate: '2026-06-08',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  }
];

window.SleepStudyTestResultDashboard.sampleReports = sampleReports;
})();
