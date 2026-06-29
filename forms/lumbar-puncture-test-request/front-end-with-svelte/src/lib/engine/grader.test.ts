import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { LumbarPunctureRequest } from './types';

/** A fully-completed, routine, appropriate LP request fixture. */
function createRoutineRequest(): LumbarPunctureRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'Neurology registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1986-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.procedure.procedureIntent = 'diagnostic';
	r.procedure.primaryIndication = 'suspected-multiple-sclerosis';
	r.procedure.clinicalQuestion = 'Oligoclonal bands to support a diagnosis of multiple sclerosis?';
	r.neuroSafety.ctHeadStatus = 'not-required';
	r.triage.urgency = 'routine';
	return r;
}

/** Suspected meningitis — auto-escalates triage to emergency. */
function createMeningitisRequest(): LumbarPunctureRequest {
	const r = createRoutineRequest();
	r.procedure.primaryIndication = 'suspected-meningitis';
	r.procedure.clinicalQuestion = 'CSF microscopy and culture to confirm bacterial meningitis?';
	r.triage.urgency = 'emergency';
	return r;
}

describe('Lumbar puncture four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.contraindicationBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-MULTIPLE-SCLEROSIS-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected meningitis to emergency and flags it', () => {
		const g = calculateGrade(createMeningitisRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-MENINGITIS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-meningitis-emergency')).toBe(true);
		// Appropriate, safe, complete → accepted onto the emergency pathway.
		expect(g.recommendation).toBe('accept');
	});

	it('contraindicates suspected raised ICP without a reassuring CT head', () => {
		const r = createRoutineRequest();
		r.neuroSafety.suspectedRaisedIntracranialPressure = true;
		r.neuroSafety.ctHeadStatus = 'awaited';
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-RAISED-ICP-NO-IMAGING')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-RAISED-ICP-NEEDS-IMAGING-001')).toBe(true);
	});

	it('contraindicates a local skin infection at the puncture site', () => {
		const r = createRoutineRequest();
		r.bleeding.localSkinInfection = true;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-LOCAL-INFECTION')).toBe(true);
		expect(g.flags.some((f) => f.category === 'local-infection')).toBe(true);
	});

	it('contraindicates platelets below 40 ×10⁹/L', () => {
		const r = createRoutineRequest();
		r.bleeding.plateletCount = 32;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-PLATELETS-LOW')).toBe(true);
		const flag = g.flags.find((f) => f.category === 'thrombocytopenia');
		expect(flag?.priority).toBe('high');
	});

	it('cautions on a raised INR and recommends querying the referrer', () => {
		const r = createRoutineRequest();
		r.bleeding.inr = 2.3;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('caution');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-INR-HIGH')).toBe(true);
		expect(g.flags.some((f) => f.category === 'coagulopathy')).toBe(true);
	});

	it('cautions on anticoagulation and raises a high-bleeding-risk flag', () => {
		const r = createRoutineRequest();
		r.bleeding.takingAnticoagulant = true;
		r.bleeding.anticoagulantAgent = 'Apixaban';
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('caution');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-ANTICOAGULANT')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-HIGH-BLEEDING-RISK-ANTICOAG-001')).toBe(true);
	});

	it('treats an indication/intent mismatch as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.procedure.primaryIndication = 'suspected-meningitis';
		r.procedure.procedureIntent = 'therapeutic';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(3);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-MENINGITIS-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.procedure.primaryIndication = '';
		r.procedure.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 16 total weight missing → 10/16 ≈ 63%.
		expect(g.completenessPercent).toBe(63);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createMeningitisRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Lumbar puncture flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.procedure.primaryIndication = '';
		r.procedure.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
