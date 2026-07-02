import { describe, it, expect } from 'vitest';
import { calculateCamGrade, isUnableToAssess } from './cam-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { camRules } from './cam-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			assessorName: '',
			assessorRole: '',
			assessedAt: '',
			wardUnit: '',
			camVariant: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			cognitiveBaseline: '',
			collateralSource: ''
		},
		feature1: { acuteOnsetFluctuating: '', onsetTiming: '' },
		feature2: { inattention: '', attentionTest: '' },
		feature3: { disorganisedThinking: '' },
		feature4: { alteredConsciousness: '', consciousnessLevel: '', rassScore: null },
		observations: {
			motoricSubtype: '',
			hallucinations: false,
			delusions: false,
			sleepWakeDisturbance: false,
			deliriogenicMedication: false,
			deliriogenicMedicationDetail: ''
		},
		result: { suspectedPrecipitants: '', recommendedActions: '', clinicalNote: '' }
	};
}

/** A CAM patient with features 1 and 2 present (algorithm not yet satisfied). */
function createBaselinePositive(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Staff Nurse J. Okoro',
		assessorRole: 'nurse',
		assessedAt: '2026-06-24T09:30',
		wardUnit: 'Care of the Elderly, Ward 12',
		camVariant: 'cam'
	};
	d.identification = {
		patientIdentifier: 'MRN-482201',
		ageBand: '75-plus',
		sex: 'female',
		cognitiveBaseline: 'independent',
		collateralSource: 'family'
	};
	d.feature1.acuteOnsetFluctuating = 'present';
	d.feature2.inattention = 'present';
	return d;
}

describe('CAM classification engine', () => {
	it('classifies delirium absent for a fully-negative patient', () => {
		const d = createBaselinePositive();
		d.feature1.acuteOnsetFluctuating = 'absent';
		d.feature2.inattention = 'absent';
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('absent');
		expect(r.deliriumPresent).toBe(false);
		expect(r.positiveFeatures).toEqual([]);
	});

	it('classifies delirium present when 1 AND 2 AND 3', () => {
		const d = createBaselinePositive();
		d.feature3.disorganisedThinking = 'present';
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('present');
		expect(r.deliriumPresent).toBe(true);
		expect(r.positiveFeatures).toEqual([1, 2, 3]);
	});

	it('classifies delirium present when 1 AND 2 AND 4', () => {
		const d = createBaselinePositive();
		d.feature4.alteredConsciousness = 'present';
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('present');
		expect(r.positiveFeatures).toEqual([1, 2, 4]);
	});

	it('requires BOTH feature 1 and feature 2 (1 AND 3 alone is absent)', () => {
		const d = createBaselinePositive();
		d.feature2.inattention = 'absent';
		d.feature3.disorganisedThinking = 'present';
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('absent');
		expect(r.deliriumPresent).toBe(false);
	});

	it('feature 1 without 2 is absent even with 3 and 4 present', () => {
		const d = createBaselinePositive();
		d.feature2.inattention = 'absent';
		d.feature3.disorganisedThinking = 'present';
		d.feature4.alteredConsciousness = 'present';
		expect(calculateCamGrade(d).classification).toBe('absent');
	});

	it('treats an unset feature as absent at evaluation', () => {
		const d = createDefaultAssessment();
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('absent');
		expect(r.positiveFeatures).toEqual([]);
	});

	it('returns unable-to-assess for CAM-ICU RASS -4 (unrousable)', () => {
		const d = createBaselinePositive();
		d.context.camVariant = 'cam-icu';
		d.feature3.disorganisedThinking = 'present';
		d.feature4.rassScore = -4;
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('unable-to-assess');
		expect(r.deliriumPresent).toBeNull();
		expect(r.positiveFeatures).toEqual([]);
		expect(r.feature1Positive).toBeNull();
	});

	it('returns unable-to-assess for CAM-ICU RASS -5', () => {
		const d = createBaselinePositive();
		d.context.camVariant = 'cam-icu';
		d.feature4.rassScore = -5;
		expect(calculateCamGrade(d).classification).toBe('unable-to-assess');
	});

	it('still evaluates CAM-ICU when RASS is above -4', () => {
		const d = createBaselinePositive();
		d.context.camVariant = 'cam-icu';
		d.feature4.rassScore = -3;
		d.feature4.alteredConsciousness = 'present';
		const r = calculateCamGrade(d);
		expect(r.classification).toBe('present');
		expect(isUnableToAssess(d)).toBe(false);
	});

	it('does not gate the standard CAM variant on RASS', () => {
		const d = createBaselinePositive();
		d.feature4.rassScore = -5; // standard CAM ignores RASS
		d.feature3.disorganisedThinking = 'present';
		expect(calculateCamGrade(d).classification).toBe('present');
	});

	it('all rule IDs are unique', () => {
		const ids = camRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('CAM flagged-issue detection', () => {
	it('raises the delirium-present cause-workup flag when present', () => {
		const flags = detectFlaggedIssues(createBaselinePositive(), 'present');
		expect(flags.some((f) => f.id === 'F-DELIRIUM-PRESENT-001')).toBe(true);
	});

	it('raises the repeat-screening flag when absent', () => {
		const flags = detectFlaggedIssues(createBaselinePositive(), 'absent');
		expect(flags.some((f) => f.id === 'F-REPEAT-SCREENING-001')).toBe(true);
	});

	it('raises the hypoactive-delirium flag', () => {
		const d = createBaselinePositive();
		d.observations.motoricSubtype = 'hypoactive';
		const flags = detectFlaggedIssues(d, 'present');
		expect(flags.some((f) => f.id === 'F-HYPOACTIVE-DELIRIUM-001')).toBe(true);
	});

	it('raises the altered-consciousness flag for stupor / coma', () => {
		const d = createBaselinePositive();
		d.feature4.consciousnessLevel = 'stupor';
		const flags = detectFlaggedIssues(d, 'present');
		expect(flags.some((f) => f.id === 'F-ALTERED-CONSCIOUSNESS-001')).toBe(true);
	});

	it('raises the deliriogenic-medication flag', () => {
		const d = createBaselinePositive();
		d.observations.deliriogenicMedication = true;
		const flags = detectFlaggedIssues(d, 'absent');
		expect(flags.some((f) => f.id === 'F-DELIRIOGENIC-MEDICATION-001')).toBe(true);
	});

	it('raises the unable-to-assess flag for CAM-ICU RASS gate', () => {
		const d = createBaselinePositive();
		d.context.camVariant = 'cam-icu';
		d.feature4.rassScore = -4;
		const flags = detectFlaggedIssues(d, 'unable-to-assess');
		expect(flags.some((f) => f.id === 'F-UNABLE-TO-ASSESS-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createBaselinePositive();
		d.observations.motoricSubtype = 'hypoactive'; // high
		d.observations.deliriogenicMedication = true; // medium
		const flags = detectFlaggedIssues(d, 'present');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
