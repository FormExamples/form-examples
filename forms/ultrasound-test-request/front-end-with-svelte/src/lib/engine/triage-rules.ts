import type { FiredRule, TriageTier, UltrasoundRequest } from './types';

/**
 * Axis D — Triage priority (red-flag escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. The most-severe escalation wins.
 */

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 24-72 hours',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/** Red-flag escalation rules, each forcing at least the given tier. */
const TRIAGE_RULES: { ruleId: string; tier: TriageTier; fires: (d: UltrasoundRequest) => boolean; description: string }[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-TORSION',
		tier: 'emergency',
		fires: (d) => d.redFlags.suspectedTesticularTorsion === true,
		description: 'Suspected testicular torsion — emergency Doppler; surgical window is short.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-AAA',
		tier: 'emergency',
		fires: (d) => d.redFlags.suspectedAaa === true,
		description: 'Suspected abdominal aortic aneurysm — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-DVT',
		tier: 'urgent',
		fires: (d) => d.redFlags.suspectedDvt === true,
		description: 'Suspected DVT — urgent leg-vein Doppler.'
	}
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules. A red flag
 * auto-escalates the tier regardless of the requested urgency.
 */
export function scoreTriage(data: UltrasoundRequest): {
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
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}
