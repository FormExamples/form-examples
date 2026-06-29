import { describe, it, expect } from 'vitest';
import { gradeStress, classifyDomainMean, gradeDomain } from './stress-grader';
import type { AssessmentData } from './types';

/** A fully-blank assessment (kept local so the test has no store/$app deps). */
function blank(): AssessmentData {
	return {
		demographics: { department: '', tenureBand: '', hoursBand: '' },
		demands: { dem1: null, dem2: null, dem3: null, dem4: null, dem5: null, dem6: null, dem7: null, dem8: null },
		control: { ctrl1: null, ctrl2: null, ctrl3: null, ctrl4: null, ctrl5: null, ctrl6: null },
		managerSupport: { ms1: null, ms2: null, ms3: null, ms4: null, ms5: null },
		peerSupport: { ps1: null, ps2: null, ps3: null, ps4: null },
		relationships: { rel1: null, rel2: null, rel3: null, rel4: null },
		role: { role1: null, role2: null, role3: null, role4: null, role5: null },
		change: { chg1: null, chg2: null, chg3: null },
		additionalComments: { mostStressfulAspect: '', suggestionsForImprovement: '', otherComments: '' }
	};
}

describe('classifyDomainMean', () => {
	it('maps means to HSE concern categories (demands benchmarks)', () => {
		// demands: goodAt 4.17, moderateAt 3.71, highAt 3.32
		expect(classifyDomainMean('demands', 4.5)).toBe('low');
		expect(classifyDomainMean('demands', 4.0)).toBe('moderate');
		expect(classifyDomainMean('demands', 3.4)).toBe('high');
		expect(classifyDomainMean('demands', 2.0)).toBe('very-high');
	});

	it('returns empty for a null mean', () => {
		expect(classifyDomainMean('demands', null)).toBe('');
	});
});

describe('gradeDomain', () => {
	it('reverse-codes negatively-worded demands items', () => {
		const d = blank();
		// All demands raw = 5 (Always). Reverse-coded => 1 each, mean 1.0.
		d.demands = { dem1: 5, dem2: 5, dem3: 5, dem4: 5, dem5: 5, dem6: 5, dem7: 5, dem8: 5 };
		const { result } = gradeDomain(d, 'demands');
		expect(result.mean).toBe(1);
		expect(result.answeredCount).toBe(8);
		expect(result.totalCount).toBe(8);
		expect(result.category).toBe('very-high');
	});

	it('does not reverse-code positively-worded control items', () => {
		const d = blank();
		// All control raw = 5 => mean 5.0 (favourable).
		d.control = { ctrl1: 5, ctrl2: 5, ctrl3: 5, ctrl4: 5, ctrl5: 5, ctrl6: 5 };
		const { result } = gradeDomain(d, 'control');
		expect(result.mean).toBe(5);
		expect(result.category).toBe('low');
	});

	it('returns a null mean for an unanswered domain', () => {
		const { result } = gradeDomain(blank(), 'role');
		expect(result.mean).toBeNull();
		expect(result.answeredCount).toBe(0);
		expect(result.category).toBe('');
	});
});

describe('gradeStress', () => {
	it('grades a fully-blank assessment as not-assessed', () => {
		const g = gradeStress(blank());
		expect(g.answeredCount).toBe(0);
		expect(g.overallRisk).toBe('');
		expect(g.firedRules).toHaveLength(0);
	});

	it('overall risk is the worst domain category', () => {
		const d = blank();
		// control favourable (low concern)
		d.control = { ctrl1: 5, ctrl2: 5, ctrl3: 5, ctrl4: 5, ctrl5: 5, ctrl6: 5 };
		// demands all "always" => reverse-coded 1.0 => very-high concern
		d.demands = { dem1: 5, dem2: 5, dem3: 5, dem4: 5, dem5: 5, dem6: 5, dem7: 5, dem8: 5 };
		const g = gradeStress(d);
		expect(g.domains.control.category).toBe('low');
		expect(g.domains.demands.category).toBe('very-high');
		expect(g.overallRisk).toBe('very-high');
		expect(g.answeredCount).toBe(14);
	});

	it('flags reported harassment / bullying regardless of domain mean', () => {
		const d = blank();
		d.relationships = { rel1: 5, rel2: 1, rel3: 5, rel4: 1 };
		const g = gradeStress(d);
		const ids = g.additionalFlags.map((f) => f.id);
		expect(ids).toContain('FLAG-REL-HARASS');
		expect(ids).toContain('FLAG-REL-BULLY');
	});

	it('flags distress wording and possible PII in free-text comments', () => {
		const d = blank();
		d.additionalComments.otherComments = 'I feel hopeless. Contact me at jane@example.com';
		const g = gradeStress(d);
		const ids = g.additionalFlags.map((f) => f.id);
		expect(ids).toContain('FLAG-TEXT-DISTRESS');
		expect(ids).toContain('FLAG-TEXT-PII');
	});

	it('stamps a timestamp', () => {
		const g = gradeStress(blank());
		expect(() => new Date(g.timestamp).toISOString()).not.toThrow();
	});
});
