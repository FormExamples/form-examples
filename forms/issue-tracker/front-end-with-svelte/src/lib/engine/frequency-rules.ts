import type { Band, FiredRule, RawScores } from './types';

// Frequency of occurrence as a percentage of usage affected.
// < 5  → low, 5-25 → moderate, 25-75 → high, ≥ 75 → critical.
export function gradeFrequency(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const f = scores.scoreByFrequencyPercent;
	if (f === null) return { band: 'low', firedRules: [] };

	let band: Band;
	if (f >= 75) band = 'critical';
	else if (f >= 25) band = 'high';
	else if (f >= 5) band = 'moderate';
	else band = 'low';

	const pct = Number.isInteger(f) ? `${f}%` : `${f.toFixed(2)}%`;

	return {
		band,
		firedRules: [
			{
				ruleId: `R-FREQUENCY-${Math.round(f)}`,
				instrument: 'frequency',
				grade: pct,
				category: 'reach',
				description: `Frequency of occurrence ${pct} of usage affected.`,
				band,
			},
		],
	};
}
