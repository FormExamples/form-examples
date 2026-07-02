// Newborn blood spot classification rules (pure, no I/O).
//
// This form is a documentation-and-classification record, not a numeric score.
// The helpers here define the nine-condition metadata table, normalise each
// per-condition result class, derive the referrals for suspected conditions,
// derive the overall screening outcome by precedence, derive the referral
// status, and derive the sample-quality object. `bloodspot-grader.ts`
// orchestrates these into `gradeBloodspot`.
//
// Overall outcome precedence (first match wins, top to bottom):
//   any suspected            -> 'referral-required'
//   any repeat-required      -> 'repeat-required'
//   any pending/outstanding  -> 'incomplete'
//   any declined (rest ok)   -> 'declined-only-outstanding'
//   otherwise                -> 'all-not-suspected'
//
// `carrier` is valid for SCD only; a carrier value on any other condition is a
// data-validity error and is treated as outstanding ('pending') for outcome
// purposes. An unanswered result ('') is likewise treated as outstanding.

import type {
	BloodspotScreening,
	ConditionMeta,
	ConditionResult,
	OverallOutcome,
	Referral,
	ReferralStatus,
	ResultClass,
	SampleQualityResult
} from './types';

/**
 * The nine screened conditions, in reporting order. `carrierValid` is true
 * only for sickle cell disease; a `carrier` class on any other condition is a
 * data-validity error.
 */
export const CONDITIONS: ConditionMeta[] = [
	{
		code: 'scd',
		label: 'Sickle cell disease',
		short: 'SCD',
		field: 'scdResult',
		service: 'Haemoglobinopathy / haematology service',
		carrierValid: true
	},
	{
		code: 'cf',
		label: 'Cystic fibrosis',
		short: 'CF',
		field: 'cfResult',
		service: 'Cystic fibrosis centre',
		carrierValid: false
	},
	{
		code: 'cht',
		label: 'Congenital hypothyroidism',
		short: 'CHT',
		field: 'chtResult',
		service: 'Paediatric endocrinology',
		carrierValid: false
	},
	{
		code: 'pku',
		label: 'Phenylketonuria',
		short: 'PKU',
		field: 'pkuResult',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	},
	{
		code: 'mcadd',
		label: 'Medium-chain acyl-CoA dehydrogenase deficiency',
		short: 'MCADD',
		field: 'mcaddResult',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	},
	{
		code: 'msud',
		label: 'Maple syrup urine disease',
		short: 'MSUD',
		field: 'msudResult',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	},
	{
		code: 'iva',
		label: 'Isovaleric acidaemia',
		short: 'IVA',
		field: 'ivaResult',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	},
	{
		code: 'ga1',
		label: 'Glutaric aciduria type 1',
		short: 'GA1',
		field: 'ga1Result',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	},
	{
		code: 'hcu',
		label: 'Homocystinuria (pyridoxine unresponsive)',
		short: 'HCU',
		field: 'hcuResult',
		service: 'Inherited metabolic disease centre',
		carrierValid: false
	}
];

/**
 * Repeat reasons that indicate an avoidable repeat (sampling technique or card
 * fault, rather than a genuinely borderline result).
 */
export const AVOIDABLE_REPEAT_REASONS = ['inadequate-sample', 'too-early', 'technical'];

/** The lower / upper bounds (inclusive) of the acceptable sampling window (days). */
export const WINDOW_MIN_DAYS = 5;
export const WINDOW_MAX_DAYS = 8;

/**
 * Normalise each of the nine conditions into a ConditionResult carrying the
 * raw result, an `effectiveResult` used for outcome derivation, the specialist
 * referral target, and an `invalidCarrier` flag.
 */
export function normaliseConditionResults(data: BloodspotScreening): ConditionResult[] {
	return CONDITIONS.map((c) => {
		const raw = data.conditions[c.field] || '';
		const invalidCarrier = raw === 'carrier' && !c.carrierValid;
		// For outcome purposes an unanswered result and an invalid carrier are
		// both treated as outstanding ('pending').
		let effectiveResult: ResultClass = raw;
		if (raw === '' || invalidCarrier) effectiveResult = 'pending';
		return {
			code: c.code,
			label: c.label,
			short: c.short,
			result: raw,
			effectiveResult,
			referralTarget: c.service,
			invalidCarrier
		};
	});
}

/** Emit one urgent Referral per condition whose (raw) result is 'suspected'. */
export function deriveReferrals(conditionResults: ConditionResult[]): Referral[] {
	const referrals: Referral[] = [];
	for (const cr of conditionResults) {
		if (cr.result === 'suspected') {
			referrals.push({ code: cr.code, service: cr.referralTarget, urgency: 'urgent' });
		}
	}
	return referrals;
}

/** Derive the overall screening outcome by precedence. */
export function deriveOverallOutcome(conditionResults: ConditionResult[]): OverallOutcome {
	const eff = conditionResults.map((c) => c.effectiveResult);
	if (eff.includes('suspected')) return 'referral-required';
	if (eff.includes('repeat-required')) return 'repeat-required';
	if (eff.includes('pending')) return 'incomplete';
	// Every remaining result is 'not-suspected', 'carrier' (SCD), or 'declined'.
	if (eff.includes('declined')) return 'declined-only-outstanding';
	return 'all-not-suspected';
}

/** Derive the referral status from the overall outcome. */
export function deriveReferralStatus(outcome: OverallOutcome): ReferralStatus {
	if (outcome === 'referral-required') return 'urgent';
	if (outcome === 'repeat-required') return 'repeat';
	return 'routine';
}

/**
 * Derive the sample-quality object from adequacy, the day 5–8 window on
 * `ageAtSampleDays`, and the repeat reason.
 */
export function deriveSampleQuality(
	data: BloodspotScreening,
	ageAtSampleDays: number | null
): SampleQualityResult {
	const sq = data.sampleQuality;
	const withinWindow =
		ageAtSampleDays !== null &&
		ageAtSampleDays >= WINDOW_MIN_DAYS &&
		ageAtSampleDays <= WINDOW_MAX_DAYS;
	const avoidableRepeat =
		sq.isRepeat === 'yes' && AVOIDABLE_REPEAT_REASONS.indexOf(sq.repeatReason) !== -1;
	return {
		adequate: sq.sampleAdequacy === 'adequate',
		withinWindow,
		avoidableRepeat
	};
}

/**
 * Compute the baby's age in whole days at the time of sampling
 * (`sampleDate − dateOfBirth`, day of birth = day 0). Returns null when either
 * date is missing or unparseable.
 */
export function computeAgeAtSampleDays(
	dateOfBirth: string,
	sampleDate: string
): number | null {
	if (!dateOfBirth || !sampleDate) return null;
	const birth = new Date(dateOfBirth);
	const sample = new Date(sampleDate);
	if (isNaN(birth.getTime()) || isNaN(sample.getTime())) return null;
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	return Math.round((sample.getTime() - birth.getTime()) / MS_PER_DAY);
}
