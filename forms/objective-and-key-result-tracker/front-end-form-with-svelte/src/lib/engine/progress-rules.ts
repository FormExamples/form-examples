import type { FiredRule, RagBand, RawScores } from './types';

/**
 * Progress band, modulated by stretch tier.
 *  committed (1):    green ≥ 70, red < 30
 *  aspirational (2): green ≥ 30, red < 10
 *  moonshot (3):     green ≥ 25, red never (always amber if low)
 */
export function gradeProgress(s: RawScores): [RagBand, FiredRule[]] {
	const p = s.progressPercent;
	const tier = s.stretchTier ?? 1;
	if (p === null) {
		return [
			'amber',
			[{
				ruleId: 'R-PROGRESS-MISSING',
				instrument: 'progress',
				grade: 'amber',
				category: 'progress',
				description: 'Progress percent missing — defaulted to amber.',
			}],
		];
	}
	const thresholds = { 1: { green: 70, red: 30 }, 2: { green: 30, red: 10 }, 3: { green: 25, red: -1 } } as const;
	const t = thresholds[tier];
	const band: RagBand = p >= t.green ? 'green' : p < t.red ? 'red' : 'amber';
	return [
		band,
		[{
			ruleId: `R-PROGRESS-${band.toUpperCase()}-T${tier}`,
			instrument: 'progress',
			grade: band,
			category: 'progress',
			description: `Progress ${p}% on stretch tier ${tier} → ${band}.`,
		}],
	];
}
