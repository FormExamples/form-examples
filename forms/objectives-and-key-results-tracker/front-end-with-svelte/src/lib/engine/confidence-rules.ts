import type { FiredRule, RagBand } from './types';

export function gradeConfidence(decile: number | null): [RagBand, FiredRule[]] {
	if (decile === null) {
		return ['amber', [{ ruleId: 'R-CONFIDENCE-MISSING', instrument: 'confidence', grade: 'amber', category: 'confidence', description: 'Confidence missing — amber.' }]];
	}
	const band: RagBand = decile >= 7 ? 'green' : decile <= 3 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-CONFIDENCE-${band.toUpperCase()}`, instrument: 'confidence', grade: band, category: 'confidence', description: `Confidence ${decile}/10 → ${band}.` }]];
}
