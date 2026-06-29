import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { UrinalysisRequest } from './types';

/** A complete, appropriate, routine suspected-UTI request. */
function createRoutineRequest(): UrinalysisRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr H Iqbal';
	r.clinician.clinicianRole = 'gp';
	r.clinician.referralDate = '2026-05-04';
	r.patient.firstName = 'Amara';
	r.patient.lastName = 'Okafor';
	r.patient.dateOfBirth = '1979-02-11';
	r.patient.nhsNumber = '401 234 5678';
	r.tests.dipstick = true;
	r.context.primaryIndication = 'suspected-uti';
	r.context.clinicalDetails = 'Dysuria and frequency for 2 days, otherwise well.';
	r.specimen.specimenType = 'midstream';
	r.specimen.specimenCollected = 'yes';
	r.triage.urgency = 'routine';
	r.triage.setting = 'community';
	return r;
}

/** A visible-haematuria request: urgent triage + 2WW flag. */
function createHaematuriaRequest(): UrinalysisRequest {
	const r = createRoutineRequest();
	r.context.primaryIndication = 'haematuria';
	r.tests.dipstick = true;
	r.tests.microscopyCultureSensitivity = true;
	r.tests.cytology = true;
	r.symptoms.symptomVisibleHaematuria = true;
	return r;
}

/** A suspected-pyelonephritis request: stat triage. */
function createPyelonephritisRequest(): UrinalysisRequest {
	const r = createRoutineRequest();
	r.tests.microscopyCultureSensitivity = true;
	r.symptoms.symptomFever = true;
	r.symptoms.symptomLoinPain = true;
	return r;
}

describe('Urinalysis test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.preanalyticalBand).toBe('ok');
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-UTI-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates visible haematuria to urgent + raises the 2WW flag', () => {
		const g = calculateGrade(createHaematuriaRequest());
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-VISIBLE-HAEMATURIA')).toBe(true);
		expect(g.flags.some((f) => f.category === 'visible-haematuria-2ww')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-VISIBLE-HAEMATURIA-2WW-001')).toBe(true);
	});

	it('auto-escalates fever + loin pain to stat (suspected pyelonephritis)', () => {
		const g = calculateGrade(createPyelonephritisRequest());
		expect(g.triageTier).toBe('stat');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-PYELONEPHRITIS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-pyelonephritis')).toBe(true);
	});

	it('rejects a request whose specimen has not been collected', () => {
		const r = createRoutineRequest();
		r.specimen.specimenCollected = 'no';
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PREANALYTICAL-NOT-COLLECTED')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SPECIMEN-NOT-COLLECTED-001')).toBe(true);
	});

	it('queries the referrer when no test is selected', () => {
		const r = createRoutineRequest();
		r.tests.dipstick = false;
		const g = calculateGrade(r);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.flagId === 'F-NO-TEST-SELECTED-001')).toBe(true);
	});

	it('marks a clear indication-to-test mismatch as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.context.primaryIndication = 'drug-monitoring';
		// dipstick is neither ideal nor plausible for drug monitoring.
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-DRUG-MONITORING-MISMATCH')).toBe(true);
		expect(g.recommendation).toBe('query-referrer');
	});

	it('flags a caution for a 24-hour collection handling caveat', () => {
		const r = createRoutineRequest();
		r.context.primaryIndication = 'proteinuria';
		r.tests.dipstick = false;
		r.tests.twentyFourHourCollection = true;
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('caution');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PREANALYTICAL-24H')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.context.primaryIndication = '';
		r.context.clinicalDetails = '';
		const g = calculateGrade(r);
		expect(g.completenessPercent).toBeLessThan(100);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createHaematuriaRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Urinalysis test request flag detection', () => {
	it('returns no flags for a complete routine appropriate request', () => {
		expect(detectFlags(createRoutineRequest())).toHaveLength(0);
	});

	it('raises missing-indication and missing-clinical-details flags', () => {
		const r = createRoutineRequest();
		r.context.primaryIndication = '';
		r.context.clinicalDetails = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.tests.dipstick = false; // high
		r.specimen.specimenCollected = 'no'; // medium
		r.context.clinicalDetails = ''; // low
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
