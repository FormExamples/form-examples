import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

/** The six review-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Review Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Worker Identification', shortTitle: 'Worker' },
	{ number: 3, title: 'Effectiveness', shortTitle: 'Effectiveness' },
	{ number: 4, title: 'Worker Experience', shortTitle: 'Experience' },
	{ number: 5, title: 'Changes & Next Steps', shortTitle: 'Changes' },
	{ number: 6, title: 'Sign-off', shortTitle: 'Sign-off' }
];
