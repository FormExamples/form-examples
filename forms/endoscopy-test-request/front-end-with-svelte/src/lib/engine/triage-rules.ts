import type { EndoscopyRequest, TriageTier, FiredRule } from './types';

// ----------------------------------------------------------------------
// Axis B — Cancer-pathway urgency / triage tier (NICE NG12 / DG56)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer (2WW) criteria and acute red-flags escalate it. The
// most-severe escalation wins. Two-week-wait eligibility and rationale are
// reported alongside the tier. Rule IDs are stable (R-URGENCY-*).

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6 weeks',
	urgent: 'Within 2 weeks',
	'two-week-wait': '<= 14 days (2WW)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

// Emergency escalation: acute GI bleeding is treated as an acute red-flag.
const EMERGENCY_RULES: Array<{
	ruleId: string;
	fires: (d: EndoscopyRequest) => boolean;
	description: string;
}> = [
	{
		ruleId: 'R-URGENCY-ACUTE-GI-BLEED',
		fires: (d) =>
			d.redFlags.redFlagGiBleeding === true &&
			d.request.primaryIndication === 'upper-gi-bleeding',
		description: 'Active upper-GI bleeding — emergency assessment and admission.'
	}
];

// NICE NG12 / DG56 two-week-wait suspected-cancer criteria.
const TWO_WEEK_WAIT_RULES: Array<{
	ruleId: string;
	fires: (d: EndoscopyRequest) => boolean;
	rationale: string;
}> = [
	{
		ruleId: 'R-URGENCY-2WW-DYSPHAGIA',
		fires: (d) => d.redFlags.redFlagDysphagia === true,
		rationale: 'Dysphagia at any age (NICE NG12) — offer urgent upper-GI endoscopy.'
	},
	{
		ruleId: 'R-URGENCY-2WW-AGE-WEIGHT-LOSS',
		fires: (d) => d.redFlags.redFlagAgeOver55 === true && d.redFlags.redFlagWeightLoss === true,
		rationale:
			'Age >= 55 with weight loss plus upper-GI symptoms (NICE NG12) — urgent endoscopy.'
	},
	{
		ruleId: 'R-URGENCY-2WW-SUSPECTED-MALIGNANCY',
		fires: (d) => d.request.primaryIndication === 'suspected-malignancy',
		rationale: 'Suspected GI malignancy — suspected-cancer two-week-wait pathway.'
	},
	{
		ruleId: 'R-URGENCY-2WW-POSITIVE-FIT',
		fires: (d) =>
			d.request.primaryIndication === 'positive-fit' ||
			(typeof d.redFlags.fitResultUgG === 'number' && d.redFlags.fitResultUgG >= 10),
		rationale: 'FIT >= 10 ug Hb/g (NICE DG56) — colorectal-cancer two-week-wait pathway.'
	},
	{
		ruleId: 'R-URGENCY-2WW-ABDOMINAL-MASS',
		fires: (d) => d.redFlags.redFlagAbdominalMass === true,
		rationale: 'Palpable abdominal / epigastric mass (NICE NG12) — suspected-cancer pathway.'
	}
];

/**
 * Axis B — cancer-pathway urgency / triage tier.
 *
 * Compute the triage tier, target timeframe, two-week-wait eligibility and
 * rationale, and the fired urgency rules.
 */
export function gradeTriage(r: EndoscopyRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];
	let twoWeekWaitEligible = false;
	const rationales: string[] = [];

	for (const rule of EMERGENCY_RULES) {
		if (rule.fires(r)) {
			tier = maxTier(tier, 'emergency');
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'urgency',
				category: 'acute-red-flag',
				description: rule.description
			});
		}
	}

	for (const rule of TWO_WEEK_WAIT_RULES) {
		if (rule.fires(r)) {
			twoWeekWaitEligible = true;
			tier = maxTier(tier, 'two-week-wait');
			rationales.push(rule.rationale);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'urgency',
				category: 'two-week-wait',
				description: rule.rationale
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No suspected-cancer or acute criteria; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		triageTier: tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		twoWeekWaitEligible,
		twoWeekWaitRationale: rationales.join(' '),
		firedRules
	};
}

export { TRIAGE_ORDER, TARGET_TIMEFRAMES };
