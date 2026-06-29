import type { UrinalysisRequest, TriageTier, FiredRule } from './types';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'stat'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 5-7 working days',
	urgent: 'Within 24-48 hours',
	stat: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: { ruleId: string; tier: TriageTier; fires: (d: UrinalysisRequest) => boolean; description: string }[] = [
	{
		ruleId: 'R-TRIAGE-PYELONEPHRITIS',
		tier: 'stat',
		fires: (d) => d.symptoms.symptomFever === true && d.symptoms.symptomLoinPain === true,
		description: 'Fever with loin pain — possible pyelonephritis / urosepsis; immediate assessment.'
	},
	{
		ruleId: 'R-TRIAGE-VISIBLE-HAEMATURIA',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomVisibleHaematuria === true,
		description: 'Visible haematuria — expedite culture / cytology and assessment.'
	},
	{
		ruleId: 'R-TRIAGE-FEVER',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomFever === true,
		description: 'Fever / systemic symptoms — expedited assessment.'
	}
];

/**
 * Axis D — triage priority (red-flag escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. The most-severe escalation wins; the requested urgency can
 * raise but never lower the computed tier.
 */
export function gradeTriage(r: UrinalysisRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested) ? (requested as TriageTier) : 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(r)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'red-flag',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No red flags; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		triageTier: tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}
