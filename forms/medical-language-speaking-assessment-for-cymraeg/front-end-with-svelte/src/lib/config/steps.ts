import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Candidate Details', shortTitle: 'Candidate', section: 'candidate' },
	{
		number: 2,
		title: 'Role-play 1 — Sgwrs gyda Chlaf / Patient Conversation',
		shortTitle: 'Role-play 1',
		section: 'rolePlay1'
	},
	{
		number: 3,
		title: 'Role-play 2 — Esboniad Clinigol / Clinical Explanation',
		shortTitle: 'Role-play 2',
		section: 'rolePlay2'
	},
	{
		number: 4,
		title: 'Assessment Criteria Rating',
		shortTitle: 'Criteria',
		section: 'linguisticRolePlay1'
	},
	{
		number: 5,
		title: 'Overall CEFR Level & Feedback',
		shortTitle: 'Feedback',
		section: 'clinicalIndicators'
	}
];
