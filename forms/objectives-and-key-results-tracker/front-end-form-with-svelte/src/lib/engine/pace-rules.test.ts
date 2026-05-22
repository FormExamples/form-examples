import { describe, expect, it } from 'vitest';
import { gradePace } from './pace-rules';

describe('gradePace', () => {
	it('on track (0%) → green', () => {
		expect(gradePace(0)[0]).toBe('green');
	});
	it('-9% → green (within tolerance)', () => {
		expect(gradePace(-9)[0]).toBe('green');
	});
	it('-25% → amber', () => {
		expect(gradePace(-25)[0]).toBe('amber');
	});
	it('-60% → red', () => {
		expect(gradePace(-60)[0]).toBe('red');
	});
	it('+30% (ahead) → green', () => {
		expect(gradePace(30)[0]).toBe('green');
	});
	it('null → amber', () => {
		expect(gradePace(null)[0]).toBe('amber');
	});
});
