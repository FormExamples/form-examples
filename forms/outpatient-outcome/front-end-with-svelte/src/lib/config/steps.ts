import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient Details', shortTitle: 'Patient' },
	{ number: 2, title: 'Encounter Details', shortTitle: 'Encounter' },
	{ number: 3, title: 'Operational Efficiency', shortTitle: 'Operational' },
	{ number: 4, title: 'Clinical Outcome', shortTitle: 'Clinical' },
	{ number: 5, title: 'PROM — EQ-5D-5L', shortTitle: 'EQ-5D-5L' },
	{ number: 6, title: 'PROM — Global Rating of Change', shortTitle: 'GRC' },
	{ number: 7, title: 'PROM — PROMIS Global Health', shortTitle: 'PROMIS' },
	{ number: 8, title: 'PREM — Friends & Family Test', shortTitle: 'FFT' },
	{ number: 9, title: 'Follow-up Plan', shortTitle: 'Follow-up' },
	{ number: 10, title: 'Sign-off', shortTitle: 'Sign-off' },
	{ number: 11, title: 'Review & Submit', shortTitle: 'Review' }
];
