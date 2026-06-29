// ──────────────────────────────────────────────
// Axis D — Triage priority (suspected-cancer escalation)
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer patterns auto-escalate it. The most-severe escalation wins.
// Ported verbatim from the HTML front-end's js/rules.js.
// ──────────────────────────────────────────────

import type { FiredRule, TriageTier, TumorMarkerRequest } from './types';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 1 week',
	'two-week-wait': 'Within 14 days (suspected-cancer pathway)'
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
	fires: (d: TumorMarkerRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-REQUESTED-2WW',
		tier: 'two-week-wait',
		fires: (d) => d.triage.urgency === 'two-week-wait',
		description: 'Requested on the two-week-wait suspected-cancer pathway.'
	},
	{
		ruleId: 'R-TRIAGE-CA125-SUSPECTED-OVARIAN',
		tier: 'two-week-wait',
		fires: (d) => d.markers.ca125 === true && d.context.primaryIndication === 'suspected-malignancy',
		description: 'CA125 for suspected malignancy (possible ovarian cancer) — escalate to two-week-wait per NICE NG12.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-MALIGNANCY',
		tier: 'urgent',
		fires: (d) => d.context.primaryIndication === 'suspected-malignancy',
		description: 'Suspected-malignancy indication — expedite.'
	},
	{
		ruleId: 'R-TRIAGE-REQUESTED-URGENT',
		tier: 'urgent',
		fires: (d) => d.triage.urgency === 'urgent',
		description: 'Clinician requested urgent processing.'
	}
];

/** The result of scoring Axis D. */
export interface TriageResult {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: TumorMarkerRequest): TriageResult {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
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
