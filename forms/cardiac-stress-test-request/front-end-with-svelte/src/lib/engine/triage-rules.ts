import type { StressTestRequest, FiredRule, TriageTier } from './types';

// ──────────────────────────────────────────────
// Axis D — Triage priority (red-flag escalation)
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins.
// ──────────────────────────────────────────────

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 4-6 weeks',
	urgent: 'Within 1-2 weeks',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface TriageRuleDef {
	ruleId: string;
	tier: TriageTier;
	fires: (d: StressTestRequest) => boolean;
	description: string;
}

/** Red-flag escalation rules, each forcing at least the given tier. */
const TRIAGE_RULES: TriageRuleDef[] = [
	{
		ruleId: 'R-TRIAGE-RECENT-ACS',
		tier: 'emergency',
		fires: (d) => d.safety.recentAcuteCoronarySyndrome === true,
		description: 'Recent acute coronary syndrome — emergency cardiology review before any stress test.'
	},
	{
		ruleId: 'R-TRIAGE-SEVERE-AORTIC-STENOSIS',
		tier: 'urgent',
		fires: (d) => d.safety.aorticStenosis === 'severe',
		description: 'Severe aortic stenosis — urgent specialist cardiology review.'
	},
	{
		ruleId: 'R-TRIAGE-CHEST-PAIN',
		tier: 'urgent',
		fires: (d) =>
			d.symptoms.symptomChestPain === true && d.request.primaryIndication === 'suspected-angina',
		description: 'Chest pain with suspected angina — expedited rapid-access chest-pain assessment.'
	}
];

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function scoreTriage(data: StressTestRequest): {
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
		targetTimeframe: TARGET_TIMEFRAMES[tier] || '',
		firedRules
	};
}
