import type { ReportRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'ANG-2026-0001',
		patientName: 'Aisha Khan',
		bodyRegion: 'mesenteric',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'ANG-2026-0002',
		patientName: 'Brian O’Connor',
		bodyRegion: 'renal',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'ANG-2026-0003',
		patientName: 'Carmen Diaz',
		bodyRegion: 'aorta',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'ANG-2026-0004',
		patientName: 'David Müller',
		bodyRegion: 'carotid',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'ANG-2026-0005',
		patientName: 'Evelyn Wright',
		bodyRegion: 'pulmonary',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'ANG-2026-0006',
		patientName: 'Farid Hassan',
		bodyRegion: 'coronary',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'ANG-2026-0007',
		patientName: 'Grace Thompson',
		bodyRegion: 'cerebral',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'ANG-2026-0008',
		patientName: 'Hiroshi Tanaka',
		bodyRegion: 'peripheral-lower-limb',
		reportStatus: 'final',
		reportedDate: '2026-06-09',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
