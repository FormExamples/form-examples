import type { MicrobiologyRequest, TriageTier, FiredRule } from './types';

// ----------------------------------------------------------------------
// Axis D — Triage priority (NICE NG51 sepsis escalation)
// ----------------------------------------------------------------------
//
// A base tier is taken from the clinician's requested urgency, then rules
// auto-escalate it. Suspected sepsis forces stat (NICE NG51). The most-severe
// escalation wins.

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Routine — standard laboratory turnaround',
	urgent: 'Urgent — same-day processing',
	stat: 'Stat — process immediately / within the hour'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

// Escalation rules, each forcing at least the given tier.
const TRIAGE_RULES: { ruleId: string; tier: TriageTier; fires: (d: MicrobiologyRequest) => boolean; description: string }[] = [
	{
		ruleId: 'R-TRIAGE-SUSPECTED-SEPSIS',
		tier: 'stat',
		fires: (d) => d.clinical.primaryIndication === 'suspected-sepsis',
		description: 'Suspected sepsis — process as stat (NICE NG51).'
	},
	{
		ruleId: 'R-TRIAGE-MENINGITIS',
		tier: 'stat',
		fires: (d) => d.clinical.primaryIndication === 'meningitis',
		description: 'Suspected meningitis — process as stat.'
	},
	{
		ruleId: 'R-TRIAGE-FEVER-IMMUNOCOMPROMISED',
		tier: 'urgent',
		fires: (d) => d.clinical.fever === true && d.clinical.immunocompromised === true,
		description: 'Fever in an immunocompromised patient — expedite processing.'
	}
];

/**
 * Axis D — compute the triage tier, target timeframe, and fired triage rules.
 */
export function scoreTriage(data: MicrobiologyRequest): {
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
				category: 'escalation',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
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
