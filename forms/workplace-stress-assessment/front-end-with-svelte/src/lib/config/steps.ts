import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'About you', section: 'demographics' },
	{ number: 2, title: 'Demands', shortTitle: 'Demands', section: 'demands' },
	{ number: 3, title: 'Control', shortTitle: 'Control', section: 'control' },
	{ number: 4, title: 'Manager Support', shortTitle: 'Mgr support', section: 'managerSupport' },
	{ number: 5, title: 'Peer Support', shortTitle: 'Peer support', section: 'peerSupport' },
	{ number: 6, title: 'Relationships', shortTitle: 'Relationships', section: 'relationships' },
	{ number: 7, title: 'Role Clarity', shortTitle: 'Role', section: 'role' },
	{ number: 8, title: 'Organisational Change', shortTitle: 'Change', section: 'change' },
	{ number: 9, title: 'Additional Comments', shortTitle: 'Comments', section: 'additionalComments' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the workplace stress assessment.
	return steps;
}

export function getNextStep(current: number, data: AssessmentData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: AssessmentData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: AssessmentData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
