import type { StepConfig, HipaaAuthorization } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 2, title: 'Signer identification', shortTitle: 'Signer', section: 'signer' },
	{ number: 3, title: 'Disclosing source', shortTitle: 'Source', section: 'disclosingSource' },
	{ number: 4, title: 'Authorized recipient', shortTitle: 'Recipient', section: 'authorizedRecipient' },
	{ number: 5, title: 'Records to disclose', shortTitle: 'Records', section: 'recordsToDisclose' },
	{ number: 6, title: 'Purpose of disclosure', shortTitle: 'Purpose', section: 'purposeOfDisclosure' },
	{ number: 7, title: 'Expiration', shortTitle: 'Expiration', section: 'expiration' },
	{ number: 8, title: 'Patient rights', shortTitle: 'Rights', section: 'patientRightsAcknowledgement' },
	{ number: 9, title: 'Signature & witness', shortTitle: 'Signature', section: 'signatureWitness' }
];

export function getVisibleSteps(_data: HipaaAuthorization): StepConfig[] {
	// All steps are always visible in the HIPAA authorization wizard.
	return steps;
}

export function getNextStep(current: number, data: HipaaAuthorization): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: HipaaAuthorization): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: HipaaAuthorization): boolean {
	return steps.some((s) => s.number === stepNumber);
}
