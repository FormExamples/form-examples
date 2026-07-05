import type { ReviewRow } from '$lib/engine/types';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ReviewRow[] = [
	{
		id: 'NARv-2026-0001',
		workerName: 'Sam Taylor',
		reviewStatus: 'completed',
		reviewDate: '2026-06-05',
		effectivenessBand: 'effective',
		wellbeingRiskBand: 'ok',
		nextStepUrgency: 'review-scheduled',
		completenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'NARv-2026-0002',
		workerName: 'Aisha Rahman',
		reviewStatus: 'changes-agreed',
		reviewDate: '2026-06-08',
		effectivenessBand: 'partially-effective',
		wellbeingRiskBand: 'caution',
		nextStepUrgency: 'adjust-now',
		completenessPercent: 94,
		flagCount: 1
	},
	{
		id: 'NARv-2026-0003',
		workerName: 'Daniel Okafor',
		reviewStatus: 'changes-agreed',
		reviewDate: '2026-06-11',
		effectivenessBand: 'ineffective',
		wellbeingRiskBand: 'high-risk',
		nextStepUrgency: 'adjust-now',
		completenessPercent: 88,
		flagCount: 3
	},
	{
		id: 'NARv-2026-0004',
		workerName: 'Grace Bennett',
		reviewStatus: 'escalated',
		reviewDate: '2026-06-14',
		effectivenessBand: 'ineffective',
		wellbeingRiskBand: 'high-risk',
		nextStepUrgency: 'escalate',
		completenessPercent: 82,
		flagCount: 2
	},
	{
		id: 'NARv-2026-0005',
		workerName: 'Marek Nowak',
		reviewStatus: 'draft',
		reviewDate: '2026-06-17',
		effectivenessBand: 'not-yet-assessed',
		wellbeingRiskBand: 'ok',
		nextStepUrgency: 'none',
		completenessPercent: 53,
		flagCount: 2
	},
	{
		id: 'NARv-2026-0006',
		workerName: 'Chloe Ferguson',
		reviewStatus: 'completed',
		reviewDate: '2026-06-19',
		effectivenessBand: 'effective',
		wellbeingRiskBand: 'caution',
		nextStepUrgency: 'review-scheduled',
		completenessPercent: 100,
		flagCount: 1
	}
];
