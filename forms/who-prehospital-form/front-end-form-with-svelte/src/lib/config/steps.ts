import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 16;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Caller & Scene',
		shortTitle: 'Caller',
		section: 'callerAndScene'
	},
	{
		number: 2,
		title: 'Chief Complaint & Vitals',
		shortTitle: 'Vitals',
		section: 'chiefComplaintAndVitals'
	},
	{
		number: 3,
		title: 'High Risk Signs',
		shortTitle: 'High Risk',
		section: 'highRiskSigns'
	},
	{
		number: 4,
		title: 'Triage',
		shortTitle: 'Triage',
		section: 'triage'
	},
	{
		number: 5,
		title: 'Airway (A)',
		shortTitle: 'Airway',
		section: 'airway'
	},
	{
		number: 6,
		title: 'Breathing (B)',
		shortTitle: 'Breathing',
		section: 'breathing'
	},
	{
		number: 7,
		title: 'Circulation (C)',
		shortTitle: 'Circulation',
		section: 'circulation'
	},
	{
		number: 8,
		title: 'Disability (D)',
		shortTitle: 'Disability',
		section: 'disability'
	},
	{
		number: 9,
		title: 'Exposure (E)',
		shortTitle: 'Exposure',
		section: 'exposure'
	},
	{
		number: 10,
		title: 'SAMPLE History',
		shortTitle: 'SAMPLE',
		section: 'sampleHistory'
	},
	{
		number: 11,
		title: 'Injury Details',
		shortTitle: 'Injury',
		section: 'injuryDetails'
	},
	{
		number: 12,
		title: 'Physical Exam',
		shortTitle: 'PE',
		section: 'physicalExam'
	},
	{
		number: 13,
		title: 'Additional Interventions',
		shortTitle: 'Interventions',
		section: 'additionalInterventions'
	},
	{
		number: 14,
		title: 'Assessment & Plan',
		shortTitle: 'A&P',
		section: 'assessmentAndPlan'
	},
	{
		number: 15,
		title: 'Reassessment',
		shortTitle: 'Reassess',
		section: 'reassessments'
	},
	{
		number: 16,
		title: 'Disposition',
		shortTitle: 'Disposition',
		section: 'disposition'
	}
];
