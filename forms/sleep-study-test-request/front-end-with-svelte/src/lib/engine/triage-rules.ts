import type { SleepStudyRequest, TriageTier, FiredRule } from './types';
import { EPWORTH_ABNORMAL, EPWORTH_SEVERE } from './constants';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6-12 weeks',
	urgent: 'Within 1-2 weeks'
};

/** Return whichever of two triage tiers is the more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

function epworthAtLeast(r: SleepStudyRequest, threshold: number): boolean {
	const v = r.scores.epworthScore;
	return v !== null && v !== undefined && Number(v) >= threshold;
}

interface TriageRule {
	ruleId: string;
	tier: TriageTier;
	fires: (r: SleepStudyRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-DRIVER-SLEEPINESS',
		tier: 'urgent',
		fires: (r) => r.symptoms.occupationalDriver === true && epworthAtLeast(r, EPWORTH_ABNORMAL),
		description: 'Vocational driver with excessive sleepiness — fast-track urgent (DVLA).'
	},
	{
		ruleId: 'R-TRIAGE-SEVERE-SLEEPINESS',
		tier: 'urgent',
		fires: (r) => epworthAtLeast(r, EPWORTH_SEVERE),
		description: 'Severe excessive daytime sleepiness (Epworth ≥ 16) — urgent assessment.'
	}
];

/**
 * Axis D — triage priority, plus the target timeframe.
 *
 * A base tier is taken from the clinician's requested urgency, then DVLA-style
 * escalation rules (vocational driver with sleepiness, or severe sleepiness)
 * auto-escalate it. The most-severe escalation wins; the requested urgency can
 * raise but never lower the computed tier.
 */
export function gradeTriage(r: SleepStudyRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of TRIAGE_RULES) {
		if (rule.fires(r)) {
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
			description: `No escalation triggers; triage follows the requested urgency (${tier}).`
		});
	}

	return { triageTier: tier, targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '', firedRules };
}
