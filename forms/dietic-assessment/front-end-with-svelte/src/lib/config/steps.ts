import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 16;

/** The sixteen assessment sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Dietitian Identification', shortTitle: 'Dietitian' },
	{ number: 2, title: 'Patient Identification and Referral', shortTitle: 'Patient' },
	{ number: 3, title: 'Medical History Review', shortTitle: 'History' },
	{ number: 4, title: 'Medication and Supplement Check', shortTitle: 'Medicines' },
	{ number: 5, title: 'Anthropometry and Physical Measurements', shortTitle: 'Measurements' },
	{ number: 6, title: 'Biochemistry and Clinical Monitoring', shortTitle: 'Bloods' },
	{ number: 7, title: 'Nutrition-focused Physical Examination', shortTitle: 'Examination' },
	{ number: 8, title: 'Dietary Recall', shortTitle: 'Dietary recall' },
	{ number: 9, title: 'Fluid Intake and Hydration', shortTitle: 'Fluids' },
	{ number: 10, title: 'Preferences, Allergies and Cultural Requirements', shortTitle: 'Preferences' },
	{ number: 11, title: 'Gastrointestinal and Swallowing', shortTitle: 'Gut' },
	{ number: 12, title: 'Lifestyle and Environment', shortTitle: 'Environment' },
	{ number: 13, title: 'Physical Activity and Function', shortTitle: 'Activity' },
	{ number: 14, title: 'Behavioural and Readiness to Change', shortTitle: 'Readiness' },
	{ number: 15, title: 'Screening Scores and Nutrition Diagnosis', shortTitle: 'Diagnosis' },
	{ number: 16, title: 'Nutrition Care Plan and Sign-off', shortTitle: 'Care plan' }
];
