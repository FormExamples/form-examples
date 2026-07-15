// Sample graded-report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the
// two implementations show identical demo content when the backend is
// offline. The rows span every result classification (normal / abnormal /
// critical / inconclusive), the WHO densitometric ladder, and the follow-up
// urgency bands, with a critical-alert row whose severe osteoporosis raised
// three flags.

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'DXA-2026-0001',
    patientName: 'Aisha Khan',
    scanRegion: 'hip-and-spine',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    lowestTScore: -3.4,
    whoClassification: 'severe-osteoporosis',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'DXA-2026-0002',
    patientName: 'Brian O’Connor',
    scanRegion: 'hip',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    lowestTScore: -2.8,
    whoClassification: 'osteoporosis',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'DXA-2026-0003',
    patientName: 'Carmen Diaz',
    scanRegion: 'spine',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    lowestTScore: -1.8,
    whoClassification: 'osteopenia',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'DXA-2026-0004',
    patientName: 'David Müller',
    scanRegion: 'hip-and-spine',
    reportStatus: 'final',
    reportedDate: '2026-06-05',
    lowestTScore: -0.6,
    whoClassification: 'normal',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'DXA-2026-0005',
    patientName: 'Evelyn Wright',
    scanRegion: 'forearm',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-06',
    lowestTScore: null,
    whoClassification: '',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 2
  },
  {
    id: 'DXA-2026-0006',
    patientName: 'Farid Hassan',
    scanRegion: 'hip',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    lowestTScore: -2.6,
    whoClassification: 'osteoporosis',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 80,
    flagCount: 3
  },
  {
    id: 'DXA-2026-0007',
    patientName: 'Grace Thompson',
    scanRegion: 'hip-and-spine',
    reportStatus: 'final',
    reportedDate: '2026-06-08',
    lowestTScore: -1.2,
    whoClassification: 'osteopenia',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 0
  }
];

export { sampleReports };
