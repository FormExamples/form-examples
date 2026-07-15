// Sample report data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span the four result classifications, all follow-up urgencies, and a
// range of completeness percentages and flag counts.

/** @type {import('./dashboard-types.js').ReportRow[]} */
const sampleReports = [
  {
    id: 'BX-2026-0001',
    patientName: 'Aisha Khan',
    biopsySite: 'breast',
    reportStatus: 'final',
    reportedDate: '2026-06-02',
    resultClassification: 'critical',
    abnormalitySeverity: 'major',
    followUpUrgency: 'critical-alert',
    reportCompletenessPercent: 100,
    flagCount: 2
  },
  {
    id: 'BX-2026-0002',
    patientName: 'Brian O’Connor',
    biopsySite: 'prostate',
    reportStatus: 'final',
    reportedDate: '2026-06-03',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'moderate',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'BX-2026-0003',
    patientName: 'Carmen Diaz',
    biopsySite: 'skin',
    reportStatus: 'final',
    reportedDate: '2026-06-04',
    resultClassification: 'normal',
    abnormalitySeverity: 'none',
    followUpUrgency: 'routine',
    reportCompletenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'BX-2026-0004',
    patientName: 'David Müller',
    biopsySite: 'lung',
    reportStatus: 'preliminary',
    reportedDate: '2026-06-05',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'major',
    followUpUrgency: 'urgent',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'BX-2026-0005',
    patientName: 'Evelyn Wright',
    biopsySite: 'lymph-node',
    reportStatus: 'final',
    reportedDate: '2026-06-06',
    resultClassification: 'inconclusive',
    abnormalitySeverity: 'none',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'BX-2026-0006',
    patientName: 'Farid Hassan',
    biopsySite: 'gi-tract',
    reportStatus: 'final',
    reportedDate: '2026-06-07',
    resultClassification: 'abnormal',
    abnormalitySeverity: 'minor',
    followUpUrgency: 'recommended',
    reportCompletenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'BX-2026-0007',
    patientName: 'Grace Thompson',
    biopsySite: 'thyroid',
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
