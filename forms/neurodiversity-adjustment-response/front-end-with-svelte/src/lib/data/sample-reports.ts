import type { ResponseRow } from '#lib/engine/types.js';

/** In-memory sample data for the dashboard (back-end API fallback). */
export const sampleReports: ResponseRow[] = [
	{
		id: 'NAR-2026-0001',
		workerName: 'Sam Taylor',
		responseStatus: 'agreed',
		respondedDate: '2026-06-05',
		outcomeClassification: 'fully-agreed',
		legalRiskBand: 'ok',
		followUpUrgency: 'review-scheduled',
		completenessPercent: 100,
		flagCount: 0
	},
	{
		id: 'NAR-2026-0002',
		workerName: 'Aisha Rahman',
		responseStatus: 'partially-agreed',
		respondedDate: '2026-06-08',
		outcomeClassification: 'partially-agreed',
		legalRiskBand: 'caution',
		followUpUrgency: 'review-scheduled',
		completenessPercent: 94,
		flagCount: 1
	},
	{
		id: 'NAR-2026-0003',
		workerName: 'Daniel Okafor',
		responseStatus: 'declined',
		respondedDate: '2026-06-11',
		outcomeClassification: 'declined',
		legalRiskBand: 'high-risk',
		followUpUrgency: 'urgent-review',
		completenessPercent: 69,
		flagCount: 2
	},
	{
		id: 'NAR-2026-0004',
		workerName: 'Grace Bennett',
		responseStatus: 'trial',
		respondedDate: '2026-06-14',
		outcomeClassification: 'alternative-offered',
		legalRiskBand: 'caution',
		followUpUrgency: 'review-scheduled',
		completenessPercent: 88,
		flagCount: 1
	},
	{
		id: 'NAR-2026-0005',
		workerName: 'Marek Nowak',
		responseStatus: 'deferred',
		respondedDate: '2026-06-17',
		outcomeClassification: 'deferred',
		legalRiskBand: 'ok',
		followUpUrgency: 'none',
		completenessPercent: 75,
		flagCount: 1
	},
	{
		id: 'NAR-2026-0006',
		workerName: 'Chloe Ferguson',
		responseStatus: 'agreed',
		respondedDate: '2026-06-19',
		outcomeClassification: 'fully-agreed',
		legalRiskBand: 'caution',
		followUpUrgency: 'escalation-needed',
		completenessPercent: 100,
		flagCount: 1
	}
];
