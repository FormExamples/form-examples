import type { Band, FiredRule, RawScores } from './types';

// Priority rank: 1 = do first; lower number = more urgent.
// 1 → critical, 2 → high, 3 → moderate, 4+ → low.
export function gradePriority(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const rank = scores.scoreByPriorityRank;
	if (rank === null) {
		return { band: 'low', firedRules: [] };
	}
	let band: Band;
	if (rank <= 1) band = 'critical';
	else if (rank === 2) band = 'high';
	else if (rank === 3) band = 'moderate';
	else band = 'low';

	return {
		band,
		firedRules: [
			{
				ruleId: `R-PRIORITY-${rank}`,
				instrument: 'priority',
				grade: String(rank),
				category: 'workflow',
				description: `Priority rank ${rank}.`,
				band,
			},
		],
	};
}
