import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'HOL-2026-0001',
		patientName: 'Aisha Khan',
		monitorType: '24-hour',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'HOL-2026-0002',
		patientName: 'Brian O’Connor',
		monitorType: '7-day',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'HOL-2026-0003',
		patientName: 'Carmen Diaz',
		monitorType: '24-hour',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'HOL-2026-0004',
		patientName: 'David Müller',
		monitorType: '48-hour',
		reportStatus: 'final',
		reportedDate: '2026-06-05',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'HOL-2026-0005',
		patientName: 'Evelyn Wright',
		monitorType: 'event-recorder',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-06',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'HOL-2026-0006',
		patientName: 'Farid Hassan',
		monitorType: '14-day',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'HOL-2026-0007',
		patientName: 'Grace Thompson',
		monitorType: 'implantable-loop-recorder',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
