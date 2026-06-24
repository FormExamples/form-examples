import type { ReportRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'MC-2026-0001',
		patientName: 'Aisha Khan',
		specimenType: 'blood-culture',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'MC-2026-0002',
		patientName: 'Brian O’Connor',
		specimenType: 'urine',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'MC-2026-0003',
		patientName: 'Carmen Diaz',
		specimenType: 'urine',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'MC-2026-0004',
		patientName: 'David Müller',
		specimenType: 'wound-swab',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 80,
		flagCount: 2
	},
	{
		id: 'MC-2026-0005',
		patientName: 'Evelyn Wright',
		specimenType: 'csf',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'MC-2026-0006',
		patientName: 'Farid Hassan',
		specimenType: 'sputum',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'MC-2026-0007',
		patientName: 'Grace Thompson',
		specimenType: 'catheter-tip',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
