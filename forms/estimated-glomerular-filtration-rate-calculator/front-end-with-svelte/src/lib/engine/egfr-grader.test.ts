import { describe, it, expect } from 'vitest';
import { calculateEgfr, roundWhole, roundThree } from './egfr-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { stageRules, G1_MIN, G2_MIN, G3A_MIN, G3B_MIN, G4_MIN } from './egfr-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			assessedAt: '',
			careSetting: '',
			equation: 'ckd-epi-2021-creatinine'
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		creatinine: { serumCreatinine: null, specimenDate: '', steadyState: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered assessment. */
function createPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'primary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'GP-1001', ageYears: 60, sex: 'male' };
	d.creatinine = { serumCreatinine: 88.42, specimenDate: '2026-06-19', steadyState: 'yes' };
	return d;
}

describe('CKD-EPI 2021 creatinine engine', () => {
	it('converts µmol/L to mg/dL by dividing by 88.42', () => {
		const d = createPatient();
		d.creatinine.serumCreatinine = 88.42; // exactly 1.0 mg/dL
		const r = calculateEgfr(d);
		expect(r.serumCreatinineMgDl).toBe(1);
	});

	it('computes a plausible eGFR for a known male case (Scr 88.42 µmol/L, age 60)', () => {
		// 142 × 1.111^-1.2 × 0.9938^60 ≈ 86.16 mL/min/1.73 m²
		const r = calculateEgfr(createPatient());
		expect(r.egfrRaw).toBeCloseTo(86.16, 1);
		expect(r.egfr).toBe(86);
		expect(r.egfrStage).toBe('G2');
	});

	it('applies the female kappa/alpha and 1.012 multiplier', () => {
		const d = createPatient();
		d.identification.sex = 'female';
		// 142 × 1.012 × ratio-terms × 0.9938^60 ≈ 64.5
		const r = calculateEgfr(d);
		expect(r.egfrRaw).toBeCloseTo(64.5, 0);
		expect(r.egfrStage).toBe('G2');
	});

	it('bands a high-creatinine case into a low G-stage (G5)', () => {
		const d = createPatient();
		d.identification = { patientIdentifier: 'WD-1', ageYears: 74, sex: 'male' };
		d.creatinine.serumCreatinine = 560;
		const r = calculateEgfr(d);
		expect(r.egfr).toBeLessThan(15);
		expect(r.egfrStage).toBe('G5');
	});

	it('returns null and no stage when any required input is missing', () => {
		const noScr = createPatient();
		noScr.creatinine.serumCreatinine = null;
		const r = calculateEgfr(noScr);
		expect(r.egfr).toBeNull();
		expect(r.egfrRaw).toBeNull();
		expect(r.egfrStage).toBeNull();

		const noSex = createPatient();
		noSex.identification.sex = '';
		expect(calculateEgfr(noSex).egfr).toBeNull();

		const noAge = createPatient();
		noAge.identification.ageYears = null;
		expect(calculateEgfr(noAge).egfr).toBeNull();
	});

	it('rounds display values', () => {
		expect(roundWhole(86.16)).toBe(86);
		expect(roundWhole(null)).toBeNull();
		expect(roundThree(1.00003)).toBe(1);
		expect(roundThree(null)).toBeNull();
	});
});

describe('CKD G-stage banding boundaries', () => {
	function bandFor(egfr: number): string | undefined {
		return stageRules.find((r) => r.evaluate(egfr))?.band;
	}

	it('places each lower boundary in the higher (inclusive) band', () => {
		expect(bandFor(G1_MIN)).toBe('G1'); // 90
		expect(bandFor(G2_MIN)).toBe('G2'); // 60
		expect(bandFor(G3A_MIN)).toBe('G3a'); // 45
		expect(bandFor(G3B_MIN)).toBe('G3b'); // 30
		expect(bandFor(G4_MIN)).toBe('G4'); // 15
	});

	it('places values just below a boundary in the lower band', () => {
		expect(bandFor(89.999)).toBe('G2');
		expect(bandFor(59.999)).toBe('G3a');
		expect(bandFor(44.999)).toBe('G3b');
		expect(bandFor(29.999)).toBe('G4');
		expect(bandFor(14.999)).toBe('G5');
	});

	it('all staging rule IDs are unique', () => {
		const ids = stageRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('eGFR flagged-issue detection', () => {
	it('raises no red flags for a complete, normal-function patient', () => {
		const d = createPatient();
		d.creatinine.serumCreatinine = 70; // eGFR well within G1/G2, mid-band
		d.identification.ageYears = 45;
		const r = calculateEgfr(d);
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the incomplete-assessment flag when an input is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), null, null);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('raises nephrology-referral and drug-dosing flags for G5', () => {
		const flags = detectFlaggedIssues(createPatient(), 9, 'G5');
		expect(flags.some((f) => f.id === 'F-G5-NEPHROLOGY-REFERRAL-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-DRUG-DOSING-REVIEW-001')).toBe(true);
	});

	it('raises the acute-drop flag when renal function is not at steady state', () => {
		const d = createPatient();
		d.creatinine.steadyState = 'no';
		const r = calculateEgfr(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ACUTE-DROP-AKI-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const flags = detectFlaggedIssues(createPatient(), 33, 'G3b');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
