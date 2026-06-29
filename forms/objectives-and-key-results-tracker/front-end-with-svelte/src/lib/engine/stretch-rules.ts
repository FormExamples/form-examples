import type { FiredRule, RagBand, StretchTier } from './types';

const NAMES: Record<StretchTier, string> = { 1: 'COMMITTED', 2: 'ASPIRATIONAL', 3: 'MOONSHOT' };

export function gradeStretch(tier: StretchTier | null): [RagBand, FiredRule[]] {
	const t = tier ?? 1;
	return [
		'green',
		[{ ruleId: `R-STRETCH-${NAMES[t]}`, instrument: 'stretch', grade: 'green', category: 'stretch', description: `Stretch tier: ${NAMES[t].toLowerCase()} (informational, modulates progress).` }],
	];
}
