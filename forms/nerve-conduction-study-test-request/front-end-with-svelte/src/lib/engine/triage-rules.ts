import type { NerveConductionStudyRequest, TriageTier, FiredRule } from './types';

/**
 * Axis D — Triage priority (red-flag escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. Suspected motor neurone disease forces urgent because early
 * electrodiagnostic confirmation changes management. The most-severe escalation
 * wins. Rule IDs are stable across every front-end and the back-end.
 */

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6-12 weeks',
	urgent: 'Within 1-2 weeks'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (r: NerveConductionStudyRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-MND',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'suspected-motor-neurone-disease',
		description:
			'Suspected motor neurone disease — expedite for early electrodiagnostic confirmation.'
	},
	{
		ruleId: 'R-TRIAGE-RAPID-WEAKNESS',
		tier: 'urgent',
		fires: (d) =>
			d.symptoms.symptomWeakness === true && d.symptoms.symptomDuration === 'less-than-6-weeks',
		description: 'Rapidly progressive weakness (under 6 weeks) — expedite assessment.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function gradeTriage(r: NerveConductionStudyRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
		? (requested as TriageTier)
		: 'routine';
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
