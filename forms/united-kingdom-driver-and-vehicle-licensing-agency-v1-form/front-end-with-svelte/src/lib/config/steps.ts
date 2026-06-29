import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 14;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Personal Details',
		shortTitle: 'About you',
		section: 'personalDetails'
	},
	{
		number: 2,
		title: 'Healthcare Professionals',
		shortTitle: 'Healthcare',
		section: 'healthcareProfessionals'
	},
	{
		number: 3,
		title: 'Eyesight Standards',
		shortTitle: 'Q1 Eyesight',
		section: 'eyesightStandards'
	},
	{
		number: 4,
		title: 'Vision in Both Eyes',
		shortTitle: 'Q2 Both eyes',
		section: 'visionInBothEyes'
	},
	{
		number: 5,
		title: 'Field of Vision',
		shortTitle: 'Q3 Visual field',
		section: 'fieldOfVision'
	},
	{
		number: 6,
		title: 'Glaucoma',
		shortTitle: 'Q4 Glaucoma',
		section: 'glaucoma'
	},
	{
		number: 7,
		title: 'Retinitis Pigmentosa',
		shortTitle: 'Q5 RP',
		section: 'retinitisPigmentosa'
	},
	{
		number: 8,
		title: 'Laser Treatment',
		shortTitle: 'Q6 Laser',
		section: 'laserTreatment'
	},
	{
		number: 9,
		title: 'Blepharospasm',
		shortTitle: 'Q7 Blepharospasm',
		section: 'blepharospasm'
	},
	{
		number: 10,
		title: 'Night Blindness',
		shortTitle: 'Q8 Night blindness',
		section: 'nightBlindness'
	},
	{
		number: 11,
		title: 'Double Vision',
		shortTitle: 'Q9 Double vision',
		section: 'doubleVision'
	},
	{
		number: 12,
		title: 'Other Vision Conditions',
		shortTitle: 'Q10 Other',
		section: 'otherVisionConditions'
	},
	{
		number: 13,
		title: 'Recent Contact',
		shortTitle: 'Q11 Recent contact',
		section: 'recentContact'
	},
	{
		number: 14,
		title: 'Authorisation',
		shortTitle: 'Authorisation',
		section: 'authorisation'
	}
];
