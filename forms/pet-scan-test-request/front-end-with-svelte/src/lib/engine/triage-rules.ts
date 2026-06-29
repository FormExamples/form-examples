import type { PetScanRequest, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Triage priority (urgency-driven)
// ──────────────────────────────────────────────
//
// The triage tier follows the clinician's requested urgency. Each tier maps to
// a target booking timeframe. Rule IDs are stable and identical across every
// front-end and the back-end.

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 2-4 weeks',
	urgent: 'Within 3-7 days',
	emergency: 'Within 24-48 hours'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

/**
 * Axis D — compute the triage tier, target timeframe, and fired triage rules
 * from the requested urgency.
 */
export function scoreTriage(data: PetScanRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const requested = data.justification.urgency || 'routine';
	const tier: TriageTier = (TRIAGE_ORDER as string[]).includes(requested)
		? (requested as TriageTier)
		: 'routine';

	const firedRules: FiredRule[] = [
		{
			ruleId: 'R-TRIAGE-REQUESTED',
			axis: 'triage',
			category: 'requested',
			description: `Triage follows the requested urgency (${tier}).`
		}
	];

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		firedRules
	};
}
