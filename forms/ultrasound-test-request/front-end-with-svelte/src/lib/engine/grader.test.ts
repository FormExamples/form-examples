import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { UltrasoundRequest } from './types';

/** A fully-completed, routine appropriate request (gallstones → liver-biliary). */
function createCompleteRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.clinicianRole = 'gp';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.bodyRegion = 'liver-biliary';
	d.request.primaryIndication = 'suspected-gallstones';
	d.request.clinicalQuestion = 'Confirm or exclude gallstones in right-upper-quadrant pain.';
	d.prep.fastingRequired = true;
	d.triage.urgency = 'routine';
	return d;
}

describe('Ultrasound request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createCompleteRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.suitabilityBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-GALLSTONES-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected testicular torsion to emergency regardless of requested urgency', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'scrotum-testes';
		d.request.primaryIndication = 'testicular-pain';
		d.triage.urgency = 'routine';
		d.redFlags.suspectedTesticularTorsion = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-TORSION')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-testicular-torsion')).toBe(true);
	});

	it('escalates suspected DVT to urgent', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'dvt-leg';
		d.request.primaryIndication = 'suspected-dvt';
		d.redFlags.suspectedDvt = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-DVT')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SUSPECTED-DVT-URGENT-001')).toBe(true);
	});

	it('auto-escalates suspected AAA to emergency', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'abdomen';
		d.request.primaryIndication = 'suspected-aaa';
		d.prep.fastingRequired = true;
		d.redFlags.suspectedAaa = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-AAA')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SUSPECTED-AAA-001')).toBe(true);
	});

	it('marks a mismatched indication / region as usually-not-appropriate → query-referrer', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'abdomen';
		d.request.primaryIndication = 'testicular-pain';
		d.prep.fastingRequired = true;
		const g = calculateGrade(d);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-TESTICULAR-PAIN-MISMATCH')).toBe(true);
	});

	it('flags missing preparation as caution + prep-not-met', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'abdomen';
		d.request.primaryIndication = 'abdominal-pain';
		d.prep.fastingRequired = false;
		const g = calculateGrade(d);
		expect(g.suitabilityBand).toBe('caution');
		expect(g.flags.some((f) => f.flagId === 'F-PREP-NOT-MET-001')).toBe(true);
	});

	it('limits suitability and redirects on a raised BMI for a deep scan', () => {
		const d = createCompleteRequest();
		d.request.bodyRegion = 'abdomen';
		d.request.primaryIndication = 'abdominal-pain';
		d.prep.fastingRequired = true;
		d.patient.bodyMassIndex = 38;
		const g = calculateGrade(d);
		expect(g.suitabilityBand).toBe('limited');
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SUIT-HIGH-BMI')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createCompleteRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 14 total weight missing → 8/14 ≈ 57%.
		expect(g.completenessPercent).toBe(57);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const d = createCompleteRequest();
		d.redFlags.suspectedAaa = true;
		const g = calculateGrade(d);
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Ultrasound request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const flags = detectFlags(createDefaultRequest());
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the suspected-testicular-torsion flag', () => {
		const d = createDefaultRequest();
		d.redFlags.suspectedTesticularTorsion = true;
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-TESTICULAR-TORSION-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const d = createDefaultRequest();
		d.redFlags.suspectedDvt = true;
		const flags = detectFlags(d, { suitabilityBand: 'caution' });
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createCompleteRequest(), { suitabilityBand: 'ok' });
		expect(flags).toHaveLength(0);
	});
});
