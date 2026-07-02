import { describe, it, expect } from 'vitest';
import { calculateAnionGap, roundOne } from './anion-gap-grader';
import { classificationRules } from './anion-gap-rules';
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
			calculatedAt: '',
			careSetting: '',
			clinicalContext: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		electrolytes: { sodium: null, potassium: null, chloride: null, bicarbonate: null },
		albumin: { albumin: null },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, normal-gap assessment (potassium-inclusive). */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		calculatedAt: '2026-06-20T09:30',
		careSetting: 'ward',
		clinicalContext: 'Routine panel'
	};
	d.identification = { patientIdentifier: 'WRD-1001', ageBand: '40-64', sex: 'male' };
	// (140 + 4.0) − (104 + 28) = 12 → normal (with K, range 8–16)
	d.electrolytes = { sodium: 140, potassium: 4.0, chloride: 104, bicarbonate: 28 };
	return d;
}

describe('anion-gap engine — formula', () => {
	it('computes the potassium-inclusive formula and normal range', () => {
		const d = createNormalPatient();
		const r = calculateAnionGap(d);
		expect(r.includesPotassium).toBe(true);
		expect(r.anionGap).toBe(12);
		expect(r.normalLow).toBe(8);
		expect(r.normalHigh).toBe(16);
		expect(r.classification).toBe('normal');
	});

	it('computes the potassium-exclusive formula and its 8–12 range', () => {
		const d = createNormalPatient();
		d.electrolytes.potassium = null;
		// 140 − (104 + 28) = 8 → normal boundary (without K, range 8–12)
		const r = calculateAnionGap(d);
		expect(r.includesPotassium).toBe(false);
		expect(r.anionGap).toBe(8);
		expect(r.normalHigh).toBe(12);
		expect(r.classification).toBe('normal');
	});

	it('returns unknown when a required electrolyte is missing', () => {
		const d = createNormalPatient();
		d.electrolytes.chloride = null;
		const r = calculateAnionGap(d);
		expect(r.anionGap).toBeNull();
		expect(r.classificationValue).toBeNull();
		expect(r.classification).toBe('unknown');
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});
});

describe('anion-gap engine — albumin correction', () => {
	it('adds 0.25 × (40 − albumin) to the raw gap', () => {
		const d = createNormalPatient();
		// raw = 12; albumin 20 → corrected = 12 + 0.25 × 20 = 17
		d.albumin.albumin = 20;
		const r = calculateAnionGap(d);
		expect(r.anionGap).toBe(12);
		expect(r.correctedAnionGap).toBe(17);
		// corrected 17 > 16 upper bound → high
		expect(r.classification).toBe('high');
	});

	it('classifies on the corrected value, not the raw gap', () => {
		const d = createNormalPatient();
		d.albumin.albumin = 20; // corrected 17, raw 12
		const r = calculateAnionGap(d);
		expect(r.classificationValue).toBe(17);
	});

	it('raises the hypoalbuminaemia-masking flag when correction unmasks a raised gap', () => {
		const d = createNormalPatient();
		d.albumin.albumin = 20; // raw 12 (≤16) but corrected 17 (>16)
		const r = calculateAnionGap(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HYPOALBUMINAEMIA-MASKING-001')).toBe(true);
	});

	it('leaves the gap unchanged when albumin is at the reference (40 g/L)', () => {
		const d = createNormalPatient();
		d.albumin.albumin = 40;
		const r = calculateAnionGap(d);
		expect(r.correctedAnionGap).toBe(12);
	});
});

describe('anion-gap engine — classification boundaries', () => {
	// Helper: set electrolytes (no K) to hit a given raw gap.
	function withoutKGap(gap: number): AssessmentData {
		const d = createDefaultAssessment();
		// sodium − (chloride + bicarbonate) = gap; fix chloride+bicarbonate = 132
		d.electrolytes = { sodium: 132 + gap, potassium: null, chloride: 104, bicarbonate: 28 };
		return d;
	}

	it('classifies 7 (below 8) as low', () => {
		expect(calculateAnionGap(withoutKGap(7)).classification).toBe('low');
	});
	it('classifies 8 (lower bound) as normal', () => {
		expect(calculateAnionGap(withoutKGap(8)).classification).toBe('normal');
	});
	it('classifies 12 (upper bound without K) as normal', () => {
		expect(calculateAnionGap(withoutKGap(12)).classification).toBe('normal');
	});
	it('classifies 13 (above 12 without K) as high', () => {
		expect(calculateAnionGap(withoutKGap(13)).classification).toBe('high');
	});
	it('classifies 19 as high and 20 as very-high', () => {
		expect(calculateAnionGap(withoutKGap(19)).classification).toBe('high');
		expect(calculateAnionGap(withoutKGap(20)).classification).toBe('very-high');
	});

	it('respects the raised (16) upper bound when potassium is present', () => {
		const d = createDefaultAssessment();
		// (Na + K) − (Cl + HCO3) = 16 → normal with K
		d.electrolytes = { sodium: 140, potassium: 4, chloride: 100, bicarbonate: 28 };
		const r = calculateAnionGap(d);
		expect(r.anionGap).toBe(16);
		expect(r.classification).toBe('normal');
	});
});

describe('anion-gap engine — flags', () => {
	it('raises no red flags for a complete normal patient', () => {
		expect(calculateAnionGap(createNormalPatient()).flaggedIssues).toHaveLength(0);
	});

	it('raises an urgent very-high flag at or above 20', () => {
		const d = createDefaultAssessment();
		d.electrolytes = { sodium: 145, potassium: null, chloride: 95, bicarbonate: 28 };
		// 145 − 123 = 22 → very-high
		const flags = calculateAnionGap(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-VERY-HIGH-001' && f.priority === 'urgent')).toBe(true);
	});

	it('raises a medium low-gap flag below 8', () => {
		const d = createDefaultAssessment();
		d.electrolytes = { sodium: 137, potassium: null, chloride: 104, bicarbonate: 28 };
		// 137 − 132 = 5 → low
		const flags = calculateAnionGap(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-LOW-001' && f.priority === 'medium')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = createDefaultAssessment();
		d.electrolytes = { sodium: 145, potassium: null, chloride: 95, bicarbonate: 28 };
		d.albumin.albumin = 10; // pushes corrected well above 20, plus masking flag
		const flags = calculateAnionGap(d).flaggedIssues;
		const order: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});

describe('anion-gap engine — misc', () => {
	it('rounds to one decimal place for display', () => {
		expect(roundOne(12.34)).toBe(12.3);
		expect(roundOne(null)).toBeNull();
	});

	it('all classification rule IDs are unique', () => {
		const ids = classificationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
