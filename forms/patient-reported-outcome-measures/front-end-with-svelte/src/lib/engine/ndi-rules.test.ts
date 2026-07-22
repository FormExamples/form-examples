import { describe, expect, it } from 'vitest';
import { computeNdi } from './ndi-rules';
import type { NdiResponse } from './types';

function emptyNdi(): NdiResponse {
	return {
		painIntensity: null,
		personalCare: null,
		lifting: null,
		reading: null,
		headache: null,
		concentration: null,
		work: null,
		driving: null,
		sleeping: null,
		recreation: null
	};
}

describe('computeNdi', () => {
	it('scores 100% / complete disability when every section is answered 5', () => {
		const data: NdiResponse = {
			painIntensity: 5,
			personalCare: 5,
			lifting: 5,
			reading: 5,
			headache: 5,
			concentration: 5,
			work: 5,
			driving: 5,
			sleeping: 5,
			recreation: 5
		};
		const result = computeNdi(data);
		expect(result.rawScore).toBe(50);
		expect(result.answeredSections).toBe(10);
		expect(result.percentageScore).toBe(100);
		expect(result.band).toBe('complete');
	});

	it('scores 0% / no-disability when every section is answered 0', () => {
		const data: NdiResponse = {
			painIntensity: 0,
			personalCare: 0,
			lifting: 0,
			reading: 0,
			headache: 0,
			concentration: 0,
			work: 0,
			driving: 0,
			sleeping: 0,
			recreation: 0
		};
		const result = computeNdi(data);
		expect(result.rawScore).toBe(0);
		expect(result.answeredSections).toBe(10);
		expect(result.percentageScore).toBe(0);
		expect(result.band).toBe('no-disability');
	});

	it('computes the missing-section-adjusted percentage for a partial (3 of 10) response', () => {
		const data = emptyNdi();
		data.painIntensity = 3;
		data.personalCare = 3;
		data.lifting = 3;
		const result = computeNdi(data);
		// rawScore = 9, answeredSections = 3 -> 9 / (5*3) * 100 = 60%
		expect(result.rawScore).toBe(9);
		expect(result.answeredSections).toBe(3);
		expect(result.percentageScore).toBe(60);
		expect(result.band).toBe('complete');
	});

	it('returns a null percentage and empty band when nothing is answered', () => {
		const result = computeNdi(emptyNdi());
		expect(result.rawScore).toBe(0);
		expect(result.answeredSections).toBe(0);
		expect(result.percentageScore).toBeNull();
		expect(result.band).toBe('');
	});

	it('reports the correct band at each threshold boundary', () => {
		// Each case picks an answered-section count and a raw-score split (all
		// values valid 0-5 section scores) that lands percentageScore exactly on
		// or just off a band boundary: percentageScore = rawScore / (5*n) * 100.
		const NDI_ALL: Array<keyof NdiResponse> = [
			'painIntensity',
			'personalCare',
			'lifting',
			'reading',
			'headache',
			'concentration',
			'work',
			'driving',
			'sleeping',
			'recreation'
		];
		function withSections(values: number[]): NdiResponse {
			const entries = NDI_ALL.map(
				(field, i) => [field, i < values.length ? values[i] : null] as const
			);
			return Object.fromEntries(entries) as unknown as NdiResponse;
		}

		expect(computeNdi(withSections([1, 0, 0, 0, 0])).percentageScore).toBeCloseTo(4, 9); // 1/25*100
		expect(computeNdi(withSections([1, 0, 0, 0, 0])).band).toBe('no-disability');

		expect(computeNdi(withSections([1, 0, 0, 0])).percentageScore).toBeCloseTo(5, 9); // 1/20*100
		expect(computeNdi(withSections([1, 0, 0, 0])).band).toBe('mild');

		expect(
			computeNdi(withSections([5, 2, 0, 0, 0, 0, 0, 0, 0, 0])).percentageScore
		).toBeCloseTo(14, 9); // 7/50*100
		expect(computeNdi(withSections([5, 2, 0, 0, 0, 0, 0, 0, 0, 0])).band).toBe('mild');

		expect(computeNdi(withSections([3, 0, 0, 0])).percentageScore).toBeCloseTo(15, 9); // 3/20*100
		expect(computeNdi(withSections([3, 0, 0, 0])).band).toBe('moderate');

		expect(
			computeNdi(withSections([5, 5, 2, 0, 0, 0, 0, 0, 0, 0])).percentageScore
		).toBeCloseTo(24, 9); // 12/50*100
		expect(computeNdi(withSections([5, 5, 2, 0, 0, 0, 0, 0, 0, 0])).band).toBe('moderate');

		expect(computeNdi(withSections([5, 0, 0, 0])).percentageScore).toBeCloseTo(25, 9); // 5/20*100
		expect(computeNdi(withSections([5, 0, 0, 0])).band).toBe('severe');

		expect(
			computeNdi(withSections([5, 5, 5, 2, 0, 0, 0, 0, 0, 0])).percentageScore
		).toBeCloseTo(34, 9); // 17/50*100
		expect(computeNdi(withSections([5, 5, 5, 2, 0, 0, 0, 0, 0, 0])).band).toBe('severe');

		expect(computeNdi(withSections([5, 2, 0, 0])).percentageScore).toBeCloseTo(35, 9); // 7/20*100
		expect(computeNdi(withSections([5, 2, 0, 0])).band).toBe('complete');
	});
});
