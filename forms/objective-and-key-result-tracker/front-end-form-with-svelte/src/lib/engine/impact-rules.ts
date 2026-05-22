import type { FiredRule, RagBand } from './types';

export function gradeImpact(tier: number | null): [RagBand, FiredRule[]] {
	const value = tier ?? 0;
	return [
		'green',
		[{ ruleId: `R-IMPACT-T${value}`, instrument: 'impact', grade: 'green', category: 'impact', description: `Impact tier ${value}/5 (informational).` }],
	];
}
