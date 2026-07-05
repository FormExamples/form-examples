import type {
	NeurodiversityAdjustmentRequest,
	GradingResult,
	Recommendation,
	ImpactBand,
	FiredRule
} from './types';
import { gradeEligibility } from './eligibility-rules';
import { gradeImpact } from './impact-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradePriority } from './priority-rules';
import { detectFlags } from './flags';
import { recommendationLabel } from './utils';

/**
 * Pure four-axis grading engine for a neurodiversity workplace
 * reasonable-adjustments request.
 *
 * Computes:
 * - Axis A: Equality Act 2010 eligibility (likely-covered / possibly-covered /
 *   unclear).
 * - Axis B: impact / wellbeing risk (ok / caution / high-risk).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: handling priority (routine / soon / urgent) + target timeframe.
 *
 * Plus an overall handling recommendation, the fired-rule audit trail, and
 * compliance-and-wellbeing flags.
 *
 * Invariant: a worker at risk of sickness absence / burnout, or reporting severe
 * current impact, drives Axis B to high-risk and auto-escalates Axis D. The
 * least-alarming band is chosen only when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: NeurodiversityAdjustmentRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = gradeEligibility(request);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeImpact(request);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D
	const d = gradePriority(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(request, c.completenessPercent, b.impactBand);

	const flags = detectFlags(request, a.eligibilityBand, b.impactBand);

	return {
		eligibilityBand: a.eligibilityBand,
		impactBand: b.impactBand,
		completenessPercent: c.completenessPercent,
		priorityTier: d.priorityTier,
		targetTimeframe: d.targetTimeframe,
		recommendation,
		recommendationLabel: recommendationLabel(recommendation),
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall handling recommendation. First match wins:
 * 1. materially incomplete → request more detail from the worker.
 * 2. high wellbeing risk without occupational-health input → seek OH assessment.
 * 3. equipment / technology adjustment without Access to Work → signpost it.
 * 4. otherwise → progress to an adjustments meeting.
 */
function deriveRecommendation(
	request: NeurodiversityAdjustmentRequest,
	completenessPercent: number,
	impactBand: ImpactBand
): Recommendation {
	if (completenessPercent < 50) return 'request-more-detail';
	if (impactBand === 'high-risk' && request.occupationalHealthInvolved === false) {
		return 'seek-occupational-health';
	}
	if (request.adjustmentEquipmentTechnology === true && request.accessToWorkInvolved === false) {
		return 'signpost-access-to-work';
	}
	return 'progress-to-meeting';
}
