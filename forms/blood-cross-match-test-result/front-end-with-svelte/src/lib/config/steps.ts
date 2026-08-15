import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Clinical Context', shortTitle: 'Context' },
	{ number: 3, title: 'ABO / RhD Grouping', shortTitle: 'Grouping' },
	{ number: 4, title: 'Antibody Screen', shortTitle: 'Antibodies' },
	{ number: 5, title: 'Crossmatch & Components', shortTitle: 'Crossmatch' },
	{ number: 6, title: 'Identity & Overall Result', shortTitle: 'Result' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
