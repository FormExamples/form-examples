import { describe, expect, it } from 'vitest';
import { scorecards } from './data';
import type { Band } from './types';

describe('sample scorecards', () => {
	it('contains exactly 12 rows', () => {
		expect(scorecards).toHaveLength(12);
	});

	it('every row has a unique id', () => {
		const ids = scorecards.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('covers all four readiness bands', () => {
		const bands = new Set(scorecards.map((r) => r.computedBand));
		const expected: Band[] = ['low', 'borderline', 'medium', 'high'];
		for (const band of expected) {
			expect(bands.has(band)).toBe(true);
		}
	});

	it('manifestoSubtotal is in 0..4', () => {
		for (const r of scorecards) {
			expect(r.manifestoSubtotal).toBeGreaterThanOrEqual(0);
			expect(r.manifestoSubtotal).toBeLessThanOrEqual(4);
		}
	});

	it('principlesSubtotal is in 0..12', () => {
		for (const r of scorecards) {
			expect(r.principlesSubtotal).toBeGreaterThanOrEqual(0);
			expect(r.principlesSubtotal).toBeLessThanOrEqual(12);
		}
	});

	it('scoreTotal is in 0..16 and equals the sum of subtotals', () => {
		for (const r of scorecards) {
			expect(r.scoreTotal).toBe(r.manifestoSubtotal + r.principlesSubtotal);
			expect(r.scoreTotal).toBeGreaterThanOrEqual(0);
			expect(r.scoreTotal).toBeLessThanOrEqual(16);
		}
	});

	it('computedBand is consistent with scoreTotal', () => {
		for (const r of scorecards) {
			const expectedBand: Band =
				r.scoreTotal <= 4 ? 'low'
				: r.scoreTotal === 5 ? 'borderline'
				: r.scoreTotal <= 10 ? 'medium'
				: 'high';
			expect(r.computedBand).toBe(expectedBand);
		}
	});

	it('every flag has a known category and priority', () => {
		const allowedCategories = new Set([
			'no-senior-leadership-buyin',
			'no-customer-contact',
			'no-working-software',
			'no-sustainable-budget',
			'no-self-organization',
			'no-reflection-culture',
		]);
		const allowedPriorities = new Set(['low', 'medium', 'high']);
		for (const r of scorecards) {
			for (const f of r.flags) {
				expect(allowedCategories.has(f.category)).toBe(true);
				expect(allowedPriorities.has(f.priority)).toBe(true);
			}
		}
	});
});
