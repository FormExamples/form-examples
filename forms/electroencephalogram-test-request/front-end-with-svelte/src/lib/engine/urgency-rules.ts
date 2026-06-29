import type { EegRequest, TriageTier, FiredRule } from './types';

/**
 * Axis B — urgency (triage tier with red-flag escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. Suspected status epilepticus forces emergency. The
 * most-severe escalation wins; the referrer's requested urgency can raise but
 * the rules can only raise the tier further.
 */
const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 24-72 hours',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: EegRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-URGENCY-STATUS-EPILEPTICUS',
		tier: 'emergency',
		fires: (d) =>
			d.redFlags.suspectedStatusEpilepticus === true ||
			d.request.primaryIndication === 'status-epilepticus',
		description: 'Suspected status epilepticus — emergency EEG.'
	},
	{
		ruleId: 'R-URGENCY-ENCEPHALOPATHY',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'encephalopathy',
		description: 'Encephalopathy indication — urgent EEG to exclude non-convulsive status.'
	},
	{
		ruleId: 'R-URGENCY-RECENT-FIRST-SEIZURE',
		tier: 'urgent',
		fires: (d) =>
			d.redFlags.recentSeizure === true &&
			(d.context.firstSeizure === true || d.request.primaryIndication === 'first-seizure'),
		description: 'Recent first seizure — expedited first-seizure-clinic EEG.'
	}
];

/**
 * Compute the triage tier, target timeframe, and fired urgency rules.
 */
export function scoreUrgency(data: EegRequest): {
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
				axis: 'urgency',
				category: 'red-flag',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No red flags; urgency follows the requested tier (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
