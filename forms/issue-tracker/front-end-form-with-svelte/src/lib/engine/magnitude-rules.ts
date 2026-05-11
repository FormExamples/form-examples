import type { Band, FiredRule, RawScores } from './types';

// Magnitude of damage 1-10 (Richter earthquake analogue).
// 1-2 → low, 3-5 → moderate, 6-8 → high, 9-10 → critical.
export function gradeMagnitude(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const mag = scores.scoreByMagnitudeOfDamage;
	if (mag === null) return { band: 'low', firedRules: [] };

	let band: Band;
	if (mag >= 9) band = 'critical';
	else if (mag >= 6) band = 'high';
	else if (mag >= 3) band = 'moderate';
	else band = 'low';

	return {
		band,
		firedRules: [
			{
				ruleId: `R-MAGNITUDE-${mag}`,
				instrument: 'magnitude',
				grade: String(mag),
				category: 'damage',
				description: `Magnitude of damage ${mag} on a 1-10 Richter-style scale.`,
				band,
			},
		],
	};
}
