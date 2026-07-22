import { describe, expect, it } from 'vitest';
import { computeEq5d } from './eq5d-rules';
import type { Eq5dResponse } from './types';

function emptyEq5d(): Eq5dResponse {
	return {
		mobility: null,
		selfCare: null,
		usualActivities: null,
		painDiscomfort: null,
		anxietyDepression: null,
		vasScore: null
	};
}

describe('computeEq5d', () => {
	it('scores the "11111" full-health state at exactly index 1.0', () => {
		const data: Eq5dResponse = {
			mobility: 1,
			selfCare: 1,
			usualActivities: 1,
			painDiscomfort: 1,
			anxietyDepression: 1,
			vasScore: 100
		};
		const result = computeEq5d(data);
		expect(result.healthStateDescriptor).toBe('11111');
		expect(result.ukIndexValue).toBe(1.0);
		expect(result.vasScore).toBe(100);
	});

	it('scores the "33333" worst-imaginable state at index approximately -0.594', () => {
		const data: Eq5dResponse = {
			mobility: 3,
			selfCare: 3,
			usualActivities: 3,
			painDiscomfort: 3,
			anxietyDepression: 3,
			vasScore: 0
		};
		const result = computeEq5d(data);
		expect(result.healthStateDescriptor).toBe('33333');
		expect(result.ukIndexValue).not.toBeNull();
		expect(Math.abs((result.ukIndexValue as number) - -0.594)).toBeLessThan(1e-9);
	});

	it('applies the correct level-2 coefficient with no N3 term for a single non-worst deviation', () => {
		// "21111": only mobility at level 2. index = 1 - 0.081 (constant) - 0.069 (mobility L2).
		const data: Eq5dResponse = {
			mobility: 2,
			selfCare: 1,
			usualActivities: 1,
			painDiscomfort: 1,
			anxietyDepression: 1,
			vasScore: 70
		};
		const result = computeEq5d(data);
		expect(result.healthStateDescriptor).toBe('21111');
		expect(result.ukIndexValue).not.toBeNull();
		expect(Math.abs((result.ukIndexValue as number) - 0.85)).toBeLessThan(1e-9);
	});

	it('applies the correct level-3 coefficient plus the N3 term for a single worst-level dimension', () => {
		// "11113": only anxietyDepression at level 3.
		// index = 1 - 0.081 (constant) - 0.236 (anxietyDepression L3) - 0.269 (N3 term) = 0.414.
		const data: Eq5dResponse = {
			mobility: 1,
			selfCare: 1,
			usualActivities: 1,
			painDiscomfort: 1,
			anxietyDepression: 3,
			vasScore: 40
		};
		const result = computeEq5d(data);
		expect(result.healthStateDescriptor).toBe('11113');
		expect(result.ukIndexValue).not.toBeNull();
		expect(Math.abs((result.ukIndexValue as number) - 0.414)).toBeLessThan(1e-9);
	});

	it('returns an empty descriptor and null index when any dimension is unanswered', () => {
		const data = emptyEq5d();
		data.mobility = 1;
		data.selfCare = 1;
		data.usualActivities = 1;
		data.painDiscomfort = 1;
		// anxietyDepression left unanswered.
		const result = computeEq5d(data);
		expect(result.healthStateDescriptor).toBe('');
		expect(result.ukIndexValue).toBeNull();
	});

	it('passes the VAS score through unchanged, independent of the index calculation', () => {
		const result = computeEq5d({ ...emptyEq5d(), vasScore: 55 });
		expect(result.vasScore).toBe(55);
		expect(result.ukIndexValue).toBeNull();
	});
});
