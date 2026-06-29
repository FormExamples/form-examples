import type { EyeVisionRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis B — Urgency / triage tier (RCOphth acute-eye escalation rules)
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. Sudden visual loss, retinal-detachment symptoms (flashes /
// floaters), acute painful red eye, and suspected giant cell arteritis all
// force an emergency tier. The most-severe escalation wins.
// ──────────────────────────────────────────────

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

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: EyeVisionRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SUDDEN-VISUAL-LOSS',
		tier: 'emergency',
		fires: (d) =>
			d.symptoms.suddenLoss === true || d.request.primaryIndication === 'sudden-visual-loss',
		description: 'Sudden visual loss — same-day emergency eye assessment.'
	},
	{
		ruleId: 'R-TRIAGE-RETINAL-DETACHMENT',
		tier: 'emergency',
		fires: (d) =>
			d.symptoms.flashesFloaters === true || d.request.primaryIndication === 'flashes-floaters',
		description:
			'Flashes / floaters — retinal-detachment symptoms require emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-ACUTE-PAINFUL-RED-EYE',
		tier: 'emergency',
		fires: (d) => d.symptoms.eyePain === true && d.symptoms.redEye === true,
		description:
			'Acute painful red eye — emergency assessment (exclude angle-closure / keratitis / uveitis).'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-GCA',
		tier: 'emergency',
		fires: (d) =>
			d.request.primaryIndication === 'headache-visual-symptoms' && d.symptoms.suddenLoss === true,
		description: 'Suspected giant cell arteritis — emergency assessment and urgent bloods.'
	},
	{
		ruleId: 'R-TRIAGE-RED-EYE',
		tier: 'urgent',
		fires: (d) => d.symptoms.redEye === true && d.symptoms.eyePain !== true,
		description: 'Red eye without pain — urgent assessment.'
	},
	{
		ruleId: 'R-TRIAGE-REDUCED-VISION',
		tier: 'urgent',
		fires: (d) => d.symptoms.reducedVision === true,
		description: 'Reduced vision reported — urgent assessment.'
	}
];

/**
 * Axis B — compute the triage tier, target timeframe, and fired triage rules.
 * Red flags auto-escalate regardless of the requested urgency; the requested
 * urgency can raise but never lower the computed tier.
 */
export function scoreTriage(data: EyeVisionRequest): {
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
				axis: 'urgency',
				category: 'red-flag',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No red flags; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
