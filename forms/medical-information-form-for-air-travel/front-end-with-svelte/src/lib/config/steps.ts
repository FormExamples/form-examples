// The 14 MEDIF wizard sections, in order. Used to render the StepList header.

/** A wizard section: its 1-indexed number, full title, and short label. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 14;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Submitting agent', shortTitle: 'Submitter' },
	{ number: 2, title: 'Passenger identification', shortTitle: 'Passenger' },
	{ number: 3, title: 'Trip details', shortTitle: 'Trip' },
	{ number: 4, title: 'Reason MEDIF is required', shortTitle: 'Reasons' },
	{ number: 5, title: 'Attending physician', shortTitle: 'Physician' },
	{ number: 6, title: 'Diagnosis', shortTitle: 'Diagnosis' },
	{ number: 7, title: 'Cardiovascular', shortTitle: 'Cardiac' },
	{ number: 8, title: 'Respiratory', shortTitle: 'Respiratory' },
	{ number: 9, title: 'Recent events / surgery', shortTitle: 'Recent events' },
	{ number: 10, title: 'Pregnancy', shortTitle: 'Pregnancy' },
	{ number: 11, title: 'Communicable disease', shortTitle: 'Communicable' },
	{ number: 12, title: 'In-flight requirements', shortTitle: 'In-flight' },
	{ number: 13, title: 'Cabin medications & equipment', shortTitle: 'Cabin meds' },
	{ number: 14, title: 'Sign-off', shortTitle: 'Sign-off' }
];
