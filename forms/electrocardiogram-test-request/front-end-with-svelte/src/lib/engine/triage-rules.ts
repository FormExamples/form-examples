import type { EcgRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis B — Urgency / triage (NICE CG95 / ACS pathway red-flag escalation)
//
// A base tier is taken from the clinician's requested urgency, then red flags
// auto-escalate it. The most-severe escalation wins. Suspected ACS or active
// chest pain implies an emergency, same-hour 12-lead ECG. Rule IDs are stable
// and identical across every front-end and the back-end.
// ──────────────────────────────────────────────

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 2-6 weeks',
	urgent: 'Within 24-72 hours',
	emergency: 'Same hour / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: EcgRequest) => boolean;
	description: string;
}

// Red-flag escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-URGENCY-SUSPECTED-ACS',
		tier: 'emergency',
		fires: (d) => d.symptoms.suspectedAcs === true || d.request.primaryIndication === 'suspected-mi-acs',
		description: 'Suspected acute coronary syndrome — emergency same-hour 12-lead ECG.'
	},
	{
		ruleId: 'R-URGENCY-ACTIVE-CHEST-PAIN',
		tier: 'emergency',
		fires: (d) => d.symptoms.symptomChestPain === true && d.symptoms.currentlySymptomatic === true,
		description: 'Active chest pain at the time of request — emergency same-hour 12-lead ECG.'
	},
	{
		ruleId: 'R-URGENCY-SYNCOPE',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomSyncope === true,
		description: 'Syncope / collapse — urgent assessment to exclude arrhythmic cause.'
	},
	{
		ruleId: 'R-URGENCY-SUSPECTED-VT',
		tier: 'urgent',
		fires: (d) => d.symptoms.knownArrhythmia === 'vt',
		description: 'Known / suspected ventricular tachycardia — urgent assessment.'
	},
	{
		ruleId: 'R-URGENCY-CHEST-PAIN',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomChestPain === true,
		description: 'Chest pain reported — urgent assessment.'
	},
	{
		ruleId: 'R-URGENCY-PALPITATIONS-SYMPTOMATIC',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomPalpitations === true && d.symptoms.currentlySymptomatic === true,
		description: 'Currently symptomatic palpitations — capture the event promptly.'
	}
];

/**
 * Axis B — compute the triage tier, target timeframe, and fired urgency rules.
 * The referrer's requested urgency can raise but never lower the computed tier.
 */
export function scoreTriage(data: EcgRequest): {
	triageTier: TriageTier;
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
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
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
