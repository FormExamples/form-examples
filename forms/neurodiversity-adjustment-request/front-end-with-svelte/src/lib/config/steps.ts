import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

/** The eight request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Worker and Role', shortTitle: 'Worker' },
	{ number: 2, title: 'Handler', shortTitle: 'Handler' },
	{ number: 3, title: 'Neurodivergent Profile', shortTitle: 'Profile' },
	{ number: 4, title: 'Functional Difficulties', shortTitle: 'Difficulties' },
	{ number: 5, title: 'Requested Adjustments', shortTitle: 'Adjustments' },
	{ number: 6, title: 'Evidence and Support', shortTitle: 'Evidence' },
	{ number: 7, title: 'Impact and Urgency', shortTitle: 'Impact' },
	{ number: 8, title: 'Review and Submit', shortTitle: 'Review' }
];
