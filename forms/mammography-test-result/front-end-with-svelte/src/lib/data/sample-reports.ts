import type { ReportRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'MAM-2026-0001',
		patientName: 'Aisha Khan',
		examType: 'screening',
		laterality: 'bilateral',
		biRadsCategory: '1',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'MAM-2026-0002',
		patientName: 'Brigid O’Connor',
		examType: 'screening',
		laterality: 'bilateral',
		biRadsCategory: '2',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'MAM-2026-0003',
		patientName: 'Carmen Diaz',
		examType: 'diagnostic',
		laterality: 'left',
		biRadsCategory: '3',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'MAM-2026-0004',
		patientName: 'Deborah Müller',
		examType: 'diagnostic',
		laterality: 'right',
		biRadsCategory: '4b',
		reportStatus: 'final',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 100,
		flagCount: 3
	},
	{
		id: 'MAM-2026-0005',
		patientName: 'Evelyn Wright',
		examType: 'symptomatic',
		laterality: 'right',
		biRadsCategory: '5',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 4
	},
	{
		id: 'MAM-2026-0006',
		patientName: 'Fatima Hassan',
		examType: 'diagnostic',
		laterality: 'bilateral',
		biRadsCategory: '0',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-07',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'MAM-2026-0007',
		patientName: 'Grace Adeyemi',
		examType: 'surveillance',
		laterality: 'left',
		biRadsCategory: '6',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
