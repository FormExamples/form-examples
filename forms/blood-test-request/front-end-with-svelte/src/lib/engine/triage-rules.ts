import type { BloodTestRequest, FiredRule, TriageTier } from './types';
import { PANELS, CRITICAL_PANELS } from './panels';

const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'stat'];

const TARGET_TIMEFRAMES: Record<Exclude<TriageTier, ''>, string> = {
	routine: 'Within standard laboratory turnaround',
	urgent: 'Within a few hours',
	stat: 'Immediate / within 1 hour'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

/**
 * Axis D — triage priority (routine / urgent / stat) + target timeframe.
 *
 * A base tier is taken from the clinician's requested urgency, then a critical
 * test (troponin, d-dimer, blood culture, crossmatch) or stat urgency escalates
 * it. The most-severe escalation wins.
 */
export function scoreTriage(data: BloodTestRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier)
		? (requested as TriageTier)
		: 'routine';
	const firedRules: FiredRule[] = [];

	if (requested === 'stat') {
		firedRules.push({
			ruleId: 'R-TRIAGE-STAT-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: 'Clinician requested a stat (immediate) turnaround.'
		});
	}

	const criticalSelected = CRITICAL_PANELS.filter((f) => data.panels[f]);
	for (const f of criticalSelected) {
		tier = maxTier(tier, 'stat');
		const panel = PANELS.find((p) => p.field === f);
		firedRules.push({
			ruleId: `R-TRIAGE-CRITICAL-${String(f).toUpperCase()}`,
			axis: 'triage',
			category: 'critical-test',
			description: `${panel ? panel.label : f} is a critical test — escalate to stat.`
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

	return {
		tier,
		targetTimeframe: tier === '' ? '' : TARGET_TIMEFRAMES[tier],
		firedRules
	};
}
