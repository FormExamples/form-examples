import { describe, expect, it } from 'vitest';
import { bandToRecommendation, RECOMMENDATION_COPY } from './recommendation';

describe('bandToRecommendation', () => {
	it('maps low → do-not-hire-yet', () => {
		expect(bandToRecommendation('low')).toBe('do-not-hire-yet');
	});
	it('maps borderline → do-homework-first', () => {
		expect(bandToRecommendation('borderline')).toBe('do-homework-first');
	});
	it('maps medium → do-homework-first', () => {
		expect(bandToRecommendation('medium')).toBe('do-homework-first');
	});
	it('maps high → trial-engagement', () => {
		expect(bandToRecommendation('high')).toBe('trial-engagement');
	});
});

describe('RECOMMENDATION_COPY', () => {
	it('has a non-empty copy string for every band', () => {
		for (const band of ['low', 'borderline', 'medium', 'high'] as const) {
			expect(RECOMMENDATION_COPY[band]).toBeTypeOf('string');
			expect(RECOMMENDATION_COPY[band].length).toBeGreaterThan(0);
		}
	});
});
