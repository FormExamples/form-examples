import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'XM-2026-0001',
		patientName: 'Aisha Khan',
		requestType: 'crossmatch',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 3
	},
	{
		id: 'XM-2026-0002',
		patientName: 'Brian O’Connor',
		requestType: 'crossmatch',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'XM-2026-0003',
		patientName: 'Carmen Diaz',
		requestType: 'crossmatch',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'XM-2026-0004',
		patientName: 'David Müller',
		requestType: 'emergency-issue',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-05',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 80,
		flagCount: 2
	},
	{
		id: 'XM-2026-0005',
		patientName: 'Evelyn Wright',
		requestType: 'group-and-save',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'XM-2026-0006',
		patientName: 'Farid Hassan',
		requestType: 'antibody-screen',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'XM-2026-0007',
		patientName: 'Grace Thompson',
		requestType: 'crossmatch',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	}
];
