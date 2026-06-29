import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Employee Details', shortTitle: 'Employee', section: 'employeeDetails' },
	{ number: 2, title: 'Exit Interview', shortTitle: 'Interview', section: 'exitInterview' },
	{ number: 3, title: 'Knowledge Transfer', shortTitle: 'Handover', section: 'knowledgeTransfer' },
	{ number: 4, title: 'Equipment Return', shortTitle: 'Equipment', section: 'equipmentReturn' },
	{ number: 5, title: 'Access Revocation', shortTitle: 'Access', section: 'accessRevocation' },
	{ number: 6, title: 'Final Payroll & Benefits', shortTitle: 'Payroll', section: 'finalPayrollBenefits' },
	{ number: 7, title: 'References & Recommendations', shortTitle: 'References', section: 'referencesRecommendations' },
	{ number: 8, title: 'Non-Disclosure & Post-Employment', shortTitle: 'NDA', section: 'nonDisclosurePostEmployment' },
	{ number: 9, title: 'Forwarding Details', shortTitle: 'Forwarding', section: 'forwardingDetails' },
	{ number: 10, title: 'Sign-off', shortTitle: 'Sign-off', section: 'signoff' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the offboarding checklist.
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
