import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 16;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Patient Registration',
		shortTitle: 'Patient',
		section: 'patientRegistration'
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
		title: 'Airway (A)',
		shortTitle: 'Airway',
		section: 'airway'
	},
	{
		number: 5,
		title: 'Breathing (B)',
		shortTitle: 'Breathing',
		section: 'breathing'
	},
	{
		number: 6,
		title: 'Circulation (C)',
		shortTitle: 'Circulation',
		section: 'circulation'
	},
	{
		number: 7,
		title: 'Disability (D)',
		shortTitle: 'Disability',
		section: 'disability'
	},
	{
		number: 8,
		title: 'History of Present Illness',
		shortTitle: 'HPI',
		section: 'historyOfPresentIllness'
	},
	{
		number: 9,
		title: 'Review of Systems',
		shortTitle: 'ROS',
		section: 'reviewOfSystems'
	},
	{
		number: 10,
		title: 'Past Medical History',
		shortTitle: 'PMH',
		section: 'pastMedicalHistory'
	},
	{
		number: 11,
		title: 'Physical Exam',
		shortTitle: 'PE',
		section: 'physicalExam'
	},
	{
		number: 12,
		title: 'Diagnostics',
		shortTitle: 'Diagnostics',
		section: 'diagnostics'
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
		section: 'reassessment'
	},
	{
		number: 16,
		title: 'Disposition',
		shortTitle: 'Disposition',
		section: 'disposition'
	}
];
