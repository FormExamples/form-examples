import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 14;

/** The fourteen questionnaire sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment Context', shortTitle: 'Context' },
	{ number: 2, title: 'Personal Details', shortTitle: 'Personal details' },
	{ number: 3, title: 'Lifestyle — Activity and Diet', shortTitle: 'Activity and diet' },
	{ number: 4, title: 'Lifestyle — Smoking and Alcohol', shortTitle: 'Smoking and alcohol' },
	{ number: 5, title: 'Medical History', shortTitle: 'Medical history' },
	{ number: 6, title: 'Family History', shortTitle: 'Family history' },
	{ number: 7, title: 'Symptom Review', shortTitle: 'Symptoms' },
	{ number: 8, title: 'PAR-Q+ General Health Screen', shortTitle: 'PAR-Q+' },
	{ number: 9, title: 'Vital Signs / Basic Measurements', shortTitle: 'Measurements' },
	{ number: 10, title: 'Occupational / Role-specific Factors', shortTitle: 'Occupational' },
	{ number: 11, title: 'Mental Health and Wellbeing Check', shortTitle: 'Wellbeing' },
	{ number: 12, title: 'Vaccination Status', shortTitle: 'Vaccination' },
	{ number: 13, title: 'Consent and Data', shortTitle: 'Consent' },
	{ number: 14, title: 'Summary and Recommendation', shortTitle: 'Summary' }
];
