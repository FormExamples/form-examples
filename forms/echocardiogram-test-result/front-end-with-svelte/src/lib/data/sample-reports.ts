import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'ECHO-2026-0001',
		patientName: 'Aisha Khan',
		echoType: 'transthoracic-tte',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 3
	},
	{
		id: 'ECHO-2026-0002',
		patientName: 'Brian O’Connor',
		echoType: 'transoesophageal-toe',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 3
	},
	{
		id: 'ECHO-2026-0003',
		patientName: 'Carmen Diaz',
		echoType: 'transthoracic-tte',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'ECHO-2026-0004',
		patientName: 'David Müller',
		echoType: 'transthoracic-tte',
		reportStatus: 'final',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'ECHO-2026-0005',
		patientName: 'Evelyn Wright',
		echoType: 'transthoracic-tte',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-06',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 83,
		flagCount: 1
	},
	{
		id: 'ECHO-2026-0006',
		patientName: 'Farid Hassan',
		echoType: 'stress-echo',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 83,
		flagCount: 1
	},
	{
		id: 'ECHO-2026-0007',
		patientName: 'Gabriela Santos',
		echoType: 'contrast-echo',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	}
];
