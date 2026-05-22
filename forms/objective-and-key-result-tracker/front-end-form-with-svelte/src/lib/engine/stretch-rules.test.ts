import { describe, expect, it } from 'vitest';
import { gradeStretch } from './stretch-rules';

describe('gradeStretch', () => {
	it('committed (1) → green with documented rule', () => {
		const [band, rules] = gradeStretch(1);
		expect(band).toBe('green');
		expect(rules[0].ruleId).toBe('R-STRETCH-COMMITTED');
	});
	it('moonshot (3) → green with documented rule', () => {
		const [band, rules] = gradeStretch(3);
		expect(band).toBe('green');
		expect(rules[0].ruleId).toBe('R-STRETCH-MOONSHOT');
	});
});
