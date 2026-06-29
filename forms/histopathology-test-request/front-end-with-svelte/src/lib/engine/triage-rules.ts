import type { HistopathologyRequest, TriageTier, FiredRule } from './types';

/**
 * Axis D — urgency triage (NICE NG12 / frozen-section escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. The most-severe escalation wins. A 2WW (suspected-cancer)
 * request escalates to two-week-wait; an urgent frozen section escalates to
 * the two-week-wait tier with an immediate target timeframe.
 */
export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 7-10 working days',
	urgent: 'Within 3-5 working days',
	'two-week-wait': 'Within the 2-week-wait cancer pathway'
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
	immediate?: boolean;
	fires: (d: HistopathologyRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-URGENCY-FROZEN-SECTION',
		tier: 'two-week-wait',
		immediate: true,
		fires: (d) =>
			d.urgency.urgentFrozenSection === true || d.specimen.specimenType === 'frozen-section',
		description: 'Intra-operative urgent frozen section — immediate diagnosis required.'
	},
	{
		ruleId: 'R-URGENCY-TWO-WEEK-WAIT',
		tier: 'two-week-wait',
		fires: (d) =>
			d.urgency.twoWeekWait === true ||
			d.indication.primaryIndication === 'suspected-malignancy',
		description: 'Suspected-cancer two-week-wait pathway — expedite reporting.'
	},
	{
		ruleId: 'R-URGENCY-CANCER-STAGING',
		tier: 'urgent',
		fires: (d) => d.indication.primaryIndication === 'cancer-staging',
		description: 'Cancer-staging resection — prioritise reporting for MDT.'
	}
];

/**
 * Compute the triage tier, target timeframe, immediate flag, and fired triage
 * rules.
 */
export function scoreTriage(data: HistopathologyRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	immediate: boolean;
	firedRules: FiredRule[];
} {
	const requested = data.urgency.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	let immediate = false;
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(data)) {
			tier = maxTier(tier, rule.tier);
			if (rule.immediate) immediate = true;
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
			description: `No escalation; triage follows the requested urgency (${tier}).`
		});
	}

	const targetTimeframe = immediate
		? 'Immediate (intra-operative)'
		: TARGET_TIMEFRAMES[tier] || '';

	return { tier, targetTimeframe, immediate, firedRules };
}
