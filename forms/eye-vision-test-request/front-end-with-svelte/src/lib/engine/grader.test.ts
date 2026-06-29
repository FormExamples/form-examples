import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { EyeVisionRequest } from './types';

/** A fully-completed, routine, appropriate glaucoma-monitoring request. */
function createRoutineRequest(): EyeVisionRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Mr A Okafor';
	r.clinician.clinicianRole = 'Optometrist';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.request.testType = 'tonometry';
	r.request.laterality = 'both';
	r.request.primaryIndication = 'suspected-glaucoma';
	r.request.clinicalQuestion = 'Raised IOP on screening — please assess for chronic open-angle glaucoma.';
	r.triage.urgency = 'routine';
	return r;
}

/** A sudden-visual-loss request that must auto-escalate to emergency. */
function createSuddenLossRequest(): EyeVisionRequest {
	const r = createRoutineRequest();
	r.request.testType = 'fundus-examination';
	r.request.primaryIndication = 'sudden-visual-loss';
	r.symptoms.suddenLoss = true;
	r.triage.urgency = 'urgent';
	return r;
}

describe('Eye vision test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-GLAUCOMA-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates sudden visual loss to emergency regardless of requested urgency', () => {
		const g = calculateGrade(createSuddenLossRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUDDEN-VISUAL-LOSS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'sudden-visual-loss-emergency')).toBe(true);
	});

	it('escalates flashes / floaters to emergency (retinal-detachment symptoms)', () => {
		const r = createRoutineRequest();
		r.symptoms.flashesFloaters = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-RETINAL-DETACHMENT')).toBe(true);
		expect(g.flags.some((f) => f.category === 'retinal-detachment-symptoms')).toBe(true);
	});

	it('escalates acute painful red eye to emergency', () => {
		const r = createRoutineRequest();
		r.symptoms.eyePain = true;
		r.symptoms.redEye = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-ACUTE-PAINFUL-RED-EYE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'acute-painful-red-eye')).toBe(true);
	});

	it('marks a mismatched indication x test pairing as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'red-eye';
		r.request.testType = 'orthoptic-assessment';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-RED-EYE-MISMATCH')).toBe(true);
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'suspected-glaucoma';
		r.request.testType = 'fundus-examination';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-GLAUCOMA-PLAUSIBLE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 16 total weight missing → 10/16 ≈ 63%.
		expect(g.completenessPercent).toBe(63);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('raises clinical priority for risk factors', () => {
		const r = createRoutineRequest();
		r.symptoms.reducedVision = true;
		r.riskFactors.diabetes = true;
		const g = calculateGrade(r);
		// reduced vision (2) + diabetes (1) = 3 points → moderate.
		expect(g.priorityBand).toBe('moderate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PRIORITY-REDUCED-VISION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PRIORITY-DIABETES')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createSuddenLossRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Eye vision test request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the suspected giant cell arteritis flag', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'headache-visual-symptoms';
		r.symptoms.suddenLoss = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-GCA-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createSuddenLossRequest();
		r.request.clinicalQuestion = '';
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
