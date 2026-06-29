import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { ColonoscopyRequest } from './types';

/** A complete, appropriate, routine request: change in bowel habit + colonoscopy. */
function createRoutineRequest(): ColonoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'gp';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.setting = 'community';
	r.request.procedure = 'colonoscopy';
	r.request.primaryIndication = 'change-in-bowel-habit';
	r.request.clinicalQuestion = 'Investigate change in bowel habit; exclude malignancy.';
	r.redFlags.fitResultUgG = 4;
	r.fitness.fitForBowelPrep = true;
	r.fitness.asaGrade = 'II';
	r.triage.urgency = 'routine';
	return r;
}

describe('Colonoscopy request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.riskBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CHANGE-IN-BOWEL-HABIT-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-LOW')).toBe(true);
	});

	it('escalates a positive FIT (≥10 µg Hb/g) to the two-week-wait pathway', () => {
		const r = createRoutineRequest();
		r.redFlags.fitResultUgG = 180;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.twoWeekWaitEligible).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-FIT-2WW')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('escalates a lower-GI red-flag combination to two-week-wait', () => {
		const r = createRoutineRequest();
		r.redFlags.weightLoss = true;
		r.redFlags.rectalBleeding = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-RED-FLAG-2WW')).toBe(true);
	});

	it('auto-escalates an emergency setting with active rectal bleeding to emergency', () => {
		const r = createRoutineRequest();
		r.patient.setting = 'emergency';
		r.redFlags.rectalBleeding = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-EMERGENCY-BLEED')).toBe(true);
	});

	it('drives risk to high and redirects when on an anticoagulant', () => {
		const r = createRoutineRequest();
		r.medication.takingAnticoagulant = true;
		r.medication.anticoagulantAgent = 'apixaban';
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('high');
		expect(g.recommendation).toBe('redirect');
		expect(g.anticoagulantAction).toContain('apixaban');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-ANTICOAG')).toBe(true);
		expect(g.flags.some((f) => f.category === 'high-bleeding-risk-anticoag')).toBe(true);
	});

	it('flags ASA IV and unfit-for-prep as high risk', () => {
		const r = createRoutineRequest();
		r.fitness.asaGrade = 'IV';
		r.fitness.fitForBowelPrep = false;
		const g = calculateGrade(r);
		expect(g.riskBand).toBe('high');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-ASA-HIGH')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-UNFIT-PREP')).toBe(true);
		expect(g.flags.some((f) => f.category === 'asa-iv')).toBe(true);
		expect(g.flags.some((f) => f.category === 'unfit-for-prep')).toBe(true);
	});

	it('marks a mismatched indication × procedure as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'ibd-diagnosis';
		r.request.procedure = 'ct-colonography';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-IBD-DIAGNOSIS-MISMATCH')).toBe(true);
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
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Colonoscopy request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('flags a missing FIT for a symptomatic referral', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'rectal-bleeding';
		r.redFlags.fitResultUgG = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-MISSING-FIT-001')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest(), { twoWeekWaitEligible: false });
		expect(flags).toHaveLength(0);
	});
});
