import type { GeneticTestRequest, TriageTier, FiredRule } from './types';
import { isPrenatalRequest } from './utils';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent'];

const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Standard laboratory turnaround',
	urgent: 'Expedite — urgent turnaround'
};

const PRENATAL_TIMEFRAME = 'Time-critical — prenatal window';

/** Return whichever of two triage tiers is more severe. */
function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	const ia = TRIAGE_ORDER.indexOf(a);
	const ib = TRIAGE_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/**
 * Axis D — triage priority, plus the target timeframe.
 *
 * A base tier is taken from the clinician's requested urgency, then prenatal
 * requests auto-escalate to urgent and carry a time-critical timeframe. The
 * most-severe escalation wins.
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function gradeTriage(r: GeneticTestRequest): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = r.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];
	let timeCritical = false;

	const prenatal = isPrenatalRequest(
		r.request.testType,
		r.request.primaryIndication,
		r.triage.specimenType
	);

	if (prenatal) {
		tier = maxTier(tier, 'urgent');
		timeCritical = true;
		firedRules.push({
			ruleId: 'R-TRIAGE-PRENATAL-TIME-CRITICAL',
			axis: 'triage',
			category: 'prenatal',
			description:
				'Prenatal request — time-critical; the result is needed within the prenatal decision window.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `No escalation; triage follows the requested urgency (${tier}).`
		});
	}

	const targetTimeframe = timeCritical ? PRENATAL_TIMEFRAME : TARGET_TIMEFRAMES[tier] || '';

	return { triageTier: tier, targetTimeframe, firedRules };
}
