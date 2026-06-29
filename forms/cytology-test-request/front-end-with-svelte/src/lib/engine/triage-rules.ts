import type { CytologyRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Triage priority (NICE NG12 suspected-cancer escalation)
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer indications and previous high-grade cytology auto-escalate
// it toward the two-week-wait pathway. The most-severe escalation wins. Rule
// IDs are stable across every front-end and the back-end.
// ──────────────────────────────────────────────

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 2-6 weeks',
	urgent: 'Within 1 week',
	'two-week-wait': 'Within 14 days (2-week-wait pathway)'
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
	fires: (d: CytologyRequest) => boolean;
	description: string;
}

// Escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-CANCER',
		tier: 'two-week-wait',
		fires: (d) => d.request.primaryIndication === 'suspected-malignancy',
		description: 'Suspected malignancy — NICE NG12 two-week-wait pathway.'
	},
	{
		ruleId: 'R-TRIAGE-PREVIOUS-HIGH-GRADE',
		tier: 'two-week-wait',
		fires: (d) => d.context.previousAbnormalCytology === 'high-grade',
		description: 'Previous high-grade cytology — expedite to two-week-wait pathway.'
	},
	{
		ruleId: 'R-TRIAGE-BREAST-LUMP',
		tier: 'two-week-wait',
		fires: (d) => d.request.primaryIndication === 'breast-lump',
		description: 'Breast lump — NICE NG12 suspected-cancer two-week-wait pathway.'
	},
	{
		ruleId: 'R-TRIAGE-HAEMATURIA',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'haematuria',
		description: 'Haematuria — expedite urothelial-malignancy investigation.'
	},
	{
		ruleId: 'R-TRIAGE-PREVIOUS-LOW-GRADE',
		tier: 'urgent',
		fires: (d) => d.context.previousAbnormalCytology === 'low-grade',
		description: 'Previous low-grade cytology — expedited follow-up.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: CytologyRequest): {
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
				category: 'escalation',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
