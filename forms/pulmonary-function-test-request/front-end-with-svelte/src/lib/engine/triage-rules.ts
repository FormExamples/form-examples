import type { PulmonaryFunctionTestRequest, TriageTier, FiredRule } from './types';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 1-2 weeks'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (r: PulmonaryFunctionTestRequest) => boolean;
	description: string;
}

// Escalation rules, each forcing at least the given tier. The most-severe
// escalation wins; the referrer's requested urgency provides the base tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-HAEMOPTYSIS',
		tier: 'urgent',
		fires: (r) => r.safety.haemoptysis === true,
		description: 'Haemoptysis — expedite investigation; urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-PRE-OPERATIVE',
		tier: 'urgent',
		fires: (r) => r.request.primaryIndication === 'pre-operative',
		description: 'Pre-operative indication — expedite to avoid delaying surgery.'
	}
];

/**
 * Axis D — triage priority (routine / urgent), plus the target timeframe. A
 * base tier is taken from the requested urgency; escalation rules can raise it.
 */
export function gradeTriage(r: PulmonaryFunctionTestRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(r)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'escalation',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		triageTier: tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
