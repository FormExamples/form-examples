import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Trainee Details', shortTitle: 'Trainee', section: 'traineeDetails' },
	{ number: 2, title: 'Scene Safety & Initial Assessment', shortTitle: 'Scene', section: 'sceneSafety' },
	{ number: 3, title: 'Responsiveness & Breathing Check', shortTitle: 'Responsiveness', section: 'responsivenessBreathing' },
	{ number: 4, title: 'Activate Emergency Response', shortTitle: 'Emergency', section: 'activateEmergencyResponse' },
	{ number: 5, title: 'Chest Compressions', shortTitle: 'Compressions', section: 'chestCompressions' },
	{ number: 6, title: 'Airway & Rescue Breaths', shortTitle: 'Airway', section: 'airwayRescueBreaths' },
	{ number: 7, title: 'AED Use & Shock Delivery', shortTitle: 'AED', section: 'aedShockDelivery' },
	{ number: 8, title: 'Team Dynamics, Handoff & Feedback', shortTitle: 'Team', section: 'teamDynamicsHandoff' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the BLS skills-verification checklist.
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
