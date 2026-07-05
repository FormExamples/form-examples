import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven response-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Response Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Worker Identification', shortTitle: 'Worker' },
	{ number: 3, title: 'Decision', shortTitle: 'Decision' },
	{ number: 4, title: 'Adjustments Agreed', shortTitle: 'Adjustments' },
	{ number: 5, title: 'Trial & Review', shortTitle: 'Review' },
	{ number: 6, title: 'Support & Responsibilities', shortTitle: 'Support' },
	{ number: 7, title: 'Sign-off', shortTitle: 'Sign-off' }
];
