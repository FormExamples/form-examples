import { describe, it, expect } from 'vitest';
import { gradeSatisfaction } from './grader';
import { detectAdditionalFlags } from './flagged-issues';
import { surveyItems, GRADED_DOMAIN_KEYS } from './rules';
import { classifyScore, classifyENps } from './utils';
import type { AssessmentData, GradedDomainKey, LikertValue } from './types';

/**
 * A blank survey with all fields at their unanswered defaults. Mirrors the
 * store's `createDefaultAssessment`, kept local so the engine test stays
 * independent of the SvelteKit runes store.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		demographics: { department: '', tenureBand: '', hoursBand: '' },
		roleTenure: { roleLevel: '', workLocation: '', rt1: null, rt2: null },
		workload: { wl1: null, wl2: null, wl3: null, wl4: null, wl5: null },
		management: { mg1: null, mg2: null, mg3: null, mg4: null, mg5: null },
		growth: { gr1: null, gr2: null, gr3: null, gr4: null },
		compensation: { cb1: null, cb2: null, cb3: null, cb4: null },
		culture: { cu1: null, cu2: null, cu3: null, cu4: null, cu5: null },
		environment: { en1: null, en2: null, en3: null, en4: null },
		recognition: { rc1: null, rc2: null, rc3: null, rc4: null },
		overall: {
			ov1: null,
			ov2: null,
			ov3: null,
			ov4: null,
			recommendScore: null,
			retentionIntent: '',
			suggestionsForImprovement: '',
			otherComments: ''
		}
	};
}

/** Set every Likert item in every graded domain to a fixed value. */
function fillAll(value: LikertValue): AssessmentData {
	const d = createDefaultAssessment();
	for (const key of GRADED_DOMAIN_KEYS) {
		const section = d[key] as unknown as Record<string, unknown>;
		for (const item of surveyItems.filter((it) => it.domain === key)) {
			section[item.id] = value;
		}
	}
	return d;
}

describe('Employee Satisfaction grading engine', () => {
	it('returns null composite for a blank survey', () => {
		const result = gradeSatisfaction(createDefaultAssessment());
		expect(result.compositeScore).toBeNull();
		expect(result.category).toBe('');
		expect(result.eNPS.score).toBeNull();
	});

	it('scores all-5 responses as 100 / excellent', () => {
		const result = gradeSatisfaction(fillAll(5));
		expect(result.compositeScore).toBe(100);
		expect(result.category).toBe('excellent');
		for (const key of GRADED_DOMAIN_KEYS) {
			expect(result.domainScores[key].score).toBe(100);
		}
	});

	it('scores all-3 responses as 60 / satisfactory', () => {
		const result = gradeSatisfaction(fillAll(3));
		expect(result.compositeScore).toBe(60);
		expect(result.category).toBe('satisfactory');
	});

	it('scores all-1 responses as 20 / very-poor', () => {
		const result = gradeSatisfaction(fillAll(1));
		expect(result.compositeScore).toBe(20);
		expect(result.category).toBe('very-poor');
	});

	it('normalises each domain mean to mean × 20', () => {
		const d = createDefaultAssessment();
		// workload: 1,2,3,4,5 → mean 3 → score 60
		d.workload = { wl1: 1, wl2: 2, wl3: 3, wl4: 4, wl5: 5 };
		const result = gradeSatisfaction(d);
		expect(result.domainScores.workload.mean).toBe(3);
		expect(result.domainScores.workload.score).toBe(60);
		expect(result.domainScores.workload.answeredCount).toBe(5);
	});

	it('classifies eNPS recommend scores correctly', () => {
		expect(classifyENps(10)).toBe('promoter');
		expect(classifyENps(8)).toBe('passive');
		expect(classifyENps(3)).toBe('detractor');
		expect(classifyENps(null)).toBe('');
	});

	it('classifies composite scores into the correct bands', () => {
		expect(classifyScore(90)).toBe('excellent');
		expect(classifyScore(75)).toBe('good');
		expect(classifyScore(60)).toBe('satisfactory');
		expect(classifyScore(30)).toBe('poor');
		expect(classifyScore(10)).toBe('very-poor');
		expect(classifyScore(null)).toBe('');
	});

	it('all survey item ids are unique', () => {
		const ids = surveyItems.map((i) => i.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Employee Satisfaction flagged issues', () => {
	it('returns no flags for an all-5 survey', () => {
		const result = gradeSatisfaction(fillAll(5));
		expect(result.additionalFlags).toHaveLength(0);
	});

	it('flags a very-poor composite as high priority', () => {
		const data = fillAll(1);
		const result = gradeSatisfaction(data);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-COMPOSITE-VP')).toBe(true);
		expect(result.additionalFlags.some((f) => f.priority === 'high')).toBe(true);
	});

	it('flags a respondent leaving within 6 months', () => {
		const data = fillAll(4);
		data.overall.retentionIntent = 'leaving-within-6-months';
		const flags = detectAdditionalFlags(data, gradeSatisfaction(data));
		expect(flags.some((f) => f.id === 'FLAG-RETENTION-LEAVING')).toBe(true);
	});

	it('flags an eNPS detractor', () => {
		const data = fillAll(4);
		data.overall.recommendScore = 3;
		const result = gradeSatisfaction(data);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-ENPS-DETRACTOR')).toBe(true);
	});

	it('flags a free-text comment that may contain identifying details', () => {
		const data = fillAll(4);
		data.overall.otherComments = 'Please reach me at john.smith@example.com to follow up.';
		const result = gradeSatisfaction(data);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-TEXT-PII')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const data = fillAll(1);
		data.overall.retentionIntent = 'probably-leave-12-months';
		data.overall.suggestionsForImprovement = 'More flexible hours please.';
		const result = gradeSatisfaction(data);
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = result.additionalFlags.map((f) => order[f.priority]);
		expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
	});

	const _domains: GradedDomainKey[] = GRADED_DOMAIN_KEYS;
	it('grades every domain key', () => {
		const result = gradeSatisfaction(fillAll(4));
		for (const key of _domains) {
			expect(result.domainScores[key]).toBeDefined();
		}
	});
});
