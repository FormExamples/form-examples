import type { ReportRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'TOX-2026-0001',
		patientName: 'Aisha Khan',
		suspectedAgent: 'Paracetamol',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'TOX-2026-0002',
		patientName: 'Brian O’Connor',
		suspectedAgent: 'Lithium',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'TOX-2026-0003',
		patientName: 'Carmen Diaz',
		suspectedAgent: 'Aspirin (salicylate)',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'TOX-2026-0004',
		patientName: 'David Müller',
		suspectedAgent: 'Paracetamol',
		reportStatus: 'final',
		reportedDate: '2026-06-05',
		resultClassification: 'normal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'TOX-2026-0005',
		patientName: 'Evelyn Wright',
		suspectedAgent: 'Carbon monoxide',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-06',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 80,
		flagCount: 2
	},
	{
		id: 'TOX-2026-0006',
		patientName: 'Farid Hassan',
		suspectedAgent: 'Unknown overdose',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'TOX-2026-0007',
		patientName: 'Grace Thompson',
		suspectedAgent: 'Digoxin',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
