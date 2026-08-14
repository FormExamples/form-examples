import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 15;

/** The fifteen evaluation sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Clinician Identification', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Presenting History', shortTitle: 'History' },
	{ number: 4, title: 'Oxford Hip Score', shortTitle: 'OHS' },
	{ number: 5, title: 'Functional Limitations', shortTitle: 'Function' },
	{ number: 6, title: 'Physical Examination — Gait and Biomechanical', shortTitle: 'Gait' },
	{ number: 7, title: 'Physical Examination — Range of Motion', shortTitle: 'Range of motion' },
	{ number: 8, title: 'Physical Examination — Stability and Muscle Strength', shortTitle: 'Stability' },
	{ number: 9, title: 'Diagnostic Imaging', shortTitle: 'Imaging' },
	{ number: 10, title: 'Conservative Treatment Audit', shortTitle: 'Conservative' },
	{ number: 11, title: 'General Health and Surgical Fitness Screen', shortTitle: 'Fitness' },
	{ number: 12, title: 'Pre-operative Baseline Bloods and Tests', shortTitle: 'Baseline tests' },
	{ number: 13, title: 'Shared Decision-making', shortTitle: 'Decision-making' },
	{ number: 14, title: 'Management Plan and Recommendation', shortTitle: 'Plan' },
	{ number: 15, title: 'Summary and Sign-off', shortTitle: 'Summary' }
];
