import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'CT-2026-0001',
		patientName: 'Aisha Khan',
		bodyRegion: 'head',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'CT-2026-0002',
		patientName: 'Brian O’Connor',
		bodyRegion: 'chest',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'CT-2026-0003',
		patientName: 'Carmen Diaz',
		bodyRegion: 'abdomen-pelvis',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'CT-2026-0004',
		patientName: 'David Müller',
		bodyRegion: 'chest',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'CT-2026-0005',
		patientName: 'Evelyn Wright',
		bodyRegion: 'spine',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'CT-2026-0006',
		patientName: 'Farid Hassan',
		bodyRegion: 'abdomen',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
