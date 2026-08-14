import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 16;

/** The sixteen assessment sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment Context', shortTitle: 'Context' },
	{ number: 2, title: 'Patient and Procedural Demographics', shortTitle: 'Procedure' },
	{ number: 3, title: 'Medical and Surgical History', shortTitle: 'History' },
	{ number: 4, title: 'Medications', shortTitle: 'Medicines' },
	{ number: 5, title: 'Allergies and Intolerances', shortTitle: 'Allergies' },
	{ number: 6, title: 'Anaemia and Iron Studies', shortTitle: 'Anaemia' },
	{ number: 7, title: 'Glycaemic Control', shortTitle: 'Glycaemic' },
	{ number: 8, title: 'Smoking and Tobacco', shortTitle: 'Smoking' },
	{ number: 9, title: 'Alcohol and Other Substances', shortTitle: 'Alcohol' },
	{ number: 10, title: 'Nutritional Screening', shortTitle: 'Nutrition' },
	{ number: 11, title: 'Functional Capacity and Physical Fitness', shortTitle: 'Fitness' },
	{ number: 12, title: 'Frailty, Cognition and Falls', shortTitle: 'Frailty' },
	{ number: 13, title: 'Cardiorespiratory Optimization', shortTitle: 'Cardioresp' },
	{ number: 14, title: 'Psychological Readiness and Social Support', shortTitle: 'Readiness' },
	{ number: 15, title: 'Optimization Plan by Domain', shortTitle: 'Plan' },
	{ number: 16, title: 'Readiness Summary and Sign-off', shortTitle: 'Sign-off' }
];
