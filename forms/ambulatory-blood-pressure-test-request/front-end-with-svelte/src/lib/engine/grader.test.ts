import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { scoreCompleteness, isSevere, isStage1OrAbove } from './rules';
import { createDefaultRequest } from './defaults';
import type { AbpmRequest } from './types';

/** A well-formed, usually-appropriate routine diagnose-hypertension request. */
function diagnoseRequest(): AbpmRequest {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr H Iqbal', clinicianRole: 'gp', referralDate: '2026-05-04' };
	d.patient = { ...d.patient, firstName: 'Amara', lastName: 'Okafor', dateOfBirth: '1979-02-11', nhsNumber: '401 234 5678', bodyMassIndex: 27 };
	d.request = { ...d.request, testType: '24-hour-abpm', primaryIndication: 'diagnose-hypertension', clinicalQuestion: 'Confirm a new diagnosis of hypertension before starting treatment.' };
	d.bloodPressure = { ...d.bloodPressure, clinicBpSystolic: 152, clinicBpDiastolic: 96 };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'community' };
	return d;
}

describe('ABPM four-axis grader', () => {
	it('grades a complete diagnose-hypertension request as usually-appropriate / accept', () => {
		const result = calculateGrade(diagnoseRequest());
		expect(result.appropriatenessScore).toBe(8);
		expect(result.appropriatenessBand).toBe('usually-appropriate');
		expect(result.suitabilityBand).toBe('ok');
		expect(result.completenessPercent).toBe(100);
		expect(result.triageTier).toBe('routine');
		expect(result.recommendation).toBe('accept');
		expect(result.flags).toHaveLength(0);
	});

	it('auto-escalates triage to urgent for severe clinic BP (>=180/120)', () => {
		const d = diagnoseRequest();
		d.bloodPressure.clinicBpSystolic = 186;
		d.bloodPressure.clinicBpDiastolic = 124;
		const result = calculateGrade(d);
		expect(result.triageTier).toBe('urgent');
		expect(result.appropriatenessBand).toBe('may-be-appropriate');
		expect(result.flags.some((f) => f.category === 'severe-hypertension-urgent')).toBe(true);
	});

	it('flags accelerated hypertension (>=200/130) at high priority', () => {
		const d = diagnoseRequest();
		d.bloodPressure.clinicBpSystolic = 204;
		d.bloodPressure.clinicBpDiastolic = 132;
		const result = calculateGrade(d);
		expect(result.flags.some((f) => f.flagId === 'F-ACCELERATED-HYPERTENSION-001')).toBe(true);
		// accelerated and severe are mutually exclusive
		expect(result.flags.some((f) => f.category === 'severe-hypertension-urgent')).toBe(false);
	});

	it('limits suitability and recommends redirect for atrial fibrillation', () => {
		const d = diagnoseRequest();
		d.symptoms.atrialFibrillation = true;
		const result = calculateGrade(d);
		expect(result.suitabilityBand).toBe('limited');
		expect(result.recommendation).toBe('redirect');
		expect(result.flags.some((f) => f.category === 'atrial-fibrillation-accuracy')).toBe(true);
	});

	it('cautions suitability for high BMI (>=35) without limiting it', () => {
		const d = diagnoseRequest();
		d.patient.bodyMassIndex = 38;
		const result = calculateGrade(d);
		expect(result.suitabilityBand).toBe('caution');
		expect(result.firedRules.some((r) => r.ruleId === 'R-SUIT-LARGE-ARM')).toBe(true);
	});

	it('queries the referrer when clinic BP is missing (incomplete + flag)', () => {
		const d = diagnoseRequest();
		d.bloodPressure.clinicBpSystolic = null;
		d.bloodPressure.clinicBpDiastolic = null;
		const result = calculateGrade(d);
		expect(result.flags.some((f) => f.category === 'missing-clinic-bp')).toBe(true);
		expect(result.completenessPercent).toBeLessThan(100);
	});

	it('treats a low clinic BP diagnose request as usually-not-appropriate / query', () => {
		const d = diagnoseRequest();
		d.bloodPressure.clinicBpSystolic = 122;
		d.bloodPressure.clinicBpDiastolic = 76;
		const result = calculateGrade(d);
		expect(result.appropriatenessBand).toBe('usually-not-appropriate');
		expect(result.recommendation).toBe('query-referrer');
	});

	it('always emits a timestamp and at least one fired rule per axis', () => {
		const result = calculateGrade(createDefaultRequest());
		expect(typeof result.timestamp).toBe('string');
		expect(result.firedRules.length).toBeGreaterThan(0);
	});
});

describe('ABPM completeness + thresholds', () => {
	it('scores an empty request below 50% complete', () => {
		const { percent } = scoreCompleteness(createDefaultRequest());
		expect(percent).toBeLessThan(50);
	});

	it('isSevere flags diastolic-only severe readings', () => {
		expect(isSevere(null, 125)).toBe(true);
		expect(isSevere(150, 95)).toBe(false);
	});

	it('isStage1OrAbove requires a systolic reading', () => {
		expect(isStage1OrAbove(null, 95)).toBe(false);
		expect(isStage1OrAbove(145, null)).toBe(true);
	});

	it('detectFlags returns no missing flags for a complete request', () => {
		const flags = detectFlags(diagnoseRequest());
		expect(flags.some((f) => f.category.startsWith('missing'))).toBe(false);
	});
});
