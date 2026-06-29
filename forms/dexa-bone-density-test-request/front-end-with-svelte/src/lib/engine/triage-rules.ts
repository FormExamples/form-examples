import type { DexaRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Triage priority (high-acuity escalation)
//
// A base tier is taken from the clinician's requested urgency, then high-acuity
// factors auto-escalate it. The most-severe escalation wins.
// ──────────────────────────────────────────────

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6-12 weeks',
	urgent: 'Within 1-2 weeks'
};

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/** Whether the FRAX major-fracture probability is at or above a threshold. */
function fraxAtOrAbove(d: DexaRequest, threshold: number): boolean {
	const v = d.riskFactors.fraxMajorFracturePercent;
	if (v === null || v === undefined) return false;
	const n = Number(v);
	return !Number.isNaN(n) && n >= threshold;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: DexaRequest) => boolean;
	description: string;
}

// High-acuity escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-RECENT-FRAGILITY-FRACTURE',
		tier: 'urgent',
		fires: (d) => d.riskFactors.previousFragilityFracture === true,
		description: 'Recent fragility fracture — expedite bone-density assessment.'
	},
	{
		ruleId: 'R-TRIAGE-HIGH-FRAX',
		tier: 'urgent',
		fires: (d) => fraxAtOrAbove(d, 30),
		description: 'Very high FRAX major-fracture probability — expedite assessment.'
	},
	{
		ruleId: 'R-TRIAGE-LONG-TERM-STEROIDS',
		tier: 'urgent',
		fires: (d) => d.riskFactors.longTermSteroids === true,
		description: 'Long-term high-dose glucocorticoids — expedite assessment.'
	}
];

/**
 * Axis D — compute the triage tier, target timeframe, and fired triage rules.
 * The requested urgency can raise but never lower the computed tier.
 */
export function gradeTriage(d: DexaRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = d.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier) ? (requested as TriageTier) : 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(d)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'triage',
				category: 'high-acuity',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No high-acuity factors; triage follows the requested urgency (${tier}).`
		});
	}

	return { triageTier: tier, targetTimeframe: TARGET_TIMEFRAMES[tier] || '', firedRules };
}
