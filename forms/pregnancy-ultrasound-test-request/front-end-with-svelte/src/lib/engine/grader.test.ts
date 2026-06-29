import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import type { UltrasoundRequest } from './types';

/** A fully-completed, routine appropriate dating request (12+3 weeks). */
function createRoutineDatingRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1994-02-11';
	d.patient.nhsNumber = '401 234 5678';
	d.dating.gestationalAgeWeeks = 12;
	d.dating.gestationalAgeDays = 3;
	d.dating.lastMenstrualPeriodDate = '2026-02-08';
	d.request.requestedScanType = 'dating';
	d.request.primaryIndication = 'dating';
	d.request.clinicalQuestion = 'Confirm dating and viability.';
	d.triage.urgency = 'routine';
	return d;
}

describe('Pregnancy ultrasound four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine dating request as accept / routine', () => {
		const g = calculateGrade(createRoutineDatingRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.windowFit).toBe('appropriate');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-DATING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected ectopic to emergency regardless of other axes', () => {
		const d = createRoutineDatingRequest();
		d.request.requestedScanType = 'viability';
		d.request.primaryIndication = 'exclude-ectopic';
		d.dating.gestationalAgeWeeks = 7;
		d.dating.gestationalAgeDays = 0;
		d.symptoms.suspectedEctopic = true;
		d.triage.urgency = 'urgent';
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-ECTOPIC')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-ectopic')).toBe(true);
	});

	it('escalates reduced fetal movements to urgent', () => {
		const d = createRoutineDatingRequest();
		d.request.requestedScanType = 'growth';
		d.request.primaryIndication = 'reduced-fetal-movements';
		d.dating.gestationalAgeWeeks = 31;
		d.dating.gestationalAgeDays = 5;
		d.symptoms.reducedFetalMovements = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.windowFit).toBe('appropriate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REDUCED-MOVEMENTS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'reduced-fetal-movements')).toBe(true);
	});

	it('flags a gestation outside the requested scan window and recommends redirect', () => {
		const d = createRoutineDatingRequest();
		d.request.requestedScanType = 'nuchal-translucency';
		d.request.primaryIndication = 'aneuploidy-screening';
		d.dating.gestationalAgeWeeks = 16;
		d.dating.gestationalAgeDays = 2;
		const g = calculateGrade(d);
		expect(g.windowFit).toBe('outside-window');
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((r) => r.ruleId === 'R-WINDOW-NUCHAL-TRANSLUCENCY-OUTSIDE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'window-mismatch')).toBe(true);
	});

	it('marks a clearly mismatched indication / scan pairing as usually-not-appropriate', () => {
		const d = createRoutineDatingRequest();
		d.request.requestedScanType = 'anomaly';
		d.request.primaryIndication = 'dating';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-DATING-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineDatingRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 16 total weight missing → 10/16 ≈ 63%.
		expect(g.completenessPercent).toBe(63);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const d = createRoutineDatingRequest();
		d.symptoms.suspectedEctopic = true;
		const g = calculateGrade(d);
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Pregnancy ultrasound flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const d = createRoutineDatingRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the haemodynamic-instability flag', () => {
		const d = createRoutineDatingRequest();
		d.symptoms.haemodynamicallyUnstable = true;
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-HAEMODYNAMIC-INSTABILITY-001')).toBe(true);
	});

	it('raises the incomplete-dating flag when no GA, LMP, or EDD is present', () => {
		const d = createDefaultRequest();
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'incomplete-dating')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineDatingRequest(), { windowFit: 'appropriate' });
		expect(flags).toHaveLength(0);
	});
});
