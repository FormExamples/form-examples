import type {
	AssessmentData,
	ClassificationRule,
	RetinopathyGrade,
	WorstEyeContext,
	WorstMaculopathy,
	WorstRetinopathy
} from './types';

/**
 * Retinopathy severity ranking: R0 < R1 < R2 < R3S < R3A. A stable treated
 * proliferative eye (R3S) ranks below an active proliferative eye (R3A) because
 * the active disease is the more urgent finding.
 */
export const RETINOPATHY_SEVERITY: Record<RetinopathyGrade, number> = {
	'': -1,
	R0: 0,
	R1: 1,
	R2: 2,
	R3S: 3,
	R3A: 4
};

/**
 * Worst retinopathy grade across both eyes by severity, ignoring unset ('')
 * grades and eyes marked ungradable (an ungradable eye does not contribute a
 * retinopathy grade). Defaults to 'R0' when neither eye has a graded value.
 */
export function worstRetinopathy(d: AssessmentData): WorstRetinopathy {
	const grades: RetinopathyGrade[] = [];
	if (d.rightEye.ungradable !== 'yes' && d.rightEye.retinopathy !== '') {
		grades.push(d.rightEye.retinopathy);
	}
	if (d.leftEye.ungradable !== 'yes' && d.leftEye.retinopathy !== '') {
		grades.push(d.leftEye.retinopathy);
	}
	let worst: WorstRetinopathy = 'R0';
	for (const g of grades) {
		if (RETINOPATHY_SEVERITY[g] > RETINOPATHY_SEVERITY[worst]) {
			worst = g as WorstRetinopathy;
		}
	}
	return worst;
}

/** Worst maculopathy grade across both eyes: M1 if either eye is M1, else M0. */
export function worstMaculopathy(d: AssessmentData): WorstMaculopathy {
	return d.rightEye.maculopathy === 'M1' || d.leftEye.maculopathy === 'M1' ? 'M1' : 'M0';
}

/** Whether either eye is marked ungradable (U = yes). */
export function anyUngradable(d: AssessmentData): boolean {
	return d.rightEye.ungradable === 'yes' || d.leftEye.ungradable === 'yes';
}

/**
 * Low-risk 24-month recall eligibility: both eyes R0, worst maculopathy M0, and
 * the previous screen was also R0/M0.
 */
export function lowRiskEligible(d: AssessmentData): boolean {
	return (
		d.rightEye.retinopathy === 'R0' &&
		d.leftEye.retinopathy === 'R0' &&
		worstMaculopathy(d) === 'M0' &&
		d.identification.previousScreenResult === 'r0m0'
	);
}

/** Derive the worst-eye summary context the classification cascade evaluates. */
export function deriveContext(d: AssessmentData): WorstEyeContext {
	return {
		worstRetinopathy: worstRetinopathy(d),
		worstMaculopathy: worstMaculopathy(d),
		anyUngradable: anyUngradable(d),
		lowRiskEligible: lowRiskEligible(d)
	};
}

/**
 * Declarative diabetes-eye-screening classification rules.
 *
 * Unlike an additive score, diabetes eye screening is a *classification*
 * pathway. The engine first derives a worst-eye summary across both eyes — the
 * worst retinopathy (R) grade by severity R0 < R1 < R2 < R3S < R3A, the worst
 * maculopathy (M) grade, and whether either eye is ungradable (U) — then routes
 * to exactly one recall / referral outcome via a gated, first-match cascade
 * ordered by clinical urgency (most urgent wins). The rules below are evaluated
 * top-to-bottom by the grader (`diabetes-eye-grader.ts`); the first whose
 * `evaluate` returns true wins. Rows mirror the
 * `diabetes_eye_screening_grade_rule` SQL table (rule_id, stage, category,
 * description) plus the outcome fields the grader records.
 */
export const classificationRules: ClassificationRule[] = [
	// ─── 1. ACTIVE PROLIFERATIVE — URGENT ──────────────────────────
	{
		id: 'R-RECALL-R3A-01',
		stage: 'recall',
		category: 'urgent-proliferative',
		outcome: 'refer-hes-urgent',
		referral: 'hes-urgent',
		intervalMonths: null,
		description:
			'Worst-eye retinopathy R3A (active proliferative) — urgent / fast-track referral to ophthalmology.',
		evaluate: (ctx) => ctx.worstRetinopathy === 'R3A'
	},

	// ─── 2. REFERABLE — MACULOPATHY OR STABLE PROLIFERATIVE ─────────
	{
		id: 'R-RECALL-M1-R3S-01',
		stage: 'recall',
		category: 'referable',
		outcome: 'refer-hes',
		referral: 'hes-routine',
		intervalMonths: null,
		description:
			'Worst-eye maculopathy M1, or retinopathy R3S (stable proliferative) — routine referral to hospital eye service.',
		evaluate: (ctx) => ctx.worstMaculopathy === 'M1' || ctx.worstRetinopathy === 'R3S'
	},

	// ─── 3. UNGRADABLE — SLIT-LAMP ─────────────────────────────────
	{
		id: 'R-RECALL-UNGRADABLE-01',
		stage: 'ungradable',
		category: 'ungradable',
		outcome: 'refer-slit-lamp',
		referral: 'slit-lamp',
		intervalMonths: null,
		description:
			'An eye is ungradable and no referable disease routes to HES — re-screen or refer for slit-lamp biomicroscopy.',
		evaluate: (ctx) => ctx.anyUngradable
	},

	// ─── 4. PRE-PROLIFERATIVE — 6-MONTH SURVEILLANCE ───────────────
	{
		id: 'R-RECALL-R2-01',
		stage: 'recall',
		category: 'surveillance',
		outcome: 'surveillance-6-month',
		referral: 'none',
		intervalMonths: 6,
		description:
			'Worst-eye retinopathy R2 (pre-proliferative), no maculopathy / proliferative / ungradable — 6-monthly digital surveillance.',
		evaluate: (ctx) => ctx.worstRetinopathy === 'R2'
	},

	// ─── 5. BACKGROUND — 12-MONTH ROUTINE ──────────────────────────
	{
		id: 'R-RECALL-R1-01',
		stage: 'recall',
		category: 'routine',
		outcome: 'routine-12-month',
		referral: 'none',
		intervalMonths: 12,
		description:
			'Worst-eye retinopathy R1 (background) — routine 12-monthly digital screening.',
		evaluate: (ctx) => ctx.worstRetinopathy === 'R1'
	},

	// ─── 6. NO RETINOPATHY, LOW-RISK — 24-MONTH ROUTINE ────────────
	{
		id: 'R-RECALL-R0-LOWRISK-01',
		stage: 'recall',
		category: 'routine',
		outcome: 'routine-24-month',
		referral: 'none',
		intervalMonths: 24,
		description:
			'Both eyes R0/M0 and the previous screen was also R0/M0 — routine 24-monthly (extended, low-risk) screening.',
		evaluate: (ctx) => ctx.worstRetinopathy === 'R0' && ctx.lowRiskEligible
	},

	// ─── 7. NO RETINOPATHY, NOT LOW-RISK — 12-MONTH ROUTINE ─────────
	{
		id: 'R-RECALL-R0-01',
		stage: 'recall',
		category: 'routine',
		outcome: 'routine-12-month',
		referral: 'none',
		intervalMonths: 12,
		description:
			'Worst-eye retinopathy R0 but not eligible for extended low-risk recall — routine 12-monthly digital screening.',
		evaluate: () => true
	}
];
