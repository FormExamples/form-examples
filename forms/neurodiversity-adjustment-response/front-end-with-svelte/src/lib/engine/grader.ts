import type {
	NeurodiversityAdjustmentResponse,
	GradingResult,
	LegalRiskBand,
	Recommendation,
	FollowUpUrgency,
	OverallDecision,
	FiredRule
} from './types';
import { classifyOutcome } from './outcome-rules';
import { gradeLegalRisk } from './legal-risk-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeFollowUp } from './follow-up-rules';
import { detectFlags } from './flags';
import { anyAgreed, recommendationLabel } from './utils';

/**
 * Pure four-axis grading engine for a neurodiversity reasonable-adjustments
 * response (UK Equality Act 2010 / ACAS).
 *
 * Computes:
 * - Axis A: outcome classification (fully-agreed / partially-agreed /
 *   alternative-offered / declined / deferred).
 * - Axis B: legal / discrimination risk band (ok / caution / high-risk).
 * - Axis C: response completeness percent (0–100, weighted).
 * - Axis D: follow-up / review urgency + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and
 * compliance-and-risk flags.
 *
 * Invariant: declining adjustments for a worker likely covered by the Equality
 * Act without an adequate reasonableness justification or alternatives drives
 * Axis B to high-risk, raises the discrimination-risk flag, and auto-escalates
 * Axis D. The least-alarming band is chosen only when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(response: NeurodiversityAdjustmentResponse): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = classifyOutcome(response);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeLegalRisk(response);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(response);
	firedRules.push(...c.firedRules);

	// Axis D (depends on the legal-risk band)
	const d = gradeFollowUp(response, b.legalRiskBand);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(response, b.legalRiskBand, d.followUpUrgency);

	const flags = detectFlags(response, b.legalRiskBand, c.completenessPercent);

	return {
		outcomeClassification: a.outcomeClassification,
		legalRiskBand: b.legalRiskBand,
		completenessPercent: c.completenessPercent,
		followUpUrgency: d.followUpUrgency,
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
 * `followUpUrgency` is accepted for parity with the other stacks even though the
 * spec's recommendation ladder keys off escalation, legal risk, agreed-without-
 * review, and deferred-without-OH.
 */
function deriveRecommendation(
	r: NeurodiversityAdjustmentResponse,
	legalRiskBand: LegalRiskBand,
	_followUpUrgency: FollowUpUrgency
): Recommendation {
	if (r.escalated) return 'escalate-to-hr';
	if (legalRiskBand === 'high-risk') return 'reconsider-decision';
	if (anyAgreed(r) && r.reviewScheduled === false) return 'schedule-review';
	const deferred: OverallDecision = 'deferred';
	if (r.overallDecision === deferred && r.occupationalHealthReferred === false) {
		return 'seek-occupational-health';
	}
	return 'implement';
}
