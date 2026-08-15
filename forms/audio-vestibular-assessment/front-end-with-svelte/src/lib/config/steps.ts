import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Presenting Symptoms', shortTitle: 'Symptoms', section: 'presentingSymptoms' },
	{ number: 3, title: 'Otoscopic Examination', shortTitle: 'Otoscopic', section: 'otoscopicExamination' },
	{ number: 4, title: 'Pure-Tone Audiometry', shortTitle: 'PTA', section: 'pureToneAudiometry' },
	{ number: 5, title: 'Speech Audiometry', shortTitle: 'Speech', section: 'speechAudiometry' },
	{ number: 6, title: 'Tympanometry & Acoustic Reflexes', shortTitle: 'Tympanometry', section: 'tympanometryAcousticReflexes' },
	{ number: 7, title: 'Vestibular Screening', shortTitle: 'Vestibular', section: 'vestibularScreening' },
	{ number: 8, title: 'Dizziness Handicap Inventory', shortTitle: 'DHI', section: 'dizzinessHandicapInventory' },
	{ number: 9, title: 'Clinical Impression & Referral', shortTitle: 'Clinical & Referral', section: 'clinicalImpressionReferral' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the audio-vestibular assessment.
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
