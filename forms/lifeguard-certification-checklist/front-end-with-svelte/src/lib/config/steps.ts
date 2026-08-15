import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Candidate Details', shortTitle: 'Candidate', section: 'candidateDetails' },
	{ number: 2, title: 'Physical Fitness & Swim Competency', shortTitle: 'Fitness', section: 'physicalFitnessSwim' },
	{ number: 3, title: 'Supervision, Scanning & Zoning', shortTitle: 'Scanning', section: 'supervisionScanningZoning' },
	{ number: 4, title: 'Rescue Scenario — Conscious Casualty', shortTitle: 'Conscious', section: 'rescueConscious' },
	{ number: 5, title: 'Rescue Scenario — Unconscious Casualty', shortTitle: 'Unconscious', section: 'rescueUnconscious' },
	{ number: 6, title: 'Spinal Injury Management', shortTitle: 'Spinal', section: 'spinalInjuryManagement' },
	{ number: 7, title: 'CPR & AED', shortTitle: 'CPR & AED', section: 'cprAed' },
	{ number: 8, title: 'First Aid & Oxygen Therapy', shortTitle: 'First Aid', section: 'firstAidOxygen' },
	{ number: 9, title: 'Legal, Regulatory & Incident Reporting', shortTitle: 'Legal', section: 'legalRegulatoryIncident' },
	{ number: 10, title: 'Overall Result, Feedback & Signoff', shortTitle: 'Signoff', section: 'overallResultSignoff' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the lifeguard certification checklist.
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
