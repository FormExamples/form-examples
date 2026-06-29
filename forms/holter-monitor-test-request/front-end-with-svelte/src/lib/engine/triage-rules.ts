import type { HolterRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis B — Urgency / triage (red-flag escalation)
// ──────────────────────────────────────────────
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 1-2 weeks',
	emergency: 'Same day / 24-48 hours'
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
	fires: (d: HolterRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-SYNCOPE',
		tier: 'emergency',
		fires: (d) => d.symptoms.syncope === true,
		description: 'Syncope — emergency / expedited ambulatory monitoring; consider admission.'
	},
	{
		ruleId: 'R-TRIAGE-SUSPECTED-VT',
		tier: 'emergency',
		fires: (d) => d.cardiac.knownArrhythmia === 'vt',
		description: 'Known / suspected ventricular tachycardia — emergency assessment.'
	},
	{
		ruleId: 'R-TRIAGE-POST-STROKE-AF',
		tier: 'urgent',
		fires: (d) =>
			d.cardiac.recentStrokeTia === true ||
			d.request.primaryIndication === 'post-stroke-af-screen',
		description: 'Recent stroke / TIA AF detection — urgent prolonged monitoring.'
	},
	{
		ruleId: 'R-TRIAGE-PRESYNCOPE',
		tier: 'urgent',
		fires: (d) => d.symptoms.presyncope === true,
		description: 'Presyncope / near-syncope — expedited assessment.'
	},
	{
		ruleId: 'R-TRIAGE-HEART-BLOCK',
		tier: 'urgent',
		fires: (d) => d.cardiac.knownArrhythmia === 'heart-block',
		description: 'Known heart block — expedited assessment.'
	}
];

/**
 * Axis B — compute the triage tier, target timeframe, and fired triage rules.
 * The referrer's requested urgency sets the base tier; a red flag can raise but
 * never lower it (the safety invariant).
 */
export function scoreTriage(data: HolterRequest): {
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
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'urgency',
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
