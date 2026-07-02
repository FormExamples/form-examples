import { describe, it, expect } from 'vitest';
import { calculateNipeGrade } from './nipe-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { nipeReferRules } from './nipe-rules';
import type { AssessmentData } from './types';

/**
 * A blank examination (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			practitionerName: '',
			practitionerRole: '',
			examinedAt: '',
			examinationContext: '',
			careSetting: ''
		},
		identification: {
			babyIdentifier: '',
			babyName: '',
			dateOfBirth: '',
			sex: '',
			gestationalAgeWeeks: null,
			birthWeightGrams: null
		},
		riskFactors: {
			breechPresentation: '',
			familyHistoryHipProblems: '',
			antenatalConcerns: ''
		},
		eyes: { eyesRedReflexRight: '', eyesRedReflexLeft: '', eyesAppearance: '' },
		heart: {
			heartMurmur: '',
			femoralPulsesRight: '',
			femoralPulsesLeft: '',
			centralCyanosis: '',
			oxygenSaturationPreductal: null,
			oxygenSaturationPostductal: null
		},
		hips: { barlowTest: '', ortolaniTest: '', hipAbduction: '' },
		testes: { testisRight: '', testisLeft: '' },
		systematic: {
			generalAppearance: '',
			skin: '',
			headAndFontanelles: '',
			faceAndPalate: '',
			neckAndClavicles: '',
			chestAndLungs: '',
			abdomen: '',
			genitalia: '',
			anusAndSpine: '',
			limbsAndDigits: '',
			feet: '',
			toneAndMovement: '',
			weightGrams: null,
			headCircumferenceCm: null,
			lengthCm: null
		},
		summary: {
			eyesResultRecorded: '',
			heartResultRecorded: '',
			hipsResultRecorded: '',
			testesResultRecorded: '',
			clinicalNote: ''
		}
	};
}

/** A boy with every key component examined and normal (all satisfactory). */
function createAllSatisfactory(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification.sex = 'male';
	d.eyes = { eyesRedReflexRight: 'present', eyesRedReflexLeft: 'present', eyesAppearance: 'normal' };
	d.heart = {
		heartMurmur: 'none',
		femoralPulsesRight: 'present',
		femoralPulsesLeft: 'present',
		centralCyanosis: 'absent',
		oxygenSaturationPreductal: 99,
		oxygenSaturationPostductal: 99
	};
	d.hips = { barlowTest: 'negative', ortolaniTest: 'negative', hipAbduction: 'normal' };
	d.testes = { testisRight: 'descended', testisLeft: 'descended' };
	d.riskFactors.breechPresentation = 'no';
	d.riskFactors.familyHistoryHipProblems = 'no';
	return d;
}

