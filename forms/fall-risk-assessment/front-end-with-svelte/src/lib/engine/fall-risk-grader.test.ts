import { describe, it, expect } from 'vitest';
import { calculateFallRiskGrade, classifyMfsScore } from './fall-risk-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { mfsItems } from './mfs-rules';
import type { AssessmentData } from './types';

// A blank assessment, built inline so this engine test stays free of the
// SvelteKit store (which imports `$app/environment`).
function blankAssessment(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', age: null, careSetting: '', primaryDiagnosis: '' },
		fallHistory: { hasFallenInPastYear: '', numberOfFallsPastYear: null, lastFallDate: '', mostRecentFallInjurious: '', mostRecentFallInjuryDetails: '', recurrentFallsWithInjury: '', fearOfFalling: '', fallCircumstances: '' },
		mfs: { historyOfFalling: null, secondaryDiagnosis: null, ambulatoryAid: null, ivOrHeparinLock: null, gaitTransferring: null, mentalStatus: null },
		mobilityGait: { mobilityLevel: '', assistiveDeviceUsed: '', unsteadyGait: '', difficultyRisingFromChair: '', balanceImpairment: '', weaknessLowerExtremity: '', orthostaticHypotension: '', orthostaticHypotensionSevere: '', timedUpAndGoSeconds: '', mobilityNotes: '' },
		medicationReview: { medications: [], polypharmacy: '', sedativesOrHypnotics: '', antihypertensives: '', diuretics: '', anticoagulants: '', opioids: '', antidepressants: '', antipsychotics: '', recentMedicationChange: '', medicationNotes: '' },
		visionSensory: { visionImpairment: '', visionCorrected: '', hearingImpairment: '', peripheralNeuropathy: '', cataracts: '', glaucoma: '', macularDegeneration: '', visionLastChecked: '', sensoryNotes: '' },
		environmental: { loosThrowRugs: '', clutteredWalkways: '', poorLighting: '', stairsWithoutHandrails: '', bathroomGrabBarsAbsent: '', unsuitableFootwear: '', bedHeightProblem: '', hipProtectorsUsed: '', environmentalNotes: '' },
		cognitive: { dementiaDiagnosis: '', confusionOrDisorientation: '', impulsivity: '', overestimatesAbility: '', delirium: '', cognitiveScreenTool: '', cognitiveScreenScore: '', cognitiveNotes: '' },
		previousInterventions: { fallsClinicReferral: '', physiotherapyProvided: '', occupationalTherapyProvided: '', medicationReviewCompleted: '', homeSafetyAssessment: '', interventionDeclined: '', missedReferral: '', interventionNotes: '' },
		preventionPlan: { bedAlarm: '', chairAlarm: '', nonSlipFootwear: '', hipProtectorsRecommended: '', exerciseProgramme: '', vitaminDSupplement: '', environmentalModifications: '', medicationDeprescribing: '', carerEducationProvided: '', planNotes: '' }
	};
}

function lowRiskPatient(): AssessmentData {
	const d = blankAssessment();
	d.mfs = {
		historyOfFalling: 0,
		secondaryDiagnosis: 0,
		ambulatoryAid: 0,
		ivOrHeparinLock: 0,
		gaitTransferring: 0,
		mentalStatus: 0
	};
	return d;
}

describe('classifyMfsScore', () => {
	it('bands the raw MFS score', () => {
		expect(classifyMfsScore(0)).toBe('low');
		expect(classifyMfsScore(24)).toBe('low');
		expect(classifyMfsScore(25)).toBe('moderate');
		expect(classifyMfsScore(44)).toBe('moderate');
		expect(classifyMfsScore(45)).toBe('high');
		expect(classifyMfsScore(125)).toBe('high');
	});
});

