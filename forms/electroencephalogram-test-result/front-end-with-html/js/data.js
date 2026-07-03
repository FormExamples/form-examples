// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with critical-alert rows whose critical findings raised flags.

(function () {
'use strict';
window.ElectroencephalogramTestResultDashboard =
  window.ElectroencephalogramTestResultDashboard || {};

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'EEG-2026-0001',
    patientName: 'Aisha Khan',
    eegType: 'video-telemetry',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'EEG-2026-0002',
    patientName: 'Brian O’Connor',
    eegType: 'routine-awake',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'EEG-2026-0003',
    patientName: 'Carmen Diaz',
    eegType: 'routine-awake',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'EEG-2026-0004',
    patientName: 'David Müller',
    eegType: 'sleep-deprived',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'EEG-2026-0005',
    patientName: 'Evelyn Wright',
    eegType: 'ambulatory-24h',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'EEG-2026-0006',
    patientName: 'Farid Hassan',
    eegType: 'routine-awake',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  }
];

window.ElectroencephalogramTestResultDashboard.sampleReports = sampleReports;
})();
