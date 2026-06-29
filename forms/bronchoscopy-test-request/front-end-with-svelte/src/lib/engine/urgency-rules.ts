import type { BronchoscopyRequest, TriageTier, FiredRule } from './types';

/**
 * Axis B — cancer-pathway urgency (NICE NG12 two-week-wait).
 *
 * A base tier is taken from the clinician's requested urgency, then NICE NG12
 * suspected-cancer rules and emergency red flags escalate it. The most-severe
 * escalation wins. Massive haemoptysis or haemodynamic instability auto-
 * escalates to emergency regardless of the other axes.
 */
const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6 weeks',
	urgent: 'Within 1-2 weeks',
	'two-week-wait': 'Within 14 days (NICE NG12)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface UrgencyRule {
	ruleId: string;
	tier: TriageTier;
	fires: (d: BronchoscopyRequest) => boolean;
	description: string;
}

const URGENCY_RULES: UrgencyRule[] = [
	{
		ruleId: 'R-URGENCY-MASSIVE-HAEMOPTYSIS',
		tier: 'emergency',
		fires: (d) =>
			d.symptoms.symptomHaemoptysis === true && d.symptoms.haemoptysisSeverity === 'massive',
		description: 'Massive haemoptysis — emergency airway assessment.'
	},
	{
		ruleId: 'R-URGENCY-INSTABILITY',
		tier: 'emergency',
		fires: (d) => d.procedural.haemodynamicallyUnstable === true,
		description: 'Haemodynamic instability — emergency assessment.'
	},
	{
		ruleId: 'R-URGENCY-STRIDOR',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'stridor',
		description: 'Stridor — possible critical airway obstruction; emergency assessment.'
	},
	{
		ruleId: 'R-URGENCY-2WW-SUSPECTED-CANCER',
		tier: 'two-week-wait',
		fires: (d) =>
			d.request.primaryIndication === 'suspected-lung-cancer' ||
			d.request.primaryIndication === 'lung-mass-on-imaging',
		description:
			'Suspected lung cancer / lung mass on imaging — NICE NG12 two-week-wait pathway.'
	},
	{
		ruleId: 'R-URGENCY-2WW-HAEMOPTYSIS',
		tier: 'two-week-wait',
		fires: (d) =>
			d.request.primaryIndication === 'haemoptysis' || d.symptoms.symptomHaemoptysis === true,
		description: 'Unexplained haemoptysis — NICE NG12 two-week-wait pathway (people aged 40+).'
	},
	{
		ruleId: 'R-URGENCY-WEIGHT-LOSS',
		tier: 'urgent',
		fires: (d) => d.symptoms.symptomWeightLoss === true,
		description: 'Unexplained weight loss — expedite assessment.'
	}
];

/**
 * Indications / contexts that make a request two-week-wait eligible under NICE
 * NG12 suspected-cancer rules.
 */
export function isTwoWeekWaitEligible(d: BronchoscopyRequest): boolean {
	return (
		d.request.primaryIndication === 'suspected-lung-cancer' ||
		d.request.primaryIndication === 'lung-mass-on-imaging' ||
		d.request.primaryIndication === 'haemoptysis' ||
		d.symptoms.symptomHaemoptysis === true
	);
}

/**
 * Compute the cancer-pathway urgency tier, target timeframe, two-week-wait
 * eligibility, and fired urgency rules.
 */
export function gradeUrgency(d: BronchoscopyRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	firedRules: FiredRule[];
} {
	const requested = d.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	for (const rule of URGENCY_RULES) {
		if (rule.fires(d)) {
			tier = maxTier(tier, rule.tier);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'urgency',
				category: 'cancer-pathway',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No escalation rule fired; urgency follows the requested tier (${tier}).`
		});
	}

	return {
		triageTier: tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		twoWeekWaitEligible: isTwoWeekWaitEligible(d),
		firedRules
	};
}

export { TRIAGE_ORDER, TARGET_TIMEFRAMES };
