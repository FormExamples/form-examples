import { describe, expect, it } from 'vitest';
import { gradeConfidence } from './confidence-rules';

describe('gradeConfidence', () => {
	it('decile 9 → green', () => {
		const [band] = gradeConfidence(9);
		expect(band).toBe('green');
	});
	it('decile 5 → amber', () => {
		const [band] = gradeConfidence(5);
		expect(band).toBe('amber');
	});
	it('decile 2 → red', () => {
		const [band] = gradeConfidence(2);
		expect(band).toBe('red');
	});
	it('null → amber', () => {
		const [band] = gradeConfidence(null);
		expect(band).toBe('amber');
	});
});
