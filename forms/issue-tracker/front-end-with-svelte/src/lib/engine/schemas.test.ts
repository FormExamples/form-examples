import { describe, expect, it } from 'vitest';
import {
	parseAssessment,
	parseScores,
	rawScoresSchema,
	safeParseAssessment,
} from './schemas';
import { gradeIssue } from './composite-grader';

describe('rawScoresSchema', () => {
	it('accepts an empty payload and applies defaults', () => {
		const r = rawScoresSchema.parse({});
		expect(r).toEqual({
			scoreByPriorityRank: null,
			scoreBySeverityOfImpact: null,
			scoreByMagnitudeOfDamage: null,
			scoreByHarmGrade: null,
			scoreByFailureCondition: '',
			scoreByMoscowRequirement: null,
			scoreByFrequencyPercent: null,
		});
	});

	it('coerces string-typed form values', () => {
		const r = parseScores({
			scoreByPriorityRank: '2',
			scoreBySeverityOfImpact: '4',
			scoreByMagnitudeOfDamage: '7',
			scoreByHarmGrade: '2',
			scoreByFailureCondition: 'B',
			scoreByMoscowRequirement: '1',
			scoreByFrequencyPercent: '42.5',
		});
		expect(r.scoreByPriorityRank).toBe(2);
		expect(r.scoreBySeverityOfImpact).toBe(4);
		expect(r.scoreByMagnitudeOfDamage).toBe(7);
		expect(r.scoreByHarmGrade).toBe(2);
		expect(r.scoreByFailureCondition).toBe('B');
		expect(r.scoreByMoscowRequirement).toBe(1);
		expect(r.scoreByFrequencyPercent).toBe(42.5);
	});

	it('treats empty strings as null for nullable numeric fields', () => {
		const r = parseScores({
			scoreByPriorityRank: '',
			scoreBySeverityOfImpact: '',
		});
		expect(r.scoreByPriorityRank).toBeNull();
		expect(r.scoreBySeverityOfImpact).toBeNull();
	});

	it('rejects severity out of range', () => {
		expect(() => parseScores({ scoreBySeverityOfImpact: 6 })).toThrow();
		expect(() => parseScores({ scoreBySeverityOfImpact: 0 })).toThrow();
	});

	it('rejects harm grade out of range', () => {
		expect(() => parseScores({ scoreByHarmGrade: 5 })).toThrow();
	});

	it('rejects an unknown failure condition', () => {
		expect(() => parseScores({ scoreByFailureCondition: 'F' })).toThrow();
	});

	it('rejects frequency outside 0..100', () => {
		expect(() => parseScores({ scoreByFrequencyPercent: 101 })).toThrow();
		expect(() => parseScores({ scoreByFrequencyPercent: -1 })).toThrow();
	});
});

describe('issueTrackerAssessmentSchema', () => {
	it('parses an empty object into a fully populated default assessment', () => {
		const a = parseAssessment({});
		// Top-level shape is preserved with section defaults.
		expect(a.reporter).toBeDefined();
		expect(a.cc).toBeDefined();
		expect(a.scores.scoreBySeverityOfImpact).toBeNull();
		expect(a.scores.scoreByFailureCondition).toBe('');
		// And the parsed default still grades cleanly.
		const r = gradeIssue(a);
		expect(r.compositePriority).toBe('low');
	});

	it('rejects an unknown issue category enum', () => {
		expect(() =>
			parseAssessment({ reporter: { issueCategory: 'not-a-real-category' } }),
		).toThrow();
	});

	it('safeParseAssessment returns errors with paths', () => {
		const r = safeParseAssessment({
			reporter: { issueCategory: 'bogus' },
			scores: { scoreBySeverityOfImpact: 9 },
		});
		expect(r.ok).toBe(false);
		if (!r.ok) {
			const paths = r.errors.map((e) => e.path);
			expect(paths.some((p) => p.startsWith('reporter.'))).toBe(true);
			expect(paths.some((p) => p.startsWith('scores.'))).toBe(true);
		}
	});

	it('parses an HTML-form-shaped payload (everything string-typed) end to end', () => {
		const formLike = {
			reporter: {
				issueCategory: 'clinical-safety',
				environment: 'production',
				systemName: 'ward-9',
			},
			scores: {
				scoreByHarmGrade: '2',
				scoreBySeverityOfImpact: '5',
				scoreByFailureCondition: 'A',
				scoreByFrequencyPercent: '100',
			},
		};
		const a = parseAssessment(formLike);
		expect(a.scores.scoreByHarmGrade).toBe(2);
		expect(a.scores.scoreBySeverityOfImpact).toBe(5);
		expect(a.scores.scoreByFrequencyPercent).toBe(100);
		const r = gradeIssue(a);
		expect(r.compositePriority).toBe('critical');
		const flagCategories = r.additionalFlags.map((f) => f.category);
		expect(flagCategories).toContain('regulatory');
	});

	it('issueTrackerAssessmentSchema is a satisfies-correct ZodType for IssueTrackerAssessment', () => {
		// Compile-time + runtime sanity that the inferred output type
		// matches the engine input type. Round-tripping through the
		// schema should keep gradeIssue happy.
		const def = parseAssessment({});
		expect(() => gradeIssue(def)).not.toThrow();
	});
});
