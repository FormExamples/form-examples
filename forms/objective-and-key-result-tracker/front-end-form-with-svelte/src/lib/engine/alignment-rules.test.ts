import { describe, expect, it } from 'vitest';
import { gradeAlignment } from './alignment-rules';

describe('gradeAlignment', () => {
	it('grade 5 → green', () => {
		expect(gradeAlignment(5)[0]).toBe('green');
	});
	it('grade 3 → amber', () => {
		expect(gradeAlignment(3)[0]).toBe('amber');
	});
	it('grade 1 → red', () => {
		expect(gradeAlignment(1)[0]).toBe('red');
	});
	it('null → amber', () => {
		expect(gradeAlignment(null)[0]).toBe('amber');
	});
});
