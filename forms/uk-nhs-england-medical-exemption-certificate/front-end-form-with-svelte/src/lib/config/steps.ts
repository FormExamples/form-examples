import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Practitioner identification', shortTitle: 'Practitioner' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Existing exemption check', shortTitle: 'Existing' },
	{ number: 4, title: 'Age-based exclusion check', shortTitle: 'Age' },
	{ number: 5, title: 'Pregnancy / maternity check', shortTitle: 'Pregnancy' },
	{ number: 6, title: 'Qualifying condition selection', shortTitle: 'Conditions' },
	{ number: 7, title: 'Qualifying condition detail', shortTitle: 'Detail' },
	{ number: 8, title: 'Disability / appliance attestation', shortTitle: 'Attestation' },
	{ number: 9, title: 'Practitioner declaration', shortTitle: 'Declaration' },
	{ number: 10, title: 'Summary, eligibility result & sign-off', shortTitle: 'Summary' }
];
