// ──────────────────────────────────────────────
// Axis B — Cancer-pathway urgency (NICE NG12 / DG56)
//
// A base tier is taken from the clinician's requested urgency, then
// suspected-cancer rules escalate it. A FIT ≥ 10 µg Hb/g (NICE DG56), or a
// NICE NG12 lower-GI red-flag combination, escalates to two-week-wait. An
// acute emergency presentation (emergency setting with active rectal bleeding)
// auto-escalates to emergency. The most-severe tier wins. Rule IDs
// (R-URGENCY-*) are stable across every front-end and the back-end.
// ──────────────────────────────────────────────

import type { ColonoscopyRequest, TriageTier, FiredRule } from './types';

// NICE DG56: a FIT result at or above this threshold (micrograms of
// haemoglobin per gram of faeces) triggers the suspected-cancer pathway.
export const FIT_POSITIVE_THRESHOLD = 10;

export const TRIAGE_ORDER: TriageTier[] = ['routine', 'urgent', 'two-week-wait', 'emergency'];

export const TARGET_TIMEFRAMES: Record<string, string> = {
	routine: 'Within 6 weeks (routine)',
	urgent: 'Within 2 weeks (urgent)',
	'two-week-wait': '<= 14 days (2WW suspected-cancer pathway)',
	emergency: 'Same day / immediate'
};

/** Return whichever of two triage tiers is more severe. */
export function maxTier(a: TriageTier, b: TriageTier): TriageTier {
	return TRIAGE_ORDER.indexOf(a) >= TRIAGE_ORDER.indexOf(b) ? a : b;
}

/** True when the FIT result meets the NICE DG56 positive threshold. */
export function fitPositive(d: ColonoscopyRequest): boolean {
	const fit = d.redFlags.fitResultUgG;
	return fit !== null && fit !== undefined && (fit as unknown as string) !== '' && Number(fit) >= FIT_POSITIVE_THRESHOLD;
}

/** Count NICE NG12 lower-GI red flags present. */
export function redFlagCount(d: ColonoscopyRequest): number {
	let n = 0;
	if (d.redFlags.weightLoss) n++;
	if (d.redFlags.anaemia) n++;
	if (d.redFlags.abdominalMass) n++;
	if (d.redFlags.rectalBleeding) n++;
	return n;
}

/**
 * Compute the cancer-pathway urgency tier, target timeframe, two-week-wait
 * eligibility + rationale, and fired urgency rules.
 */
export function scoreUrgency(data: ColonoscopyRequest): {
	tier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
	firedRules: FiredRule[];
} {
	const requested = data.triage.urgency || 'routine';
	let tier: TriageTier = TRIAGE_ORDER.includes(requested as TriageTier) ? (requested as TriageTier) : 'routine';
	const firedRules: FiredRule[] = [];
	let twoWeekWaitEligible = false;
	let twoWeekWaitRationale = '';

	// Emergency auto-escalation: acute presentation in the emergency setting
	// with active rectal bleeding.
	if (data.patient.setting === 'emergency' && data.redFlags.rectalBleeding) {
		tier = maxTier(tier, 'emergency');
		firedRules.push({
			ruleId: 'R-URGENCY-EMERGENCY-BLEED',
			axis: 'urgency',
			category: 'acute-presentation',
			description: 'Emergency setting with active rectal bleeding — auto-escalated to emergency.'
		});
	}

	// FIT >= 10 µg Hb/g (NICE DG56) → suspected-cancer two-week-wait.
	if (fitPositive(data)) {
		tier = maxTier(tier, 'two-week-wait');
		twoWeekWaitEligible = true;
		twoWeekWaitRationale = `Positive FIT (${Number(data.redFlags.fitResultUgG)} ug Hb/g >= ${FIT_POSITIVE_THRESHOLD}, NICE DG56) — suspected-cancer pathway.`;
		firedRules.push({
			ruleId: 'R-URGENCY-FIT-2WW',
			axis: 'urgency',
			category: 'positive-fit',
			description: twoWeekWaitRationale
		});
	}

	// NICE NG12 lower-GI red-flag combination → two-week-wait.
	const flagCount = redFlagCount(data);
	if (flagCount >= 2 || data.redFlags.abdominalMass) {
		tier = maxTier(tier, 'two-week-wait');
		if (!twoWeekWaitEligible) {
			twoWeekWaitEligible = true;
			twoWeekWaitRationale = data.redFlags.abdominalMass
				? 'Palpable abdominal / rectal mass (NICE NG12) — suspected-cancer pathway.'
				: 'Lower-GI red-flag combination (NICE NG12) — suspected-cancer pathway.';
		}
		firedRules.push({
			ruleId: 'R-URGENCY-RED-FLAG-2WW',
			axis: 'urgency',
			category: 'red-flag-combination',
			description: data.redFlags.abdominalMass
				? 'Palpable abdominal / rectal mass meets NICE NG12 two-week-wait criteria.'
				: `Lower-GI red-flag combination (${flagCount} red flags) meets NICE NG12 two-week-wait criteria.`
		});
	}

	// Indication recorded explicitly as positive FIT → two-week-wait.
	if (data.request.primaryIndication === 'positive-fit' && !twoWeekWaitEligible) {
		tier = maxTier(tier, 'two-week-wait');
		twoWeekWaitEligible = true;
		twoWeekWaitRationale = 'Primary indication is a positive FIT — suspected-cancer pathway (NICE DG56).';
		firedRules.push({
			ruleId: 'R-URGENCY-INDICATION-FIT-2WW',
			axis: 'urgency',
			category: 'positive-fit',
			description: twoWeekWaitRationale
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-URGENCY-REQUESTED',
			axis: 'urgency',
			category: 'requested',
			description: `No suspected-cancer escalation; urgency follows the requested tier (${tier}).`
		});
	}

	if (!twoWeekWaitEligible) {
		twoWeekWaitRationale = 'Does not meet NICE NG12 / DG56 two-week-wait suspected-cancer criteria.';
	}

	return {
		tier,
		targetTimeframe: TARGET_TIMEFRAMES[tier] ?? '',
		twoWeekWaitEligible,
		twoWeekWaitRationale,
		firedRules
	};
}
