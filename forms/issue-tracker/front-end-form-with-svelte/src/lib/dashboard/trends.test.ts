import { describe, expect, it } from 'vitest';
import {
	count,
	countByCompositeAndMonth,
	countByField,
	countByMonth,
	numericStatsByField,
	topNByField,
} from './trends';
import type { IssueRow } from './csv';

const SAMPLE: IssueRow[] = [
	{
		id: 'A', status: 'open', compositePriority: 'critical',
		scoreByPriorityRank: 1, scoreBySeverityOfImpact: 5,
		scoreByMagnitudeOfDamage: 9, scoreByHarmGrade: 4,
		scoreByFailureCondition: 'A', scoreByMoscowRequirement: 1,
		scoreByFrequencyPercent: 100,
		ccSummary: 'pump dosing', systemName: 'ward-9-pumps',
		environment: 'field', ptAssignees: 'med-devices',
		reportedAt: '2026-04-12T08:00:00Z',
	},
	{
		id: 'B', status: 'open', compositePriority: 'critical',
		scoreByPriorityRank: 1, scoreBySeverityOfImpact: 5,
		scoreByMagnitudeOfDamage: 8, scoreByHarmGrade: 0,
		scoreByFailureCondition: 'B', scoreByMoscowRequirement: 1,
		scoreByFrequencyPercent: 95,
		ccSummary: 'replica lag', systemName: 'orders-db',
		environment: 'production', ptAssignees: 'sre',
		reportedAt: '2026-05-08T02:11:00Z',
	},
	{
		id: 'C', status: 'in-progress', compositePriority: 'high',
		scoreByPriorityRank: 2, scoreBySeverityOfImpact: 4,
		scoreByMagnitudeOfDamage: 6, scoreByHarmGrade: 1,
		scoreByFailureCondition: 'C', scoreByMoscowRequirement: 2,
		scoreByFrequencyPercent: 35,
		ccSummary: 'sso 500', systemName: 'auth-service',
		environment: 'production', ptAssignees: 'identity',
		reportedAt: '2026-05-06T14:02:00Z',
	},
	{
		id: 'D', status: 'open', compositePriority: 'moderate',
		scoreByPriorityRank: 3, scoreBySeverityOfImpact: 3,
		scoreByMagnitudeOfDamage: 4, scoreByHarmGrade: null,
		scoreByFailureCondition: 'C', scoreByMoscowRequirement: 3,
		scoreByFrequencyPercent: 20,
		ccSummary: 'csv missing column', systemName: 'reports-ui',
		environment: 'production', ptAssignees: 'analytics',
		reportedAt: '2026-05-04T09:48:00Z',
	},
	{
		id: 'E', status: 'closed', compositePriority: 'low',
		scoreByPriorityRank: 5, scoreBySeverityOfImpact: 1,
		scoreByMagnitudeOfDamage: 1, scoreByHarmGrade: 0,
		scoreByFailureCondition: 'E', scoreByMoscowRequirement: 4,
		scoreByFrequencyPercent: 0.5,
		ccSummary: 'typo', systemName: 'marketing-site',
		environment: 'production', ptAssignees: 'content',
		reportedAt: '2026-05-01T16:00:00Z',
	},
	{
		id: 'F', status: 'open', compositePriority: 'high',
		scoreByPriorityRank: 2, scoreBySeverityOfImpact: 4,
		scoreByMagnitudeOfDamage: 7, scoreByHarmGrade: 0,
		scoreByFailureCondition: 'B', scoreByMoscowRequirement: 1,
		scoreByFrequencyPercent: 60,
		ccSummary: 'backup failing', systemName: 'orders-db',
		environment: 'production', ptAssignees: 'sre',
		reportedAt: '2026-04-30T03:55:00Z',
	},
];

