import type { EyeVisionRequest, PriorityBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Clinical priority (combined acuity + risk-factor weighting)
//
// A weighted points model: red flags push the score high; risk factors
// (diabetes, known glaucoma) and reduced vision add moderate weight. The band
// is derived from the accumulated points.
// ──────────────────────────────────────────────

interface PriorityRule {
	ruleId: string;
	points: number;
	fires: (d: EyeVisionRequest) => boolean;
	description: string;
}

const PRIORITY_RULES: PriorityRule[] = [
	{ ruleId: 'R-PRIORITY-SUDDEN-LOSS', points: 4, fires: (d) => d.symptoms.suddenLoss === true, description: 'Sudden visual loss raises clinical priority.' },
	{ ruleId: 'R-PRIORITY-FLASHES-FLOATERS', points: 4, fires: (d) => d.symptoms.flashesFloaters === true, description: 'Flashes / floaters raise clinical priority.' },
	{ ruleId: 'R-PRIORITY-PAINFUL-RED-EYE', points: 4, fires: (d) => d.symptoms.eyePain === true && d.symptoms.redEye === true, description: 'Acute painful red eye raises clinical priority.' },
	{ ruleId: 'R-PRIORITY-REDUCED-VISION', points: 2, fires: (d) => d.symptoms.reducedVision === true, description: 'Reduced vision raises clinical priority.' },
	{ ruleId: 'R-PRIORITY-RED-EYE', points: 1, fires: (d) => d.symptoms.redEye === true, description: 'Red eye adds to clinical priority.' },
	{ ruleId: 'R-PRIORITY-DIABETES', points: 1, fires: (d) => d.riskFactors.diabetes === true, description: 'Diabetes (retinopathy risk) adds to clinical priority.' },
	{ ruleId: 'R-PRIORITY-KNOWN-GLAUCOMA', points: 1, fires: (d) => d.riskFactors.knownGlaucoma === true, description: 'Known glaucoma adds to clinical priority.' }
];

/**
 * Axis D — compute the clinical-priority band (low / moderate / high) and the
 * fired priority rules.
 */
export function scorePriority(data: EyeVisionRequest): {
	band: PriorityBand;
	points: number;
	firedRules: FiredRule[];
} {
	let points = 0;
	const firedRules: FiredRule[] = [];
	for (const rule of PRIORITY_RULES) {
		if (rule.fires(data)) {
			points += rule.points;
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'priority',
				category: 'risk',
				description: rule.description
			});
		}
	}
	let band: PriorityBand;
	if (points >= 4) band = 'high';
	else if (points >= 2) band = 'moderate';
	else band = 'low';

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BASELINE',
			axis: 'priority',
			category: 'baseline',
			description: 'No additional risk factors; clinical priority is low.'
		});
	}
	return { band, points, firedRules };
}
