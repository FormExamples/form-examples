import { describe, expect, it } from 'vitest';
import { gradeSmart } from './smart-rules';

describe('gradeSmart', () => {
	it('5/5 SMART → green', () => {
		expect(gradeSmart(5)[0]).toBe('green');
	});
	it('3/5 → amber', () => {
		expect(gradeSmart(3)[0]).toBe('amber');
	});
	it('1/5 → red', () => {
		expect(gradeSmart(1)[0]).toBe('red');
	});
	it('null → amber', () => {
		expect(gradeSmart(null)[0]).toBe('amber');
	});
});
