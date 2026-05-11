import type { Band, FiredRule, RawScores } from './types';

// MoSCoW prioritisation 1-4.
// 1 (must have) → high (an unfulfilled "must" is high-priority by definition);
// 2 (should have) → moderate; 3 (could have) → low; 4 (won't have) → low.
const MOSCOW_LABELS: Record<number, string> = {
	1: 'must have',
	2: 'should have',
	3: 'could have',
	4: "won't have",
};

export function gradeMoscow(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const m = scores.scoreByMoscowRequirement;
	if (m === null) return { band: 'low', firedRules: [] };

	let band: Band;
	if (m === 1) band = 'high';
	else if (m === 2) band = 'moderate';
	else band = 'low';

	return {
		band,
		firedRules: [
			{
				ruleId: `R-MOSCOW-${m}`,
				instrument: 'moscow',
				grade: String(m),
				category: 'requirement',
				description: `MoSCoW classification ${m} — ${MOSCOW_LABELS[m]}.`,
				band,
			},
		],
	};
}
