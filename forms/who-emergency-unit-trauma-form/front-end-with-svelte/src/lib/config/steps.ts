import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 17;

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
		title: 'Exposure (E) & FAST (F)',
		shortTitle: 'Exposure & FAST',
		section: 'exposureAndFast'
	},
	{
		number: 10,
		title: 'Injury History',
		shortTitle: 'Injury Hx',
		section: 'injuryHistory'
	},
	{
		number: 11,
		title: 'Past Histories',
		shortTitle: 'Past Hx',
		section: 'pastHistories'
	},
	{
		number: 12,
		title: 'Physical Exam',
		shortTitle: 'PE',
		section: 'physicalExam'
	},
	{
		number: 13,
		title: 'Assessment & Plan',
		shortTitle: 'A&P',
		section: 'assessmentAndPlan'
	},
	{
		number: 14,
		title: 'Diagnostics',
		shortTitle: 'Diagnostics',
		section: 'diagnostics'
	},
	{
		number: 15,
		title: 'Medications & Procedures',
		shortTitle: 'Meds & Proc',
		section: 'medicationsAndProcedures'
	},
	{
		number: 16,
		title: 'Reassessment',
		shortTitle: 'Reassess',
		section: 'reassessment'
	},
	{
		number: 17,
		title: 'Disposition',
		shortTitle: 'Disposition',
		section: 'disposition'
	}
];
