import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient Details', shortTitle: 'Patient', section: 'patientDetails' },
	{ number: 2, title: 'Admission Summary', shortTitle: 'Admission', section: 'admissionSummary' },
	{ number: 3, title: 'Diagnoses', shortTitle: 'Diagnoses', section: 'diagnoses' },
	{ number: 4, title: 'Procedures Performed', shortTitle: 'Procedures', section: 'proceduresPerformed' },
	{ number: 5, title: 'Discharge Medications', shortTitle: 'Meds', section: 'dischargeMedications' },
	{ number: 6, title: 'Follow-up Arrangements', shortTitle: 'Follow-up', section: 'followupArrangements' },
	{ number: 7, title: 'Community Care Instructions', shortTitle: 'Community', section: 'communityCareInstructions' },
	{ number: 8, title: 'Warning Signs', shortTitle: 'Warnings', section: 'warningSigns' },
	{ number: 9, title: 'Clinician Sign-off', shortTitle: 'Sign-off', section: 'clinicianSignoff' },
	{ number: 10, title: 'Patient / Carer Acknowledgement', shortTitle: 'Acknowledge', section: 'patientAcknowledgement' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the hospital discharge summary.
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
