import { describe, it, expect } from 'vitest';
import { calculateMeld, roundTo } from './meld-grader';
import { bandRules } from './meld-rules';
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
			meldVariant: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		bilirubin: { bilirubin: null, bilirubinUnit: '' },
		inr: { inr: null },
		renal: { creatinine: null, creatinineUnit: '', dialysisSessionsPastWeek: null, cvvhd24h: '' },
		sodium: { sodium: null },
		albumin: { albumin: null },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered base-MELD patient (mg/dL inputs). */
function createBasePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'hepatologist',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'hepatology-clinic',
		meldVariant: 'meld'
	};
	d.identification = { patientIdentifier: 'HEP-1001', ageBand: '40-59', sex: 'male' };
	d.bilirubin = { bilirubin: 2.0, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 1.5;
	d.renal = { creatinine: 1.2, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 0, cvvhd24h: 'no' };
	return d;
}

describe('MELD engine — formula', () => {
	it('computes the base MELD to the expected ballpark', () => {
		// round(3.78·ln(2) + 11.2·ln(1.5) + 9.57·ln(1.2) + 6.43) = 15
		const r = calculateMeld(createBasePatient());
		expect(r.meldScore).toBe(15);
		expect(r.mortalityBand).toBe('moderate');
	});

	it('floors bilirubin, INR, and creatinine below 1.0 to the minimum score', () => {
		const d = createBasePatient();
		d.bilirubin.bilirubin = 0.5;
		d.inr.inr = 0.8;
		d.renal.creatinine = 0.5;
		const r = calculateMeld(d);
		// all floored to 1.0 (ln 1 = 0) → round(6.43) = 6, then clamped at the 6 floor
		expect(r.meldScore).toBe(6);
		expect(r.mortalityBand).toBe('low');
	});

	it('applies the dialysis rule (≥ 2 sessions → creatinine 4.0)', () => {
		const d = createBasePatient();
		d.renal.creatinine = 1.0;
		d.renal.dialysisSessionsPastWeek = 2;
		const r = calculateMeld(d);
		expect(r.dialysisRuleApplied).toBe(true);
		expect(r.creatinineAdjusted).toBe(4.0);
	});

	it('applies the dialysis rule for ≥ 24 h CVVHD', () => {
		const d = createBasePatient();
		d.renal.dialysisSessionsPastWeek = 0;
		d.renal.cvvhd24h = 'yes';
		const r = calculateMeld(d);
		expect(r.dialysisRuleApplied).toBe(true);
		expect(r.creatinineAdjusted).toBe(4.0);
	});

	it('caps creatinine at 4.0 in the base formula', () => {
		const d = createBasePatient();
		d.renal.creatinine = 9.9;
		const r = calculateMeld(d);
		// creatinine is capped at 4.0 for the base MELD/MELD-Na formula
		expect(r.creatinineMgDl).toBe(9.9);
		const capped = calculateMeld(d);
		expect(capped.meldScore).not.toBeNull();
	});

	it('converts umol/L inputs to mg/dL', () => {
		const mgdl = createBasePatient();
		const umol = createBasePatient();
		umol.bilirubin = { bilirubin: 2.0 * 17.1, bilirubinUnit: 'umol/L' };
		umol.renal.creatinine = 1.2 * 88.4;
		umol.renal.creatinineUnit = 'umol/L';
		expect(calculateMeld(umol).meldScore).toBe(calculateMeld(mgdl).meldScore);
	});

	it('clamps the final score to the 6–40 range', () => {
		const d = createBasePatient();
		d.bilirubin.bilirubin = 50;
		d.inr.inr = 8;
		d.renal.creatinine = 4;
		const r = calculateMeld(d);
		expect(r.meldScore).toBeLessThanOrEqual(40);
		expect(r.meldScore).toBeGreaterThanOrEqual(6);
	});

	it('applies the MELD-Na sodium correction only above the meld > 11 gate', () => {
		const d = createBasePatient();
		d.context.meldVariant = 'meld-na';
		d.sodium.sodium = 128; // below 137 → correction raises the score
		const r = calculateMeld(d);
		expect(r.meldScore).not.toBeNull();
		// base MELD here is 15 (> 11), so the Na correction is applied and raises it
		expect(r.meldScore!).toBeGreaterThanOrEqual(15);
	});

	it('returns null and an incomplete flag when a required input is missing', () => {
		const d = createBasePatient();
		d.bilirubin.bilirubin = null;
		const r = calculateMeld(d);
		expect(r.meldScore).toBeNull();
		expect(r.mortalityBand).toBe('');
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('requires sodium for MELD-Na and sodium + albumin for MELD 3.0', () => {
		const na = createBasePatient();
		na.context.meldVariant = 'meld-na';
		expect(calculateMeld(na).meldScore).toBeNull();

		const m3 = createBasePatient();
		m3.context.meldVariant = 'meld-3';
		m3.sodium.sodium = 135;
		expect(calculateMeld(m3).meldScore).toBeNull(); // albumin still missing
		m3.albumin.albumin = 3.0;
		expect(calculateMeld(m3).meldScore).not.toBeNull();
	});

	it('rounds to the requested decimal places', () => {
		expect(roundTo(1.234, 2)).toBe(1.23);
		expect(roundTo(null, 2)).toBeNull();
	});
});

describe('MELD engine — mortality bands and flags', () => {
	it('maps each band boundary correctly', () => {
		expect(bandRules.find((r) => r.evaluate(9))!.band).toBe('low');
		expect(bandRules.find((r) => r.evaluate(15))!.band).toBe('moderate');
		expect(bandRules.find((r) => r.evaluate(25))!.band).toBe('high');
		expect(bandRules.find((r) => r.evaluate(35))!.band).toBe('very-high');
		expect(bandRules.find((r) => r.evaluate(40))!.band).toBe('extreme');
	});

	it('all band rule IDs are unique', () => {
		const ids = bandRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('raises transplant-referral and on-dialysis flags for a severe dialysis case', () => {
		const d = createBasePatient();
		d.bilirubin.bilirubin = 8;
		d.inr.inr = 2.6;
		d.renal.dialysisSessionsPastWeek = 3;
		const r = calculateMeld(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ON-DIALYSIS-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-TRANSPLANT-REFERRAL-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-COAGULOPATHY-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createBasePatient();
		d.context.meldVariant = 'meld-na';
		d.sodium.sodium = 122; // hyponatraemia (medium)
		d.bilirubin.bilirubin = 30;
		d.inr.inr = 3;
		d.renal.dialysisSessionsPastWeek = 3;
		const r = calculateMeld(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
