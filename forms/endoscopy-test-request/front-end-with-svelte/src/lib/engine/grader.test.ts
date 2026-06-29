import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { EndoscopyRequest } from './types';

/** A fully-completed, routine, appropriate upper-GI request fixture. */
function createCompleteRequest(): EndoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'GP';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.dateOfBirth = '1958-03-14';
	r.request.requestedProcedure = 'ogd';
	r.request.primaryIndication = 'dyspepsia';
	r.request.clinicalQuestion = 'Persistent dyspepsia unresponsive to PPI — exclude peptic ulcer / malignancy.';
	r.request.relevantHistory = 'Three months of epigastric pain.';
	r.comorbidities.asaGrade = 'II';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

describe('Endoscopy request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine / low risk', () => {
		const g = calculateGrade(createCompleteRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.riskBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-DYSPEPSIA-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-REQUESTED')).toBe(true);
	});

	it('auto-escalates active upper-GI bleeding to emergency', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'upper-gi-bleeding';
		r.redFlags.redFlagGiBleeding = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-ACUTE-GI-BLEED')).toBe(true);
		expect(g.flags.some((f) => f.category === 'acute-gi-bleed')).toBe(true);
	});

	it('escalates dysphagia to the two-week-wait suspected-cancer pathway', () => {
		const r = createCompleteRequest();
		r.redFlags.redFlagDysphagia = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-2WW-DYSPHAGIA')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('escalates a positive FIT (>= 10 ug/g) lower-GI request to two-week-wait', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'positive-fit';
		r.request.requestedProcedure = 'colonoscopy';
		r.redFlags.fitResultUgG = 40;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-2WW-POSITIVE-FIT')).toBe(true);
	});

	it('marks an indication/procedure mismatch as usually-not-appropriate → query-referrer', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'dyspepsia';
		r.request.requestedProcedure = 'colonoscopy';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(2);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-DYSPEPSIA-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('escalates pre-procedure risk to high for ASA V', () => {
		const r = createCompleteRequest();
		r.comorbidities.asaGrade = 'V';
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-ASA-HIGH')).toBe(true);
		expect(g.flags.some((f) => f.category === 'asa-iv')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createCompleteRequest();
		r.redFlags.redFlagDysphagia = true;
		r.comorbidities.asaGrade = 'IV';
		const g = calculateGrade(r);
		const ids = g.firedRules.map((rule) => rule.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Endoscopy request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the missing-FIT flag for a lower-GI indication without a FIT result', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'rectal-bleeding';
		r.request.requestedProcedure = 'colonoscopy';
		r.redFlags.fitResultUgG = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-MISSING-FIT-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createCompleteRequest();
		r.redFlags.redFlagGiBleeding = true; // high
		r.infectionPrep.mrsa = true; // medium
		r.request.primaryIndication = 'rectal-bleeding';
		r.request.requestedProcedure = 'colonoscopy';
		r.redFlags.fitResultUgG = null; // low
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createCompleteRequest());
		expect(flags).toHaveLength(0);
	});
});
