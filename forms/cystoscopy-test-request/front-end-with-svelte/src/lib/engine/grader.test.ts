import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { CystoscopyRequest } from './types';

/** A fully-completed, routine, appropriate request fixture. */
function createRoutineRequest(): CystoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Anita Shah';
	r.clinician.clinicianRole = 'gp';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1972-03-14';
	r.patient.age = 54;
	r.patient.nhsNumber = '485 777 3456';
	r.request.procedure = 'flexible-cystoscopy';
	r.request.primaryIndication = 'non-visible-haematuria';
	r.request.clinicalQuestion = 'Assess the bladder mucosa for non-visible haematuria.';
	r.request.relevantHistory = 'Incidental non-visible haematuria; normal renal function.';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

describe('Cystoscopy request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine / low risk', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.riskBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-NON-VISIBLE-HAEMATURIA-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-LOW')).toBe(true);
	});

	it('escalates visible haematuria aged >= 45 to the two-week-wait tier (NICE NG12)', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'visible-haematuria';
		r.symptoms.symptomHaematuria = true;
		r.symptoms.visibleHaematuria = true;
		r.patient.age = 68;
		const g = calculateGrade(r);
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((x) => x.ruleId === 'R-URGENCY-2WW-VISIBLE-HAEMATURIA')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
		expect(g.flags.some((f) => f.category === 'visible-haematuria')).toBe(true);
	});

	it('escalates a non-visible haematuria aged >= 60 with dysuria to two-week-wait', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'non-visible-haematuria';
		r.patient.age = 65;
		r.symptoms.symptomDysuria = true;
		const g = calculateGrade(r);
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((x) => x.ruleId === 'R-URGENCY-2WW-NON-VISIBLE-HAEMATURIA')).toBe(true);
	});

	it('drives the risk axis high and defers when an active UTI is present', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'recurrent-uti';
		r.symptoms.currentUti = true;
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('high');
		expect(g.firedRules.some((x) => x.ruleId === 'R-RISK-ACTIVE-UTI')).toBe(true);
		expect(g.flags.some((f) => f.category === 'active-uti-defer')).toBe(true);
	});

	it('drives the risk axis high and surfaces an anticoagulant action when anticoagulated', () => {
		const r = createRoutineRequest();
		r.bleeding.takingAnticoagulant = true;
		r.bleeding.anticoagulantAgent = 'Warfarin';
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('high');
		expect(g.anticoagulantAction).not.toBe('');
		expect(g.firedRules.some((x) => x.ruleId === 'R-RISK-ANTICOAGULANT')).toBe(true);
		expect(g.flags.some((f) => f.category === 'high-bleeding-risk-anticoag')).toBe(true);
	});

	it('escalates urinary retention to the urgent tier', () => {
		const r = createRoutineRequest();
		r.symptoms.symptomRetention = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((x) => x.ruleId === 'R-URGENCY-RETENTION')).toBe(true);
	});

	it('flags a procedure mismatch as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'lower-urinary-tract-symptoms';
		r.request.procedure = 'other';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((x) => x.ruleId === 'R-APPROP-LOWER-URINARY-TRACT-SYMPTOMS-MISMATCH')).toBe(true);
	});

	it('recommends query-referrer when completeness drops below 50%', () => {
		const r = createDefaultRequest();
		// Only set a couple of fields, leaving most mandatory ones blank.
		r.request.primaryIndication = '';
		const g = calculateGrade(r);
		expect(g.completenessPercent).toBeLessThan(50);
		expect(g.recommendation).toBe('query-referrer');
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((x) => x.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((x) => x.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createRoutineRequest();
		r.symptoms.visibleHaematuria = true;
		r.bleeding.takingAnticoagulant = true;
		const g = calculateGrade(r);
		const ids = g.firedRules.map((x) => x.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Cystoscopy request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createDefaultRequest();
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the suspected-cancer flag for a suspected bladder tumour', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'suspected-bladder-tumour';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-CANCER-2WW-001')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
