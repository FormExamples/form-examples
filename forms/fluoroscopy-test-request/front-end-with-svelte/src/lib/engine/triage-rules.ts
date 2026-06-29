import type { FluoroscopyRequest, TriageTier, FiredRule } from './types';

/**
 * Axis D — triage priority (acuity escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then acuity
 * rules auto-escalate it. The most-severe escalation wins.
 */

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 24-72 hours',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: FluoroscopyRequest) => boolean;
	description: string;
}

// Acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-PERFORATION',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-perforation',
		description: 'Suspected perforation — emergency contrast study.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-OBSTRUCTION',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'suspected-obstruction',
		description: 'Suspected obstruction — urgent contrast study.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: FluoroscopyRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'acuity',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No acuity escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