describe('NIPE classification engine', () => {
	it('classifies a fully-examined normal boy as satisfactory', () => {
		const r = calculateNipeGrade(createAllSatisfactory());
		expect(r.eyesResult).toBe('satisfactory');
		expect(r.heartResult).toBe('satisfactory');
		expect(r.hipsResult).toBe('satisfactory');
		expect(r.testesResult).toBe('satisfactory');
		expect(r.overallOutcome).toBe('satisfactory');
		expect(r.completeness).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.referrals).toEqual([]);
	});

	it('classifies a blank examination as incomplete / not-examined', () => {
		const r = calculateNipeGrade(createDefaultAssessment());
		expect(r.eyesResult).toBe('not-examined');
		expect(r.heartResult).toBe('not-examined');
		expect(r.hipsResult).toBe('not-examined');
		// sex is blank -> testes not applicable, excluded from the roll-up.
		expect(r.testesResult).toBe('not-applicable');
		expect(r.overallOutcome).toBe('incomplete');
		expect(r.completeness).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
	});

	it('refers eyes for an absent red reflex, with within-2-weeks urgency', () => {
		const d = createAllSatisfactory();
		d.eyes.eyesRedReflexLeft = 'absent';
		const r = calculateNipeGrade(d);
		expect(r.eyesResult).toBe('refer');
		expect(r.overallOutcome).toBe('refer');
		const eyesRef = r.referrals.find((x) => x.component === 'eyes');
		expect(eyesRef?.urgency).toBe('within-2-weeks');
	});

	it('refers heart same-day for central cyanosis (critical)', () => {
		const d = createAllSatisfactory();
		d.heart.centralCyanosis = 'present';
		const r = calculateNipeGrade(d);
		expect(r.heartResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'heart')?.urgency).toBe('same-day');
	});

	it('refers heart same-day for a low saturation', () => {
		const d = createAllSatisfactory();
		d.heart.oxygenSaturationPreductal = 90;
		const r = calculateNipeGrade(d);
		expect(r.heartResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'heart')?.urgency).toBe('same-day');
	});

	it('refers heart within-2-weeks for a murmur only (non-critical)', () => {
		const d = createAllSatisfactory();
		d.heart.heartMurmur = 'present';
		const r = calculateNipeGrade(d);
		expect(r.heartResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'heart')?.urgency).toBe('within-2-weeks');
	});

	it('refers hips within-2-weeks for a positive Ortolani (abnormal exam)', () => {
		const d = createAllSatisfactory();
		d.hips.ortolaniTest = 'positive';
		const r = calculateNipeGrade(d);
		expect(r.hipsResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'hips')?.urgency).toBe('within-2-weeks');
	});

	it('refers hips by-6-weeks for a risk factor only (normal exam)', () => {
		const d = createAllSatisfactory();
		d.riskFactors.breechPresentation = 'yes';
		const r = calculateNipeGrade(d);
		expect(r.hipsResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'hips')?.urgency).toBe('by-6-weeks');
	});

	it('refers testes same-day when bilateral undescended', () => {
		const d = createAllSatisfactory();
		d.testes = { testisRight: 'undescended', testisLeft: 'not-palpable' };
		const r = calculateNipeGrade(d);
		expect(r.testesResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'testes')?.urgency).toBe('same-day');
	});

	it('refers testes review-6-8-weeks when unilateral undescended', () => {
		const d = createAllSatisfactory();
		d.testes.testisRight = 'undescended';
		const r = calculateNipeGrade(d);
		expect(r.testesResult).toBe('refer');
		expect(r.referrals.find((x) => x.component === 'testes')?.urgency).toBe('review-6-8-weeks');
	});

	it('excludes testes for a girl (not-applicable, not counted in the roll-up)', () => {
		const d = createAllSatisfactory();
		d.identification.sex = 'female';
		d.testes = { testisRight: '', testisLeft: '' };
		const r = calculateNipeGrade(d);
		expect(r.testesResult).toBe('not-applicable');
		expect(r.overallOutcome).toBe('satisfactory');
		expect(r.completenessPercent).toBe(100);
	});

	it('is incomplete when one applicable component is not examined', () => {
		const d = createAllSatisfactory();
		d.hips = { barlowTest: '', ortolaniTest: '', hipAbduction: '' };
		d.riskFactors.breechPresentation = 'no';
		d.riskFactors.familyHistoryHipProblems = 'no';
		const r = calculateNipeGrade(d);
		expect(r.hipsResult).toBe('not-examined');
		expect(r.overallOutcome).toBe('incomplete');
		expect(r.completeness).toBe('incomplete');
	});

	it('prefers refer over incomplete when both are present', () => {
		const d = createAllSatisfactory();
		d.eyes.eyesAppearance = 'abnormal'; // refer
		d.hips = { barlowTest: '', ortolaniTest: '', hipAbduction: '' }; // not-examined
		d.riskFactors.breechPresentation = 'no';
		d.riskFactors.familyHistoryHipProblems = 'no';
		const r = calculateNipeGrade(d);
		expect(r.overallOutcome).toBe('refer');
	});

	it('all rule IDs are unique', () => {
		const ids = nipeReferRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('NIPE flagged-issue detection', () => {
	const componentResults = {
		eyesResult: 'satisfactory',
		heartResult: 'satisfactory',
		hipsResult: 'satisfactory',
		testesResult: 'satisfactory'
	} as const;

	it('raises the absent-red-reflex flag', () => {
		const d = createAllSatisfactory();
		d.eyes.eyesRedReflexRight = 'absent';
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-ABSENT-RED-REFLEX-001')).toBe(true);
	});

	it('raises the femoral-pulses flag', () => {
		const d = createAllSatisfactory();
		d.heart.femoralPulsesLeft = 'absent';
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-FEMORAL-PULSES-001')).toBe(true);
	});

	it('raises the cyanosis / low-sats flag for a discordant saturation', () => {
		const d = createAllSatisfactory();
		d.heart.oxygenSaturationPreductal = 99;
		d.heart.oxygenSaturationPostductal = 94; // >3% difference
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-CYANOSIS-LOW-SATS-001')).toBe(true);
	});

	it('raises the bilateral-undescended-testes flag', () => {
		const d = createAllSatisfactory();
		d.testes = { testisRight: 'not-palpable', testisLeft: 'undescended' };
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-BILATERAL-UNDESCENDED-TESTES-001')).toBe(true);
	});

	it('raises the hip-instability flag', () => {
		const d = createAllSatisfactory();
		d.hips.barlowTest = 'positive';
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-HIP-INSTABILITY-001')).toBe(true);
	});

	it('raises the hip-risk-factor flag', () => {
		const d = createAllSatisfactory();
		d.riskFactors.familyHistoryHipProblems = 'yes';
		const flags = detectFlaggedIssues(d, componentResults);
		expect(flags.some((f) => f.id === 'F-HIP-RISK-FACTOR-001')).toBe(true);
	});

	it('raises the component-not-examined flag', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, {
			eyesResult: 'not-examined',
			heartResult: 'not-examined',
			hipsResult: 'not-examined',
			testesResult: 'not-applicable'
		});
		expect(flags.some((f) => f.id === 'F-COMPONENT-NOT-EXAMINED-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createAllSatisfactory();
		d.hips.barlowTest = 'positive'; // high
		d.riskFactors.breechPresentation = 'yes'; // medium
		const flags = detectFlaggedIssues(d, componentResults);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
