import type { XRayRequest, TriageTier, FiredRule } from './types';

/**
 * Axis D — Triage priority (red-flag escalation).
 *
 * A base tier is taken from the clinician's requested urgency, then red flags
 * auto-escalate it. The most-severe escalation wins.
 */
export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
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

/** Red-flag escalation rules, each forcing at least the given tier. */
const TRIAGE_RULES: {
	ruleId: string;
	tier: TriageTier;
	fires: (d: XRayRequest) => boolean;
	description: string;
}[] = [
	{
		ruleId: 'R-TRIAGE-PNEUMOTHORAX',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-pneumothorax',
		description: 'Suspected pneumothorax — emergency chest radiograph.'
	},
	{
		ruleId: 'R-TRIAGE-LINE-CHECK',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'line-position-check',
		description: 'Line-position check — expedite before the line is used.'
	},
	{
		ruleId: 'R-TRIAGE-OBSTRUCTION',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'abdominal-obstruction',
		description: 'Suspected abdominal obstruction — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-SWALLOWED-OBJECT',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'swallowed-object',
		description: 'Swallowed object — urgent localisation.'
	},
	{
		ruleId: 'R-TRIAGE-TRAUMA',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'trauma-fracture' && d.practical.setting === 'emergency',
		description: 'Acute trauma in the emergency setting — urgent assessment.'
	}
];

/**
 * Compute the triage tier, target timeframe, and fired triage rules.
 */
export function scoreTriage(data: XRayRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
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
