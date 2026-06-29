// ──────────────────────────────────────────────
// Axis D — Triage priority (acuity escalation)
//
// A base tier is taken from the clinician's requested urgency, then acuity
// rules auto-escalate it. The most-severe escalation wins. Rule IDs are stable
// and identical across every front-end and the back-end (R-TRIAGE-*). Ported
// from the source-of-truth HTML engine.
// ──────────────────────────────────────────────

import type { CtScanRequest, FiredRule, TriageTier } from './types';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

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
	fires: (d: CtScanRequest) => boolean;
	description: string;
}

const TRIAGE_RULES: TriageRule[] = [
	{
		ruleId: 'R-TRIAGE-STROKE',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'suspected-stroke',
		description: 'Suspected acute stroke — emergency CT head within the thrombolysis window.'
	},
	{
		ruleId: 'R-TRIAGE-PE',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'pulmonary-embolism',
		description: 'Suspected pulmonary embolism — emergency CT pulmonary angiogram.'
	},
	{
		ruleId: 'R-TRIAGE-TRAUMA',
		tier: 'emergency',
		fires: (d) => d.request.primaryIndication === 'trauma',
		description: 'Major trauma — emergency CT for rapid assessment.'
	},
	{
		ruleId: 'R-TRIAGE-RENAL-COLIC',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'renal-colic',
		description: 'Acute renal colic — urgent CT to confirm and assess obstruction.'
	},
	{
		ruleId: 'R-TRIAGE-ABDO-PAIN',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'abdominal-pain',
		description: 'Acute abdominal pain — urgent CT to exclude a surgical emergency.'
	},
	{
		ruleId: 'R-TRIAGE-INFECTION',
		tier: 'urgent',
		fires: (d) => d.request.primaryIndication === 'infection-abscess',
		description: 'Suspected infection / abscess — urgent CT to locate a collection.'
	}
];

/** The result of grading Axis D. */
export interface TriageResult {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
}

/** Compute the triage tier, target timeframe, and fired triage rules. */
export function gradeTriage(data: CtScanRequest): TriageResult {
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
				category: 'acuity',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No acuity escalation; triage follows the requested urgency (${tier}).`
		});
	}

	return {
		triageTier: tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}
