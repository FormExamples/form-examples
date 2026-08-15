import type { StepConfig, DeathCertificate } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Certification context',
		shortTitle: 'Certification',
		section: 'certification'
	},
	{
		number: 2,
		title: 'Deceased identification',
		shortTitle: 'Deceased',
		section: 'deceased'
	},
	{ number: 3, title: 'Death details', shortTitle: 'Death', section: 'death' },
	{
		number: 4,
		title: 'Part I — direct causal sequence',
		shortTitle: 'Part I',
		section: 'partI'
	},
	{
		number: 5,
		title: 'Part II — contributory conditions',
		shortTitle: 'Part II',
		section: 'partII'
	},
	{
		number: 6,
		title: 'Coroner and medical-examiner referral',
		shortTitle: 'Referral',
		section: 'referral'
	}
];

export function getVisibleSteps(_data: DeathCertificate): StepConfig[] {
	// All steps are always visible in the death-certification wizard.
	return steps;
}

export function getNextStep(current: number, data: DeathCertificate): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: DeathCertificate): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: DeathCertificate): boolean {
	return steps.some((s) => s.number === stepNumber);
}
