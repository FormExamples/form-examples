import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Patient Identification',
		shortTitle: 'Patient',
		section: 'patientIdentification'
	},
	{
		number: 2,
		title: 'Referral & Transport',
		shortTitle: 'Referral',
		section: 'referralTransport'
	},
	{
		number: 3,
		title: 'Situation',
		shortTitle: 'Situation',
		section: 'situation'
	},
	{
		number: 4,
		title: 'Background',
		shortTitle: 'Background',
		section: 'background'
	},
	{
		number: 5,
		title: 'Major Bleeding (C)',
		shortTitle: 'Bleeding',
		section: 'majorBleeding'
	},
	{
		number: 6,
		title: 'Airway (A)',
		shortTitle: 'Airway',
		section: 'airway'
	},
	{
		number: 7,
		title: 'Breathing (B)',
		shortTitle: 'Breathing',
		section: 'breathing'
	},
	{
		number: 8,
		title: 'Circulation (C)',
		shortTitle: 'Circulation',
		section: 'circulation'
	},
	{
		number: 9,
		title: 'Disability (D)',
		shortTitle: 'Disability',
		section: 'disability'
	},
	{
		number: 10,
		title: 'Exposure / Other (E)',
		shortTitle: 'Exposure',
		section: 'exposure'
	},
	{
		number: 11,
		title: 'Recommendations',
		shortTitle: 'Recommendations',
		section: 'recommendations'
	},
	{
		number: 12,
		title: 'Responder Details',
		shortTitle: 'Responder',
		section: 'responderDetails'
	}
];
