import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
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
