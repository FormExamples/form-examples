import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { BronchoscopyRequest } from './types';

/** A complete, appropriate, routine flexible-bronchoscopy request fixture. */
function createRoutineRequest(): BronchoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.request.procedure = 'flexible-bronchoscopy';
	r.request.primaryIndication = 'persistent-cough';
	r.request.clinicalQuestion = 'Persistent cough for 8 weeks — assess the airway for an endobronchial cause.';
	r.symptoms.symptomCough = true;
	r.symptoms.imagingFindings = 'CT chest: no focal mass, mild bronchial wall thickening.';
	r.procedural.asaGrade = 'II';
	r.procedural.sedation = 'conscious';
	r.triage.urgency = 'routine';
	return r;
}

/** A two-week-wait request: suspected lung cancer routed to EBUS. */
function createCancerRequest(): BronchoscopyRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.request.procedure = 'ebus';
	r.request.primaryIndication = 'suspected-lung-cancer';
	r.request.clinicalQuestion = 'Mediastinal node sampling for suspected lung cancer.';
	r.symptoms.symptomWeightLoss = true;
	r.triage.urgency = 'two-week-wait';
	return r;
}

/** A high-risk emergency request: massive haemoptysis, on an anticoagulant. */
function createEmergencyRequest(): BronchoscopyRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.request.procedure = 'flexible-bronchoscopy';
	r.request.primaryIndication = 'haemoptysis';
	r.request.clinicalQuestion = 'Massive haemoptysis — locate and control the bleeding source.';
	r.symptoms.symptomHaemoptysis = true;
	r.symptoms.haemoptysisSeverity = 'massive';
	r.bleeding.takingAnticoagulant = true;
	r.bleeding.anticoagulantAgent = 'apixaban';
	r.procedural.oxygenDependent = true;
	r.procedural.asaGrade = 'IV';
	r.triage.urgency = 'urgent';
	return r;
}

describe('Bronchoscopy request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine / low risk', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.triageTier).toBe('routine');
		expect(g.riskBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.recommendation).toBe('accept');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-PERSISTENT-COUGH-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-LOW')).toBe(true);
	});

	it('routes suspected lung cancer onto the NICE NG12 two-week-wait pathway', () => {
		const g = calculateGrade(createCancerRequest());
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.targetTimeframe).toBe('Within 14 days (NICE NG12)');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-2WW-SUSPECTED-CANCER')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('auto-escalates massive haemoptysis to emergency regardless of requested urgency', () => {
		const g = calculateGrade(createEmergencyRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.riskBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-MASSIVE-HAEMOPTYSIS')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-ANTICOAGULANT')).toBe(true);
		expect(g.flags.some((f) => f.category === 'massive-haemoptysis-emergency')).toBe(true);
		expect(g.flags.some((f) => f.category === 'high-bleeding-risk-anticoag')).toBe(true);
		expect(g.anticoagulantAction).toContain('apixaban');
	});

	it('marks a mismatched indication/procedure pairing as usually-not-appropriate → query referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'foreign-body';
		r.request.procedure = 'bronchoalveolar-lavage';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(2);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-FOREIGN-BODY-MISMATCH')).toBe(true);
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

	it('escalates risk to moderate for an antiplatelet agent and borderline platelets', () => {
		const r = createRoutineRequest();
		r.bleeding.takingAntiplatelet = true;
		r.bleeding.antiplateletAgent = 'clopidogrel';
		r.bleeding.plateletCount = 80;
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('moderate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-ANTIPLATELET')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-BORDERLINE-PLATELETS')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createEmergencyRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Bronchoscopy request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the hypoxia flag for an oxygen-dependent patient', () => {
		const r = createRoutineRequest();
		r.procedural.oxygenDependent = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-HYPOXIA-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createEmergencyRequest();
		r.request.clinicalQuestion = '';
		r.symptoms.imagingFindings = '';
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