describe('trends — counts', () => {
	it('count() returns the number of rows', () => {
		expect(count(SAMPLE)).toBe(6);
		expect(count([])).toBe(0);
	});

	it('countByField groups by composite priority', () => {
		expect(countByField(SAMPLE, 'compositePriority')).toEqual({
			critical: 2,
			high: 2,
			moderate: 1,
			low: 1,
		});
	});

	it('countByField groups by environment with (unspecified) for missing values', () => {
		const withMissing: IssueRow[] = [
			...SAMPLE,
			{ ...SAMPLE[0], id: 'X', environment: '' },
		];
		expect(countByField(withMissing, 'environment')).toEqual({
			field: 1,
			production: 5,
			'(unspecified)': 1,
		});
	});

	it('countByMonth bucketises by ISO YYYY-MM and sorts ascending', () => {
		expect(countByMonth(SAMPLE)).toEqual({
			'2026-04': 2,
			'2026-05': 4,
		});
	});

	it('countByMonth handles empty / unparseable reportedAt', () => {
		const broken: IssueRow[] = [
			{ ...SAMPLE[0], id: 'Q1', reportedAt: '' },
			{ ...SAMPLE[0], id: 'Q2', reportedAt: 'not-a-date' },
		];
		expect(countByMonth(broken)).toEqual({ '(unspecified)': 2 });
	});

	it('countByCompositeAndMonth produces stacked-bar-shaped buckets', () => {
		expect(countByCompositeAndMonth(SAMPLE)).toEqual({
			'2026-04': { critical: 1, high: 1 },
			'2026-05': { critical: 1, high: 1, moderate: 1, low: 1 },
		});
	});
});

describe('trends — numeric stats', () => {
	it('numericStatsByField computes count/sum/avg/min/max per group', () => {
		// production harm grades: B=0, C=1, E=0, F=0 (D excluded — null)
		// → count 4, sum 1, avg 0.25, min 0, max 1
		// field harm grade: A=4 → count 1
		const harmByEnv = numericStatsByField(SAMPLE, 'environment', 'scoreByHarmGrade');
		expect(harmByEnv).toEqual({
			field: { count: 1, sum: 4, avg: 4, min: 4, max: 4 },
			production: { count: 4, sum: 1, avg: 0.25, min: 0, max: 1 },
		});
	});

	it('numericStatsByField excludes null values from the count', () => {
		// Issue D has scoreByHarmGrade null; D is in the production bucket
		// for grouping purposes but contributes no harm-grade datapoint.
		// Production rows: B, C, D, E, F (5 total) → 4 with a non-null harm.
		const harmByEnv = numericStatsByField(SAMPLE, 'environment', 'scoreByHarmGrade');
		expect(harmByEnv.production.count).toBe(4); // B, C, E, F (D excluded)
	});

	it('numericStatsByField returns an empty bucket when nothing is numeric', () => {
		const empty = numericStatsByField([], 'environment', 'scoreByHarmGrade');
		expect(empty).toEqual({});
	});

	it('numericStatsByField copes with severity by environment', () => {
		const sevByEnv = numericStatsByField(SAMPLE, 'environment', 'scoreBySeverityOfImpact');
		expect(sevByEnv.production.max).toBe(5);
		expect(sevByEnv.production.min).toBe(1);
		expect(sevByEnv.production.count).toBe(5);
	});
});

describe('trends — top N', () => {
	it('topNByField sorts by count descending and breaks ties by key', () => {
		expect(topNByField(SAMPLE, 'systemName', 3)).toEqual([
			{ key: 'orders-db', count: 2 },
			{ key: 'auth-service', count: 1 },
			{ key: 'marketing-site', count: 1 },
		]);
	});

	it('topNByField clamps n at zero when negative', () => {
		expect(topNByField(SAMPLE, 'systemName', -1)).toEqual([]);
	});

	it('topNByField returns the full sorted list when n exceeds row count', () => {
		expect(topNByField(SAMPLE, 'compositePriority', 99)).toEqual([
			{ key: 'critical', count: 2 },
			{ key: 'high', count: 2 },
			{ key: 'low', count: 1 },
			{ key: 'moderate', count: 1 },
		]);
	});
});
