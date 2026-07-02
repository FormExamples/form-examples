import { describe, it, expect } from 'vitest';
import { calculateCorrectedCalcium, roundTwo } from './calcium-calculator';
import { detectFlaggedIssues } from './flagged-issues';
import { classificationRules } from './calcium-rules';
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
			sampleReference: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		calcium: { totalCalcium: null },
		albumin: { albumin: null },
		symptoms: { symptomatic: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, in-range (normal) assessment. */
function createNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'ward',
		sampleReference: 'LAB-0001'
	};
	d.identification = { patientIdentifier: 'WRD-1001', ageBand: '40-64', sex: 'male' };
	d.calcium.totalCalcium = 2.4;
	d.albumin.albumin = 40;
	d.symptoms.symptomatic = 'no';
	return d;
}

describe('corrected-calcium engine', () => {
	it('applies the albumin-correction formula', () => {
		// 2.30 + 0.02 × (40 − 28) = 2.30 + 0.24 = 2.54
		const d = createNormalPatient();
		d.calcium.totalCalcium = 2.3;
		d.albumin.albumin = 28;
		const r = calculateCorrectedCalcium(d);
		expect(r.correctedCalcium).toBe(2.54);
		expect(r.classification).toBe('normal');
	});

	it('lowers the corrected value when albumin is above 40', () => {
		const d = createNormalPatient();
		d.calcium.totalCalcium = 2.5;
		d.albumin.albumin = 50;
		const r = calculateCorrectedCalcium(d);
		// 2.50 + 0.02 × (40 − 50) = 2.30
		expect(r.correctedCalcium).toBe(2.3);
		expect(r.classification).toBe('normal');
	});

	it('returns unknown when either input is missing', () => {
		const missingAlbumin = createNormalPatient();
		missingAlbumin.albumin.albumin = null;
		const r = calculateCorrectedCalcium(missingAlbumin);
		expect(r.correctedCalcium).toBeNull();
		expect(r.correctedCalciumRaw).toBeNull();
		expect(r.classification).toBe('unknown');

		const missingCalcium = createNormalPatient();
		missingCalcium.calcium.totalCalcium = null;
		expect(calculateCorrectedCalcium(missingCalcium).classification).toBe('unknown');
	});

	it('classifies the 2.20 lower boundary as normal, below it as hypocalcaemia', () => {
		const d220 = createNormalPatient();
		d220.calcium.totalCalcium = 2.2;
		d220.albumin.albumin = 40; // corrected 2.20
		expect(calculateCorrectedCalcium(d220).classification).toBe('normal');

		const dLow = createNormalPatient();
		dLow.calcium.totalCalcium = 2.19;
		dLow.albumin.albumin = 40; // corrected 2.19
		expect(calculateCorrectedCalcium(dLow).classification).toBe('hypocalcaemia');
	});

	it('classifies the 2.60 upper boundary as normal, above it as hypercalcaemia', () => {
		const d260 = createNormalPatient();
		d260.calcium.totalCalcium = 2.6;
		d260.albumin.albumin = 40; // corrected 2.60
		expect(calculateCorrectedCalcium(d260).classification).toBe('normal');

		const dHigh = createNormalPatient();
		dHigh.calcium.totalCalcium = 2.61;
		dHigh.albumin.albumin = 40; // corrected 2.61
		expect(calculateCorrectedCalcium(dHigh).classification).toBe('hypercalcaemia');
	});

	it('rounds to two decimal places for display', () => {
		expect(roundTwo(2.545)).toBe(2.55);
		expect(roundTwo(null)).toBeNull();
	});

	it('all classification rule IDs are unique', () => {
		const ids = classificationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('corrected-calcium flagged-issue detection', () => {
	it('raises no red flags for a complete normal patient', () => {
		const r = calculateCorrectedCalcium(createNormalPatient());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the incomplete-data flag when an input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, null);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-DATA-001')).toBe(true);
	});

	it('raises severe-hypercalcaemia at or above 3.0 mmol/L', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), 3.14);
		expect(flags.some((f) => f.id === 'F-SEVERE-HYPERCALCAEMIA-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPERCALCAEMIA-001')).toBe(true);
	});

	it('raises severe-hypocalcaemia below 1.9 mmol/L', () => {
		const flags = detectFlaggedIssues(createNormalPatient(), 1.78);
		expect(flags.some((f) => f.id === 'F-SEVERE-HYPOCALCAEMIA-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPOCALCAEMIA-001')).toBe(true);
	});

	it('raises symptomatic-hypercalcaemia only when symptomatic is yes', () => {
		const symptomatic = createNormalPatient();
		symptomatic.symptoms.symptomatic = 'yes';
		const flags = detectFlaggedIssues(symptomatic, 2.86);
		expect(flags.some((f) => f.id === 'F-SYMPTOMATIC-HYPERCALCAEMIA-001')).toBe(true);

		const notSymptomatic = createNormalPatient();
		notSymptomatic.symptoms.symptomatic = 'no';
		const flags2 = detectFlaggedIssues(notSymptomatic, 2.86);
		expect(flags2.some((f) => f.id === 'F-SYMPTOMATIC-HYPERCALCAEMIA-001')).toBe(false);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormalPatient();
		d.symptoms.symptomatic = 'yes';
		const flags = detectFlaggedIssues(d, 3.05);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
