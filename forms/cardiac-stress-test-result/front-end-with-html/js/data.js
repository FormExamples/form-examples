// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the severity ladder, and the follow-up urgency
// bands, with critical-alert rows whose critical results raised two flags.

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'CST-2026-0001',
    patientName: 'Aisha Khan',
    testType: 'exercise-treadmill-ecg',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'CST-2026-0002',
    patientName: 'Brian O’Connor',
    testType: 'exercise-treadmill-ecg',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CST-2026-0003',
    patientName: 'Carmen Diaz',
    testType: 'exercise-treadmill-ecg',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'CST-2026-0004',
    patientName: 'David Müller',
    testType: 'stress-echo',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 80,
    flagCount: 2
  },
  {
    id: 'CST-2026-0005',
    patientName: 'Evelyn Wright',
    testType: 'myocardial-perfusion-spect',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'CST-2026-0006',
    patientName: 'Farid Hassan',
    testType: 'dobutamine-stress-echo',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CST-2026-0007',
    patientName: 'Grace Thompson',
    testType: 'stress-cardiac-mri',
    reportStatus: 'final',
    reportedDate: '2026-06-08',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  }
];

export { sampleReports };
