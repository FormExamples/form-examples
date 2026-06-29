import type { Band, FiredRule, RawScores } from './types';

// Severity of impact 1-5 (Saffir-Simpson hurricane analogue).
// 1 → low, 2 → low, 3 → moderate, 4 → high, 5 → critical.
const SEVERITY_LABELS: Record<number, string> = {
	1: 'minimal impact',
	2: 'minor impact',
	3: 'moderate impact',
	4: 'major impact',
	5: 'catastrophic impact',
};

export function gradeSeverity(scores: RawScores): { band: Band; firedRules: FiredRule[] } {
	const sev = scores.scoreBySeverityOfImpact;
	if (sev === null) return { band: 'low', firedRules: [] };

	let band: Band;
	if (sev >= 5) band = 'critical';
	else if (sev === 4) band = 'high';
	else if (sev === 3) band = 'moderate';
	else band = 'low';

	return {
		band,
		firedRules: [
			{
				ruleId: `R-SEVERITY-${sev}`,
				instrument: 'severity',
				grade: String(sev),
				category: 'impact',
				description: `Severity of impact ${sev} — ${SEVERITY_LABELS[sev]}.`,
				band,
			},
		],
	};
}
