import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient Details', shortTitle: 'Patient', section: 'patientDetails' },
	{ number: 2, title: 'Procedure Details', shortTitle: 'Procedure', section: 'procedureDetails' },
	{ number: 3, title: 'Surgical Team', shortTitle: 'Team', section: 'surgicalTeam' },
	{ number: 4, title: 'Intra-operative Findings', shortTitle: 'Findings', section: 'intraoperativeFindings' },
	{ number: 5, title: 'Anaesthesia Summary', shortTitle: 'Anaesthesia', section: 'anaesthesiaSummary' },
	{ number: 6, title: 'Blood Loss & Fluid Balance', shortTitle: 'Fluids', section: 'bloodLossFluidBalance' },
	{ number: 7, title: 'Specimens & Implants', shortTitle: 'Specimens', section: 'specimensImplants' },
	{ number: 8, title: 'Immediate Post-op Status', shortTitle: 'Post-op', section: 'immediatePostopStatus' },
	{ number: 9, title: 'Complications Assessment', shortTitle: 'Complications', section: 'complicationsAssessment' },
	{ number: 10, title: 'Post-op Plan & Instructions', shortTitle: 'Plan', section: 'postopPlanInstructions' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the post-operative report.
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
