import type { ReportRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReportRow[] = [
	{
		id: 'EYE-2026-0001',
		patientName: 'Aisha Khan',
		testType: 'fundus-examination',
		reportStatus: 'final',
		reportedDate: '2026-06-02',
		resultClassification: 'critical',
		abnormalitySeverity: 'major',
		followUpUrgency: 'critical-alert',
		reportCompletenessPercent: 100,
		flagCount: 2
	},
	{
		id: 'EYE-2026-0002',
		patientName: 'Brian O’Connor',
		testType: 'tonometry',
		reportStatus: 'final',
		reportedDate: '2026-06-03',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'moderate',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'EYE-2026-0003',
		patientName: 'Carmen Diaz',
		testType: 'visual-acuity',
		reportStatus: 'final',
		reportedDate: '2026-06-04',
		resultClassification: 'normal',
		abnormalitySeverity: 'none',
		followUpUrgency: 'routine',
		reportCompletenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'EYE-2026-0004',
		patientName: 'David Müller',
		testType: 'fundus-examination',
		reportStatus: 'preliminary',
		reportedDate: '2026-06-05',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'EYE-2026-0005',
		patientName: 'Evelyn Wright',
		testType: 'visual-fields',
		reportStatus: 'final',
		reportedDate: '2026-06-06',
		resultClassification: 'inconclusive',
		abnormalitySeverity: 'none',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 80,
		flagCount: 1
	},
	{
		id: 'EYE-2026-0006',
		patientName: 'Farid Hassan',
		testType: 'visual-acuity',
		reportStatus: 'final',
		reportedDate: '2026-06-07',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'minor',
		followUpUrgency: 'recommended',
		reportCompletenessPercent: 100,
		flagCount: 1
	},
	{
		id: 'EYE-2026-0007',
		patientName: 'Grace Thompson',
		testType: 'optical-coherence-tomography',
		reportStatus: 'final',
		reportedDate: '2026-06-08',
		resultClassification: 'abnormal',
		abnormalitySeverity: 'major',
		followUpUrgency: 'urgent',
		reportCompletenessPercent: 100,
		flagCount: 1
	}
];
