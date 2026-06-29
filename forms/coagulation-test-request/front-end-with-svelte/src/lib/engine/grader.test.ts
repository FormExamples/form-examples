import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import type { CoagulationTestRequest } from './types';

/** A fully-completed, routine appropriate request: warfarin monitoring, PT/INR. */
function createRoutineRequest(): CoagulationTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		...r.clinician,
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456'
	};
	r.tests.prothrombinTimeInr = true;
	r.clinical = {
		...r.clinical,
		primaryIndication: 'anticoagulation-monitoring',
		clinicalDetails: 'Warfarin dose review; INR 3.8.',
		onAnticoagulant: true,
		anticoagulantAgent: 'warfarin'
	};
	r.specimen = {
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-10T09:30',
		citrateTubeFill: 'adequate',
		citrateRatioCorrect: 'yes'
	};
	r.triage = { ...r.triage, urgency: 'routine', setting: 'community' };
	return r;
}

describe('Coagulation test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.preanalyticalBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PREANALYTICAL-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates active major bleeding to STAT regardless of requested urgency', () => {
		const r = createRoutineRequest();
		r.clinical.activeBleeding = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('stat');
		expect(g.targetTimeframe).toBe('Immediate — process on receipt');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-ACTIVE-BLEEDING')).toBe(true);
		expect(g.flags.some((f) => f.category === 'active-bleeding-stat')).toBe(true);
	});

	it('auto-escalates suspected DIC to STAT and flags it', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'disseminated-intravascular-coagulation';
		r.tests = { ...r.tests, activatedPartialThromboplastinTime: true, fibrinogen: true, dDimer: true };
		r.clinical.suspectedDic = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('stat');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SUSPECTED-DIC')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-dic')).toBe(true);
	});

	it('marks an under-filled citrate specimen as reject-risk → reject', () => {
		const r = createRoutineRequest();
		r.specimen.citrateTubeFill = 'underfilled';
		r.specimen.citrateRatioCorrect = 'no';
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PREANALYTICAL-CITRATE-FILL')).toBe(true);
		expect(g.flags.some((f) => f.category === 'specimen-underfilled-risk')).toBe(true);
	});

	it('scores a mismatched indication / test pairing as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'pre-operative';
		r.tests.prothrombinTimeInr = false;
		r.tests.thrombophiliaScreen = true;
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-PRE-OPERATIVE-MISMATCH')).toBe(true);
	});

	it('scores no test selected as appropriateness 1 and flags it', () => {
		const r = createRoutineRequest();
		r.tests.prothrombinTimeInr = false;
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(1);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-NO-TEST')).toBe(true);
		expect(g.flags.some((f) => f.category === 'no-test-selected')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = '';
		r.clinical.clinicalDetails = '';
		const g = calculateGrade(r);
		// indication (3) + clinical details (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Coagulation test request flag detection', () => {
	it('raises the D-dimer pre-test caution flag', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'suspected-dvt-pe';
		r.tests.dDimer = true;
		r.clinical.wellsUnlikely = false;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-D-DIMER-PRETEST-001')).toBe(true);
	});

	it('flags missing indication / clinical details', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = '';
		r.clinical.clinicalDetails = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.clinical.activeBleeding = true;
		r.specimen.citrateTubeFill = 'underfilled';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
