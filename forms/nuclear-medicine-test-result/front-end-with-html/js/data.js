// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with two critical-alert rows (a high-probability PE on V/Q and a
// widespread metastatic pattern on a bone scan).

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'NM-2026-0001',
    patientName: 'Aisha Khan',
    scanType: 'vq-lung-scan',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'NM-2026-0002',
    patientName: 'Brian O’Connor',
    scanType: 'bone-scan',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'NM-2026-0003',
    patientName: 'Carmen Diaz',
    scanType: 'thyroid-uptake',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'NM-2026-0004',
    patientName: 'David Müller',
    scanType: 'myocardial-perfusion',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'NM-2026-0005',
    patientName: 'Evelyn Wright',
    scanType: 'renal-mag3',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'NM-2026-0006',
    patientName: 'Farid Hassan',
    scanType: 'renal-dmsa',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'NM-2026-0007',
    patientName: 'Grace Thompson',
    scanType: 'gallium-octreotide',
    reportStatus: 'final',
    reportedDate: '2026-06-08',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  }
];

export { sampleReports };