describe('Fall Risk Grading Engine', () => {
	it('returns low risk and zero score for a patient with all MFS items No', () => {
		const result = calculateFallRiskGrade(lowRiskPatient());
		expect(result.mfsScore).toBe(0);
		expect(result.severity).toBe('low');
		expect(result.answeredCount).toBe(6);
		expect(result.criticalOverride).toBe(false);
	});

	it('sums MFS item scores and bands them as moderate', () => {
		const d = lowRiskPatient();
		d.mfs.historyOfFalling = 25; // 25 -> moderate
		const result = calculateFallRiskGrade(d);
		expect(result.mfsScore).toBe(25);
		expect(result.severity).toBe('moderate');
		expect(result.firedRules.length).toBe(6);
	});

	it('bands a high total MFS score as high', () => {
		const d = lowRiskPatient();
		d.mfs.historyOfFalling = 25;
		d.mfs.secondaryDiagnosis = 15;
		d.mfs.gaitTransferring = 20; // 60 -> high
		const result = calculateFallRiskGrade(d);
		expect(result.mfsScore).toBe(60);
		expect(result.severity).toBe('high');
	});

	it('escalates to critical when the patient is anticoagulated', () => {
		const d = lowRiskPatient();
		d.medicationReview.anticoagulants = 'yes';
		const result = calculateFallRiskGrade(d);
		expect(result.severity).toBe('critical');
		expect(result.criticalOverride).toBe(true);
		expect(result.criticalReasons).toContain('Anticoagulated patient');
	});

	it('escalates to critical for recurrent falls with injury', () => {
		const d = lowRiskPatient();
		d.fallHistory.recurrentFallsWithInjury = 'yes';
		const result = calculateFallRiskGrade(d);
		expect(result.severity).toBe('critical');
		expect(result.criticalReasons).toContain('Recurrent falls with injury');
	});

	it('escalates to critical when MFS >= 75', () => {
		const d = lowRiskPatient();
		d.mfs.historyOfFalling = 25;
		d.mfs.secondaryDiagnosis = 15;
		d.mfs.ambulatoryAid = 30;
		d.mfs.ivOrHeparinLock = 20; // 90 -> critical
		const result = calculateFallRiskGrade(d);
		expect(result.mfsScore).toBe(90);
		expect(result.severity).toBe('critical');
		expect(result.criticalReasons.some((r) => r.includes('>= 75'))).toBe(true);
	});

	it('counts only answered MFS items', () => {
		const d = blankAssessment(); // all null
		d.mfs.historyOfFalling = 25;
		const result = calculateFallRiskGrade(d);
		expect(result.answeredCount).toBe(1);
		expect(result.mfsScore).toBe(25);
	});

	it('has six unique MFS item ids', () => {
		const ids = mfsItems.map((i) => i.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids.length).toBe(6);
	});
});

describe('Fall Risk Flagged Issues Detection', () => {
	it('returns no flags for a low-risk patient', () => {
		const flags = detectAdditionalFlags(lowRiskPatient());
		expect(flags).toHaveLength(0);
	});

	it('flags a recent injurious fall', () => {
		const d = lowRiskPatient();
		d.fallHistory.hasFallenInPastYear = 'yes';
		d.fallHistory.mostRecentFallInjurious = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-FALL-001')).toBe(true);
	});

	it('flags anticoagulant therapy', () => {
		const d = lowRiskPatient();
		d.medicationReview.anticoagulants = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MED-001')).toBe(true);
	});

	it('flags polypharmacy when 4+ medications listed', () => {
		const d = lowRiskPatient();
		d.medicationReview.medications = [
			{ name: 'A', dose: '', frequency: '' },
			{ name: 'B', dose: '', frequency: '' },
			{ name: 'C', dose: '', frequency: '' },
			{ name: 'D', dose: '', frequency: '' }
		];
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MED-002')).toBe(true);
	});

	it('flags an environmental hazard', () => {
		const d = lowRiskPatient();
		d.environmental.poorLighting = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-ENV-002')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = lowRiskPatient();
		d.medicationReview.anticoagulants = 'yes'; // high
		d.medicationReview.sedativesOrHypnotics = 'yes'; // medium
		d.previousInterventions.missedReferral = 'yes'; // low
		const flags = detectAdditionalFlags(d);
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
