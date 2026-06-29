import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { PulmonaryFunctionTestRequest } from './types';

/** A complete, appropriate, routine request fixture (suspected COPD + spirometry). */
function createRoutineRequest(): PulmonaryFunctionTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'gp';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.heightCm = 162;
	r.patient.weightKg = 71;
	r.request.testType = 'spirometry';
	r.request.primaryIndication = 'suspected-copd';
	r.request.clinicalQuestion = 'Confirm airflow obstruction in a long-term smoker.';
	r.background.smokingStatus = 'ex';
	r.triage.urgency = 'routine';
	r.triage.setting = 'community';
	return r;
}

describe('Pulmonary function test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.contraindicationBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-COPD-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-CLEAR')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('drives a contraindication (haemoptysis) to contraindicated + redirect + urgent', () => {
		const r = createRoutineRequest();
		r.safety.haemoptysis = true;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.recommendation).toBe('redirect');
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-HAEMOPTYSIS')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-HAEMOPTYSIS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'haemoptysis')).toBe(true);
	});

	it('treats a recent respiratory infection as caution', () => {
		const r = createRoutineRequest();
		r.safety.recentRespiratoryInfection = true;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('caution');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-RESPIRATORY-INFECTION')).toBe(true);
		expect(g.flags.some((f) => f.category === 'active-respiratory-infection')).toBe(true);
	});

	it('escalates a pre-operative indication to urgent triage', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'pre-operative';
		r.request.testType = 'full-lung-function';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-PRE-OPERATIVE')).toBe(true);
	});

	it('marks a mismatched test/indication pairing as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'restrictive-disease';
		r.request.testType = 'peak-flow';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(2);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-RESTRICTIVE-DISEASE-MISMATCH')).toBe(
			true
		);
	});

	it('scores a plausible pairing as may-be-appropriate', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'suspected-copd';
		r.request.testType = 'full-lung-function';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-COPD-PLAUSIBLE')).toBe(
			true
		);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 17 total weight missing → 11/17 ≈ 65%.
		expect(g.completenessPercent).toBe(65);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createRoutineRequest();
		r.safety.haemoptysis = true;
		const g = calculateGrade(r);
		const ids = g.firedRules.map((rule) => rule.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Pulmonary function test request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the recent-MI contraindication flag', () => {
		const r = createRoutineRequest();
		r.safety.recentMiOrEyeAbdominalSurgery = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-RECENT-MI-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.safety.haemoptysis = true;
		r.request.primaryIndication = '';
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
