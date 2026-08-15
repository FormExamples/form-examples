import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Donor Type & Registration', shortTitle: 'Donor type', section: 'donorTypeRegistration' },
	{ number: 3, title: 'Medical History', shortTitle: 'History', section: 'medicalHistory' },
	{ number: 4, title: 'Organ Function Assessment', shortTitle: 'Organ function', section: 'organFunction' },
	{ number: 5, title: 'Infectious Disease Screening', shortTitle: 'Infection', section: 'infectiousDiseaseScreening' },
	{ number: 6, title: 'Immunological Assessment', shortTitle: 'Immunology', section: 'immunologicalAssessment' },
	{ number: 7, title: 'Surgical Assessment', shortTitle: 'Surgical', section: 'surgicalAssessment' },
	{ number: 8, title: 'Psychological Assessment (Living Donor)', shortTitle: 'Psychological', section: 'psychologicalAssessment', livingDonorOnly: true },
	{ number: 9, title: 'Ethical & Legal Requirements', shortTitle: 'Ethical / Legal', section: 'ethicalLegalRequirements', livingDonorOnly: true },
	{ number: 10, title: 'Eligibility & Allocation Decision', shortTitle: 'Eligibility', section: 'eligibilityAllocation' }
];
