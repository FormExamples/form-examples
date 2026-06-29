import { describe, it, expect } from 'vitest';
import { gradeClimate, gradeDomain } from './grader';
import { detectAdditionalFlags } from './flagged-issues';
import { classifyScore } from './utils';
import { GRADED_DOMAIN_KEYS, surveyItems } from './rules';
import type { AssessmentData, GradedDomainKey, LikertValue } from './types';

/**
 * A blank assessment with all fields at their unanswered defaults. Inlined here
 * (rather than imported from the `.svelte.ts` store) so the engine tests do not
 * pull in Svelte runes or `$app/environment`.
 */
function blank(): AssessmentData {
	return {
		demographics: { department: '', tenureBand: '', hoursBand: '', roleLevel: '', workLocation: '' },
		leadership: { ld1: null, ld2: null, ld3: null, ld4: null, ld5: null },
		psychSafety: { ps1: null, ps2: null, ps3: null, ps4: null, ps5: null },
		inclusion: { in1: null, in2: null, in3: null, in4: null, in5: null },
		communication: { co1: null, co2: null, co3: null, co4: null },
		collaboration: { cl1: null, cl2: null, cl3: null, cl4: null },
		recognition: { re1: null, re2: null, re3: null, re4: null },
		wellbeing: { we1: null, we2: null, we3: null, we4: null, we5: null },
		career: { ca1: null, ca2: null, ca3: null, ca4: null },
		overall: {
			oc1: null,
			oc2: null,
			oc3: null,
			recommendAsPlaceToWork: '',
			biggestStrength: '',
			biggestImprovement: '',
			otherComments: ''
		}
	};
}

/** Set every graded Likert item to `value`. */
function fillAll(value: LikertValue): AssessmentData {
	const d = blank();
	for (const item of surveyItems) {
		if (GRADED_DOMAIN_KEYS.indexOf(item.domain as GradedDomainKey) === -1) continue;
		(d[item.domain as GradedDomainKey] as unknown as Record<string, LikertValue>)[item.id] = value;
	}
	return d;
}

describe('classifyScore', () => {
	it('bands 0-100 scores into categories', () => {
		expect(classifyScore(100)).toBe('thriving');
		expect(classifyScore(85)).toBe('thriving');
		expect(classifyScore(84)).toBe('healthy');
		expect(classifyScore(70)).toBe('healthy');
		expect(classifyScore(69)).toBe('developing');
		expect(classifyScore(50)).toBe('developing');
		expect(classifyScore(49)).toBe('strained');
		expect(classifyScore(25)).toBe('strained');
		expect(classifyScore(24)).toBe('critical');
		expect(classifyScore(0)).toBe('critical');
		expect(classifyScore(null)).toBe('');
	});
});

describe('gradeDomain', () => {
	it('returns null mean/score for an unanswered domain', () => {
		const { result } = gradeDomain(blank(), 'leadership');
		expect(result.mean).toBeNull();
		expect(result.score).toBeNull();
		expect(result.answeredCount).toBe(0);
		expect(result.totalCount).toBe(5);
	});

	it('normalises a domain mean to a 0-100 score (mean × 20)', () => {
		const d = blank();
		d.leadership = { ld1: 4, ld2: 4, ld3: 4, ld4: 4, ld5: 4 };
		const { result } = gradeDomain(d, 'leadership');
		expect(result.mean).toBe(4);
		expect(result.score).toBe(80);
		expect(result.category).toBe('healthy');
		expect(result.answeredCount).toBe(5);
	});
});

describe('gradeClimate', () => {
	it('returns a null composite when nothing is answered', () => {
		const result = gradeClimate(blank());
		expect(result.compositeScore).toBeNull();
		expect(result.category).toBe('');
		expect(result.answeredCount).toBe(0);
		expect(result.totalCount).toBe(36);
	});

	it('grades an all-5 response as thriving (100/100)', () => {
		const result = gradeClimate(fillAll(5));
		expect(result.compositeScore).toBe(100);
		expect(result.category).toBe('thriving');
		expect(result.answeredCount).toBe(36);
	});

	it('grades an all-3 response as developing (60/100)', () => {
		const result = gradeClimate(fillAll(3));
		expect(result.compositeScore).toBe(60);
		expect(result.category).toBe('developing');
	});

	it('grades an all-1 response as critical (20/100)', () => {
		const result = gradeClimate(fillAll(1));
		expect(result.compositeScore).toBe(20);
		expect(result.category).toBe('critical');
	});

	it('excludes the overall (oc) Likert items from the composite', () => {
		const d = fillAll(5);
		d.overall.oc1 = 1;
		d.overall.oc2 = 1;
		d.overall.oc3 = 1;
		const result = gradeClimate(d);
		// The overall block is not graded, so the composite stays at 100.
		expect(result.compositeScore).toBe(100);
		expect(result.totalCount).toBe(36);
	});
});

describe('detectAdditionalFlags', () => {
	it('returns no flags for a thriving response', () => {
		expect(gradeClimate(fillAll(5)).additionalFlags).toHaveLength(0);
	});

	it('flags a critical composite as high priority', () => {
		const flags = gradeClimate(fillAll(1)).additionalFlags;
		expect(flags.some((f) => f.id === 'FLAG-COMPOSITE-CRITICAL')).toBe(true);
	});

	it('flags a single strongly-disagree psychological-safety item', () => {
		const d = fillAll(5);
		d.psychSafety.ps1 = 1;
		const flags = gradeClimate(d).additionalFlags;
		expect(flags.some((f) => f.id === 'FLAG-PSYCH-SAFETY-STRONG-DISAGREE')).toBe(true);
	});

	it('flags retention risk when the respondent would not recommend', () => {
		const d = fillAll(4);
		d.overall.recommendAsPlaceToWork = 'definitely-not';
		const flags = gradeClimate(d).additionalFlags;
		expect(flags.some((f) => f.id === 'FLAG-RECOMMEND-RISK')).toBe(true);
	});

	it('flags free-text that may break anonymity', () => {
		const d = fillAll(4);
		d.overall.biggestImprovement = 'My manager John Smith is the problem.';
		const flags = gradeClimate(d).additionalFlags;
		expect(flags.some((f) => f.id === 'FLAG-TEXT-PII')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = fillAll(1);
		d.overall.recommendAsPlaceToWork = 'definitely-not';
		const g = gradeClimate(d);
		const flags = detectAdditionalFlags(d, {
			compositeScore: g.compositeScore,
			category: g.category,
			domainScores: g.domainScores,
			answeredCount: g.answeredCount
		});
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
