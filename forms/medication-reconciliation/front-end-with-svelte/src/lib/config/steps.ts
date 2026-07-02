import type { StepConfig, ReconciliationData } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Encounter context', shortTitle: 'Encounter', section: 'encounter' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Information sources', shortTitle: 'Sources', section: 'informationSources' },
	{ number: 4, title: 'Allergies and reactions', shortTitle: 'Allergies', section: 'allergies' },
	{ number: 5, title: 'Medication line items', shortTitle: 'Medicines', section: 'lineItems' },
	{ number: 6, title: 'Reconciliation', shortTitle: 'Reconcile', section: 'discrepancies' },
	{ number: 7, title: 'Summary and sign-off', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: ReconciliationData): StepConfig[] {
	// All steps are always visible in the reconciliation wizard.
	return steps;
}

export function getNextStep(current: number, data: ReconciliationData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: ReconciliationData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: ReconciliationData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
