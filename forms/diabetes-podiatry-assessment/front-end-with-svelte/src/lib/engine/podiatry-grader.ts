import type { AssessmentData, FiredRule, FootExam, GradingResult, Risk, Status } from './types';
import { RISK_SEVERITY, deriveContext, reviewRules } from './podiatry-rules';
import { detectFlaggedIssues } from './flagged-issues';

// Diabetes-podiatry-assessment grader. Pure functions: take an
// `AssessmentData` object, classify each foot, derive the overall risk
// category, apply the gated first-match review-pathway cascade in
// `reviewRules`, and return the per-foot and overall risk, the review
// pathway, referral, review interval, a completeness status, and the audit
// trail of the winning rule.
//
// Classification algorithm (spec §4): per-foot risk-factor count then
// worst-foot with overrides.
//   perFootRisk(foot) — active ulcer / suspected Charcot -> active-urgent;
//     previous ulcer / amputation -> at least high; otherwise the
//     risk-factor count (0 low, 1 moderate, 2+ high).
//   overallRisk — the worse of the two feet, raised to at least high by
//     renal replacement therapy.
//   reviewPathway — urgent-mdt-referral (active-urgent), high-risk-review
//     (high; 1 month with an ulcer/amputation history, else 3 months),
//     moderate-risk-review (moderate; 6 months), annual-review (low; 12
//     months).
//
// This is a result-classification outcome, not a numeric score.

/**
 * Completeness of one foot's examination: it must carry a neuropathy status
 * and a pulses status, and both must be tested (not `not-tested` / `''`).
 */
export function footComplete(foot: FootExam): boolean {
	return (
		foot.neuropathyStatus !== '' &&
		foot.neuropathyStatus !== 'not-tested' &&
		foot.pulsesStatus !== '' &&
		foot.pulsesStatus !== 'not-tested'
	);
}

/**
 * Completeness status: complete when both feet have a neuropathy and pulses
 * status recorded (and tested); otherwise incomplete.
 */
export function computeStatus(d: AssessmentData): Status {
	return footComplete(d.rightFoot) && footComplete(d.leftFoot) ? 'complete' : 'incomplete';
}

/**
 * Overall risk: the worse of the two feet, raised to at least 'high' by
 * renal replacement therapy.
 */
export function computeOverallRisk(ctx: ReturnType<typeof deriveContext>): Risk {
	if (ctx.onRenalReplacementTherapy && RISK_SEVERITY[ctx.worstFootRisk] < RISK_SEVERITY['high']) {
		return 'high';
	}
	return ctx.worstFootRisk;
}

/**
 * Pure function: compute the full diabetes-podiatry-assessment
 * classification for the supplied assessment data.
 */
export function calculateGrade(data: AssessmentData): GradingResult {
	const timestamp = new Date().toISOString();
	const ctx = deriveContext(data);
	const overallRisk = computeOverallRisk(ctx);

	let winner = reviewRules[reviewRules.length - 1];
	for (const rule of reviewRules) {
		try {
			if (rule.evaluate(ctx)) {
				winner = rule;
				break;
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Diabetes-podiatry-assessment rule ${rule.id} evaluation failed:`, e);
		}
	}

	const status = computeStatus(data);

	const firedRules: FiredRule[] = [
		{
			id: winner.id,
			stage: winner.stage,
			category: winner.category,
			description: winner.description
		}
	];

	const result: GradingResult = {
		rightFootRisk: ctx.rightFootRisk,
		leftFootRisk: ctx.leftFootRisk,
		overallRisk,
		reviewPathway: winner.reviewPathway,
		reviewIntervalMonths: winner.intervalMonths,
		referral: winner.referral,
		status,
		firedRules,
		flaggedIssues: [],
		timestamp
	};

	result.flaggedIssues = detectFlaggedIssues(data, { status, overallRisk });

	return result;
}
