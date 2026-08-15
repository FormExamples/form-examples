import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Clinical History', shortTitle: 'History' },
	{ number: 3, title: 'Validity Controls', shortTitle: 'Validity' },
	{ number: 4, title: 'Allergens & Reactions', shortTitle: 'Allergens' },
	{ number: 5, title: 'Reaction Summary', shortTitle: 'Reactions' },
	{ number: 6, title: 'Interpretation & Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
