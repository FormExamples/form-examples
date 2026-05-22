import type { FiredRule, RagBand } from './types';

export function gradeSmart(quality: number | null): [RagBand, FiredRule[]] {
	if (quality === null) {
		return ['amber', [{ ruleId: 'R-SMART-MISSING', instrument: 'smart', grade: 'amber', category: 'smart', description: 'SMART quality missing — amber.' }]];
	}
	const band: RagBand = quality >= 4 ? 'green' : quality <= 1 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-SMART-${band.toUpperCase()}`, instrument: 'smart', grade: band, category: 'smart', description: `SMART ${quality}/5 → ${band}.` }]];
}
