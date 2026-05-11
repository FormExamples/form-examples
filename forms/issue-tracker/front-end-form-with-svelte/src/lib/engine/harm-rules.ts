import type { Band, FiredRule, RawScores } from './types';

// NHS LFPSE harm grade 0-4.
// 0 → low, 1 → moderate, 2 → high, 3-4 → critical.
const HARM_LABELS: Record<number, string> = {
	0: 'no harm',
	1: 'low harm',
	2: 'moderate harm',
	3: 'severe harm',
	4: 'fatal',
};

export function gradeHarm(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const harm = scores.scoreByHarmGrade;
	if (harm === null) return { band: 'low', firedRules: [] };

	let band: Band;
	if (harm >= 3) band = 'critical';
	else if (harm === 2) band = 'high';
	else if (harm === 1) band = 'moderate';
	else band = 'low';

	return {
		band,
		firedRules: [
			{
				ruleId: `R-HARM-${harm}`,
				instrument: 'harm',
				grade: String(harm),
				category: 'patient-safety',
				description: `NHS LFPSE harm grade ${harm} — ${HARM_LABELS[harm]}.`,
				band,
			},
		],
	};
}
