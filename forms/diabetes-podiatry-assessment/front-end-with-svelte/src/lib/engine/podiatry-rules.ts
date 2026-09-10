import type { AssessmentData, FootExam, OverallContext, Referral, Risk, ReviewPathway, ReviewRule } from './types';

// Declarative diabetes-podiatry-assessment classification rules, aligned with
// NICE NG19 (Diabetic foot problems: prevention and management).
//
// The engine first classifies each foot independently — a risk-factor count
// (insensate neuropathy, diminished/absent pulses, deformity, callus/skin
// breakdown) maps to low / moderate / high, then an active ulcer or
// suspected Charcot on that foot forces active-urgent, and a previous ulcer
// or amputation on that foot forces at least high. The worse of the two
// feet, further raised to at least high by renal replacement therapy,
// becomes the overall risk. The overall risk then routes to exactly one
// review pathway via a gated, first-match cascade ordered by clinical
// urgency (most urgent wins), evaluated by the grader (`podiatry-grader.ts`).
// Rows here mirror the `diabetes_podiatry_assessment_grade_rule` SQL table
// (rule_id, stage, category, description) plus the pathway fields the
// grader records on the `diabetes_podiatry_assessment_grade` row.

/** Risk severity ranking used to take the worse of the two feet. */
export const RISK_SEVERITY: Record<string, number> = {
	'': -1,
	low: 0,
	moderate: 1,
	high: 2,
	'active-urgent': 3
};

/**
 * Count of independent risk factors present on one foot: insensate
 * neuropathy, diminished/absent pulses, deformity, and callus/skin
 * breakdown (combined as a single factor).
 */
export function perFootRiskFactorCount(foot: FootExam): number {
	let count = 0;
	if (foot.neuropathyStatus === 'insensate') count += 1;
	if (foot.pulsesStatus === 'diminished' || foot.pulsesStatus === 'absent') count += 1;
	if (foot.deformity === 'yes') count += 1;
	if (foot.callus === 'yes' || foot.skinBreakdown === 'yes') count += 1;
	return count;
}

/**
 * Base risk from the factor count alone, before overrides: 0 factors is
 * low, exactly 1 is moderate, 2 or more is high.
 */
export function perFootBaseRisk(foot: FootExam): Risk {
	const count = perFootRiskFactorCount(foot);
	if (count >= 2) return 'high';
	if (count === 1) return 'moderate';
	return 'low';
}

/**
 * One foot's risk category, applying the active-urgent and history
 * overrides on top of the base risk-factor count.
 */
export function perFootRisk(foot: FootExam): Risk {
	if (foot.activeUlcer === 'yes' || foot.suspectedCharcot === 'yes') {
		return 'active-urgent';
	}
	const base = perFootBaseRisk(foot);
	if (foot.previousUlcer === 'yes' || foot.previousAmputation === 'minor' || foot.previousAmputation === 'major') {
		return RISK_SEVERITY[base] > RISK_SEVERITY['high'] ? base : 'high';
	}
	return base;
}

/**
 * Whether a foot carries a previous-ulcer/amputation history — used to pick
 * the tighter (1-month) high-risk review interval over the looser
 * (3-month) combined-risk-factors interval.
 */
export function hasHistory(foot: FootExam): boolean {
	return (
		foot.previousUlcer === 'yes' ||
		foot.previousAmputation === 'minor' ||
		foot.previousAmputation === 'major'
	);
}

/** Derive the overall classification context the review-pathway cascade evaluates. */
export function deriveContext(d: AssessmentData): OverallContext {
	const rightFootRisk = perFootRisk(d.rightFoot);
	const leftFootRisk = perFootRisk(d.leftFoot);
	const rightWorse = RISK_SEVERITY[rightFootRisk] >= RISK_SEVERITY[leftFootRisk];
	const worstFootRisk = rightWorse ? rightFootRisk : leftFootRisk;
	const worstFoot = rightWorse ? d.rightFoot : d.leftFoot;
	return {
		rightFootRisk,
		leftFootRisk,
		worstFootRisk,
		onRenalReplacementTherapy: d.riskFactors.onRenalReplacementTherapy === 'yes',
		tighterHighRiskInterval: hasHistory(worstFoot)
	};
}

/**
 * Declarative diabetes-podiatry-assessment review-pathway rules. Evaluated
 * top-to-bottom by the grader (`podiatry-grader.ts`); the first whose
 * `evaluate` returns true wins.
 */
export const reviewRules: ReviewRule[] = [
	// ─── 1. ACTIVE ULCER / SUSPECTED CHARCOT — URGENT ──────────────
	{
		id: 'R-OVERALL-ACTIVE-URGENT-01',
		stage: 'urgent-override',
		category: 'active-urgent',
		reviewPathway: 'urgent-mdt-referral' as ReviewPathway,
		referral: 'urgent-mdt' as Referral,
		intervalMonths: null,
		description:
			'An active ulcer or suspected Charcot foot on at least one foot — urgent referral to the multidisciplinary foot team (same or next working day).',
		evaluate: (ctx) => ctx.worstFootRisk === 'active-urgent'
	},

	// ─── 2. HIGH RISK — patient-wide or per-foot ───────────────────
	{
		id: 'R-OVERALL-HIGH-01',
		stage: 'patient-wide',
		category: 'high-risk',
		reviewPathway: 'high-risk-review' as ReviewPathway,
		referral: 'multidisciplinary-foot-team' as Referral,
		intervalMonths: 1,
		description:
			'High risk from previous ulceration/amputation history — 1-monthly review by the multidisciplinary foot team.',
		evaluate: (ctx) => (ctx.worstFootRisk === 'high' || ctx.onRenalReplacementTherapy) && ctx.tighterHighRiskInterval
	},
	{
		id: 'R-OVERALL-HIGH-02',
		stage: 'patient-wide',
		category: 'high-risk',
		reviewPathway: 'high-risk-review' as ReviewPathway,
		referral: 'multidisciplinary-foot-team' as Referral,
		intervalMonths: 3,
		description:
			'High risk from combined risk factors or renal replacement therapy, without an ulcer/amputation history — 3-monthly review by the multidisciplinary foot team.',
		evaluate: (ctx) => ctx.worstFootRisk === 'high' || ctx.onRenalReplacementTherapy
	},

	// ─── 3. MODERATE RISK — one risk factor ────────────────────────
	{
		id: 'R-OVERALL-MODERATE-01',
		stage: 'review',
		category: 'moderate-risk',
		reviewPathway: 'moderate-risk-review' as ReviewPathway,
		referral: 'foot-protection-service' as Referral,
		intervalMonths: 6,
		description: 'Moderate risk (one risk factor on the worse foot) — 6-monthly review by the foot protection service.',
		evaluate: (ctx) => ctx.worstFootRisk === 'moderate'
	},

	// ─── 4. LOW RISK — annual review ───────────────────────────────
	{
		id: 'R-OVERALL-LOW-01',
		stage: 'review',
		category: 'low-risk',
		reviewPathway: 'annual-review' as ReviewPathway,
		referral: 'none' as Referral,
		intervalMonths: 12,
		description: 'Low risk (no risk factors on either foot) — annual review.',
		evaluate: () => true
	}
];
