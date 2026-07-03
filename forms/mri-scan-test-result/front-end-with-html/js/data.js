// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with a critical-alert row whose cord compression raised three flags.

(function () {
'use strict';
window.MriScanTestResultDashboard =
  window.MriScanTestResultDashboard || {};

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'MRI-2026-0001',
    patientName: 'Aisha Khan',
    bodyRegion: 'spine-thoracic',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'MRI-2026-0002',
    patientName: 'Brian O’Connor',
    bodyRegion: 'pelvis',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'MRI-2026-0003',
    patientName: 'Carmen Diaz',
    bodyRegion: 'brain',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'MRI-2026-0004',
    patientName: 'David Müller',
    bodyRegion: 'breast',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'MRI-2026-0005',
    patientName: 'Evelyn Wright',
    bodyRegion: 'spine-lumbar',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'MRI-2026-0006',
    patientName: 'Farid Hassan',
    bodyRegion: 'brain',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  }
];

window.MriScanTestResultDashboard.sampleReports = sampleReports;
})();
