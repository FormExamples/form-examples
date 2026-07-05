import type {
	NeurodiversityAdjustmentReview,
	GradingResult,
	EffectivenessBand,
	WellbeingRiskBand,
	Recommendation,
	FiredRule
} from './types';
import { classifyEffectiveness } from './effectiveness-rules';
import { gradeWellbeing } from './wellbeing-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeNextStep } from './next-step-rules';
import { detectFlags } from './flags';
import { anyNotWorking, recommendationLabel } from './utils';

/**
 * Pure four-axis grading engine for a neurodiversity reasonable-adjustments
 * review (UK Equality Act 2010 / ACAS).
 *
 * Computes:
 * - Axis A: overall effectiveness band (effective / partially-effective /
 *   ineffective / not-yet-assessed).
 * - Axis B: wellbeing risk band (ok / caution / high-risk).
 * - Axis C: review completeness percent (0–100, weighted).
 * - Axis D: next-step urgency + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and
 * compliance-and-risk flags.
 *
 * Invariant: any adjustment reported not-working, a dissatisfied worker,
 * declining wellbeing, or an escalation drives Axis B toward high-risk, raises
 * the corresponding flag, and auto-raises Axis D. The least-alarming band is
 * chosen only when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(review: NeurodiversityAdjustmentReview): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = classifyEffectiveness(review);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeWellbeing(review);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(review);
	firedRules.push(...c.firedRules);

	// Axis D (depends on the wellbeing-risk band)
	const d = gradeNextStep(review, b.wellbeingRiskBand);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(review, a.effectivenessBand, b.wellbeingRiskBand);

	const flags = detectFlags(review, c.completenessPercent);

	return {
		effectivenessBand: a.effectivenessBand,
		wellbeingRiskBand: b.wellbeingRiskBand,
		completenessPercent: c.completenessPercent,
		nextStepUrgency: d.nextStepUrgency,
		targetTimeframe: d.targetTimeframe,
		recommendation,
		recommendationLabel: recommendationLabel(recommendation),
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall recommendation. First match wins, per the engine spec.
 */
function deriveRecommendation(
	r: NeurodiversityAdjustmentReview,
	effectivenessBand: EffectivenessBand,
	wellbeingRiskBand: WellbeingRiskBand
): Recommendation {
	if (r.escalated) return 'escalate-to-hr';
	if (effectivenessBand === 'ineffective' && r.occupationalHealthRereferral === false) {
		return 'seek-occupational-health';
	}
	if (wellbeingRiskBand === 'high-risk' || anyNotWorking(r) || r.changesNeeded === true) {
		return 'adjust-adjustments';
	}
	if (r.nextReviewDate.trim() === '') return 'schedule-next-review';
	return 'maintain';
}
