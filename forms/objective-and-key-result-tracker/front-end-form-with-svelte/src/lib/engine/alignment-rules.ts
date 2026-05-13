import type { FiredRule, RagBand } from './types';

export function gradeAlignment(grade: number | null): [RagBand, FiredRule[]] {
	if (grade === null) {
		return ['amber', [{ ruleId: 'R-ALIGNMENT-MISSING', instrument: 'alignment', grade: 'amber', category: 'alignment', description: 'Alignment missing — amber.' }]];
	}
	const band: RagBand = grade >= 4 ? 'green' : grade <= 2 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-ALIGNMENT-${band.toUpperCase()}`, instrument: 'alignment', grade: band, category: 'alignment', description: `Alignment ${grade}/5 → ${band}.` }]];
}
