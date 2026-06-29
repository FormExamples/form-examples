import type { FiredRule, RagBand } from './types';

export function gradePace(deviation: number | null): [RagBand, FiredRule[]] {
	if (deviation === null) {
		return ['amber', [{ ruleId: 'R-PACE-MISSING', instrument: 'pace', grade: 'amber', category: 'pace', description: 'Pace deviation missing — amber.' }]];
	}
	const band: RagBand = deviation >= -10 ? 'green' : deviation <= -50 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-PACE-${band.toUpperCase()}`, instrument: 'pace', grade: band, category: 'pace', description: `Pace deviation ${deviation}% → ${band}.` }]];
}
