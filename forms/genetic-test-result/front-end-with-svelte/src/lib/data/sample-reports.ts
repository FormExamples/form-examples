import type { ReportRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'GEN-2026-0001',
		patientName: 'Aisha Khan',
		testType: 'gene-panel',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 4
	},
	{
		id: 'GEN-2026-0002',
		patientName: 'Brian O’Connor',
		testType: 'whole-exome',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'GEN-2026-0003',
		patientName: 'Carmen Diaz',
		testType: 'diagnostic-single-gene',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'GEN-2026-0004',
		patientName: 'David Müller',
		testType: 'carrier-testing',
		reportStatus: 'final',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'GEN-2026-0005',
		patientName: 'Evelyn Wright',
		testType: 'whole-genome',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-06',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 80,
		flagCount: 2
	},
	{
		id: 'GEN-2026-0006',
		patientName: 'Farid Hassan',
		testType: 'chromosomal-microarray',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 3
	},
	{
		id: 'GEN-2026-0007',
		patientName: 'Grace Thompson',
		testType: 'predictive-presymptomatic',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	}
];
