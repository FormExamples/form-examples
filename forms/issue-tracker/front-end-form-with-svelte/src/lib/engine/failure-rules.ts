import type { Band, FailureCondition, FiredRule, RawScores } from './types';

// FAA / EASA failure condition.
// A (catastrophic) → critical, B (hazardous) → high,
// C (major) → moderate, D (minor) → low, E (no effect) → low.
const FAILURE_DESCRIPTIONS: Record<Exclude<FailureCondition, ''>, string> = {
	A: 'catastrophic — multiple fatalities, loss of system',
	B: 'hazardous — large negative impact on safety or performance',
	C: 'major — significant reduction in safety margin or workload increase',
	D: 'minor — slight reduction in safety margin',
	E: 'no effect',
};

const FAILURE_BAND: Record<Exclude<FailureCondition, ''>, Band> = {
	A: 'critical',
	B: 'high',
	C: 'moderate',
	D: 'low',
	E: 'low',
};

export function gradeFailure(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const cond = scores.scoreByFailureCondition;
	if (!cond) return { band: 'low', firedRules: [] };

	const band = FAILURE_BAND[cond];

	return {
		band,
		firedRules: [
			{
				ruleId: `R-FAILURE-${cond}`,
				instrument: 'failure',
				grade: cond,
				category: 'system-safety',
				description: `Failure condition ${cond} — ${FAILURE_DESCRIPTIONS[cond]}.`,
				band,
			},
		],
	};
}
