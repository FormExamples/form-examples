import { describe, expect, it } from 'vitest';
import { gradeImpact } from './impact-rules';

describe('gradeImpact', () => {
	it('tier 5 → green', () => { expect(gradeImpact(5)[0]).toBe('green'); });
	it('tier 1 → green (informational only)', () => { expect(gradeImpact(1)[0]).toBe('green'); });
	it('null → green', () => { expect(gradeImpact(null)[0]).toBe('green'); });
});
