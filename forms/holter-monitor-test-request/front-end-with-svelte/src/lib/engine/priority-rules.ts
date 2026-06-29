import type { HolterRequest, PriorityBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Clinical priority (acuity banding)
// ──────────────────────────────────────────────
//
// An acuity score is accumulated from symptoms and cardiac context, then banded
// low / moderate / high. Orthogonal to triage: a low-acuity request can still
// be urgent if the referrer requested it, and vice versa.

interface PriorityRule {
	ruleId: string;
	points: number;
	fires: (d: HolterRequest) => boolean;
	description: string;
}

const PRIORITY_RULES: PriorityRule[] = [
	{
		ruleId: 'R-PRIORITY-SYNCOPE',
		points: 3,
		fires: (d) => d.symptoms.syncope === true,
		description: 'Syncope is a high-acuity presentation.'
	},
	{
		ruleId: 'R-PRIORITY-SUSPECTED-VT',
		points: 3,
		fires: (d) => d.cardiac.knownArrhythmia === 'vt',
		description: 'Ventricular tachycardia is a high-acuity arrhythmia.'
	},
	{
		ruleId: 'R-PRIORITY-PRESYNCOPE',
		points: 2,
		fires: (d) => d.symptoms.presyncope === true,
		description: 'Presyncope raises clinical acuity.'
	},
	{
		ruleId: 'R-PRIORITY-POST-STROKE',
		points: 2,
		fires: (d) => d.cardiac.recentStrokeTia === true,
		description: 'Recent stroke / TIA raises clinical acuity.'
	},
	{
		ruleId: 'R-PRIORITY-HEART-BLOCK',
		points: 2,
		fires: (d) => d.cardiac.knownArrhythmia === 'heart-block',
		description: 'Heart block raises clinical acuity.'
	},
	{
		ruleId: 'R-PRIORITY-KNOWN-AF',
		points: 1,
		fires: (d) => d.cardiac.knownArrhythmia === 'atrial-fibrillation',
		description: 'Known atrial fibrillation.'
	},
	{
		ruleId: 'R-PRIORITY-KNOWN-SVT',
		points: 1,
		fires: (d) => d.cardiac.knownArrhythmia === 'svt',
		description: 'Known supraventricular tachycardia.'
	},
	{
		ruleId: 'R-PRIORITY-BREATHLESSNESS',
		points: 1,
		fires: (d) => d.symptoms.breathlessness === true,
		description: 'Breathlessness raises clinical acuity.'
	},
	{
		ruleId: 'R-PRIORITY-PALPITATIONS',
		points: 1,
		fires: (d) => d.symptoms.palpitations === true,
		description: 'Palpitations recorded.'
	}
];

/**
 * Axis D — compute the clinical-priority band and fired priority rules.
 */
export function scorePriority(data: HolterRequest): {
	band: PriorityBand;
	score: number;
	firedRules: FiredRule[];
} {
	let score = 0;
	const firedRules: FiredRule[] = [];
	for (const rule of PRIORITY_RULES) {
		if (rule.fires(data)) {
			score += rule.points;
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'priority',
				category: 'acuity',
				description: rule.description
			});
		}
	}

	let band: PriorityBand = 'low';
	if (score >= 4) band = 'high';
	else if (score >= 2) band = 'moderate';

	firedRules.push({
		ruleId: `R-PRIORITY-BAND-${band.toUpperCase()}`,
		axis: 'priority',
		category: 'band',
		description: `Acuity score ${score} maps to ${band} clinical priority.`
	});

	return { band, score, firedRules };
}
