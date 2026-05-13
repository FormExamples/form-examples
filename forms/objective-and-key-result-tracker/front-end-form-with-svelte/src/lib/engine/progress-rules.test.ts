import { describe, expect, it } from 'vitest';
import { gradeProgress } from './progress-rules';
import type { RawScores, StretchTier } from './types';

const base = (over: Partial<RawScores>): RawScores => ({
	progressPercent: 70, confidenceDecile: 7, stretchTier: 1,
	alignmentGrade: 4, impactTier: 4, smartQuality: 4,
	paceDeviationPercent: 0,
	...over,
});

describe('gradeProgress', () => {
	it('committed at 80% → green', () => {
		const [band, _rules] = gradeProgress(base({ progressPercent: 80, stretchTier: 1 }));
		expect(band).toBe('green');
	});
	it('committed at 50% → amber', () => {
		const [band] = gradeProgress(base({ progressPercent: 50, stretchTier: 1 }));
		expect(band).toBe('amber');
	});
	it('committed at 20% → red', () => {
		const [band] = gradeProgress(base({ progressPercent: 20, stretchTier: 1 }));
		expect(band).toBe('red');
	});
	it('aspirational at 35% → green (lower threshold)', () => {
		const [band] = gradeProgress(base({ progressPercent: 35, stretchTier: 2 }));
		expect(band).toBe('green');
	});
	it('moonshot at 15% → amber (very lenient)', () => {
		const [band] = gradeProgress(base({ progressPercent: 15, stretchTier: 3 as StretchTier }));
		expect(band).toBe('amber');
	});
	it('null progress → amber', () => {
		const [band] = gradeProgress(base({ progressPercent: null }));
		expect(band).toBe('amber');
	});
});
