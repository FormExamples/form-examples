import type { PulmonaryFunctionTestRequest, ContraindicationBand, FiredRule } from './types';

const SAFETY_ORDER: ContraindicationBand[] = ['ok', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe (further from ok). */
function maxBand(a: ContraindicationBand, b: ContraindicationBand): ContraindicationBand {
	return SAFETY_ORDER.indexOf(a) >= SAFETY_ORDER.indexOf(b) ? a : b;
}

interface SafetyRule {
	ruleId: string;
	band: ContraindicationBand;
	fires: (r: PulmonaryFunctionTestRequest) => boolean;
	description: string;
}

// Forced-expiration and infection-control contraindications, each forcing at
// least the given band. The band starts at `ok` and is downgraded by the
// most-severe rule that fires.
const SAFETY_RULES: SafetyRule[] = [
	{
		ruleId: 'R-SAFETY-RECENT-MI-SURGERY',
		band: 'contraindicated',
		fires: (r) => r.safety.recentMiOrEyeAbdominalSurgery === true,
		description:
			'Recent myocardial infarction or recent eye / thoracic / abdominal surgery — forced expiration contraindicated.'
	},
	{
		ruleId: 'R-SAFETY-HAEMOPTYSIS',
		band: 'contraindicated',
		fires: (r) => r.safety.haemoptysis === true,
		description:
			'Haemoptysis of unknown origin — forced expiration contraindicated until investigated.'
	},
	{
		ruleId: 'R-SAFETY-SUSPECTED-TB',
		band: 'contraindicated',
		fires: (r) => r.safety.suspectedActiveTuberculosis === true,
		description:
			'Suspected active tuberculosis — infection-control contraindication for shared lung-function equipment.'
	},
	{
		ruleId: 'R-SAFETY-RESPIRATORY-INFECTION',
		band: 'caution',
		fires: (r) => r.safety.recentRespiratoryInfection === true,
		description:
			'Recent respiratory infection — defer for infection control and result validity (caution).'
	}
];

/**
 * Axis B — safety / contraindication. Compute the band and the fired safety
 * rules. The least-alarming band (ok) is chosen only when no rule fires.
 */
export function gradeSafety(r: PulmonaryFunctionTestRequest): {
	contraindicationBand: ContraindicationBand;
	firedRules: FiredRule[];
} {
	let band: ContraindicationBand = 'ok';
	const firedRules: FiredRule[] = [];

	for (const rule of SAFETY_RULES) {
		if (rule.fires(r)) {
			band = maxBand(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'safety',
				category: 'contraindication',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-CLEAR',
			axis: 'safety',
			category: 'contraindication',
			description: 'No forced-expiration or infection-control contraindication identified.'
		});
	}

	return { contraindicationBand: band, firedRules };
}
