import type { ToxicologyRequest, TriageTier, FiredRule } from './types';

/**
 * Axis D — triage priority, plus the target timeframe.
 *
 * A base tier is taken from the clinician's requested urgency, then context
 * rules auto-escalate it. A deliberate overdose or a symptomatic patient forces
 * stat. The most-severe escalation wins. The least-urgent band is chosen only
 * when no escalation rule fires.
 */
const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Routine laboratory turnaround',
	urgent: 'Within a few hours',
	stat: 'Immediate / stat — phone result'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (r: ToxicologyRequest) => boolean;
	description: string;
}

// Context escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-DELIBERATE-OVERDOSE',
		tier: 'stat',
		fires: (r) => r.clinical.deliberateOverdose === true,
		description: 'Deliberate overdose — stat handling.'
	},
	{
		ruleId: 'R-TRIAGE-SYMPTOMATIC',
		tier: 'stat',
		fires: (r) => r.clinical.symptomatic === true,
		description: 'Patient is symptomatic from the exposure — stat handling.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-OVERDOSE',
		tier: 'urgent',
		fires: (r) =>
			r.clinical.primaryIndication === 'suspected-overdose' ||
			r.clinical.primaryIndication === 'suspected-poisoning',
		description: 'Suspected overdose / poisoning indication — urgent handling.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(r: ToxicologyRequest): {
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
