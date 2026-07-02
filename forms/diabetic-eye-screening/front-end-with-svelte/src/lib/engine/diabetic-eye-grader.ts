import type { AssessmentData, EyeGrade, FiredRule, GradingResult, Status } from './types';
import { classificationRules, deriveContext } from './diabetic-eye-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Completeness of one eye's grading: it must carry an R and an M grade, unless
 * it is explicitly marked ungradable.
 */
export function eyeComplete(eye: EyeGrade): boolean {
	if (eye.ungradable === 'yes') return true;
	return eye.retinopathy !== '' && eye.maculopathy !== '';
}

/**
 * Completeness status: complete when both eyes have an R and M grade (or are
 * marked ungradable); otherwise incomplete.
 */
export function computeStatus(d: AssessmentData): Status {
	return eyeComplete(d.rightEye) && eyeComplete(d.leftEye) ? 'complete' : 'incomplete';
}

/**
 * Pure function: compute the full diabetic-eye-screening classification for the
 * supplied screening data. The engine first derives the worst-eye summary
 * across both eyes, then applies the gated first-match classification cascade in
 * `classificationRules`. This is a result-classification outcome, NOT a numeric
 * score, cut-off, or band table.
 *
 * Classification algorithm (spec §4). Retinopathy severity ranks
 * R0 < R1 < R2 < R3S < R3A. Take the worst R and M grade across both eyes plus
 * any ungradable marker, then map to a recall / referral pathway by clinical
 * urgency (most urgent wins):
 *   worstRetinopathy == 'R3A'                              -> refer-hes-urgent     (null)
 *   worstMaculopathy == 'M1' || worstRetinopathy == 'R3S'  -> refer-hes            (null)
 *   anyUngradable                                          -> refer-slit-lamp      (null)
 *   worstRetinopathy == 'R2'                               -> surveillance-6-month (6)
 *   worstRetinopathy == 'R1'                               -> routine-12-month     (12)
 *   worstRetinopathy == 'R0' && lowRiskEligible            -> routine-24-month     (24)
 *   otherwise (R0, not low-risk eligible)                  -> routine-12-month     (12)
 */
export function calculateGrade(data: AssessmentData): GradingResult {
	const timestamp = new Date().toISOString();
	const ctx = deriveContext(data);

	let winner = classificationRules[classificationRules.length - 1];
	for (const rule of classificationRules) {
		try {
			if (rule.evaluate(ctx)) {
				winner = rule;
				break;
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Diabetic-eye-screening rule ${rule.id} evaluation failed:`, e);
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

	return {
		rightEyeGrade: data.rightEye,
		leftEyeGrade: data.leftEye,
		worstRetinopathy: ctx.worstRetinopathy,
		worstMaculopathy: ctx.worstMaculopathy,
		anyUngradable: ctx.anyUngradable,
		recallPathway: winner.outcome,
		recallIntervalMonths: winner.intervalMonths,
		referral: winner.referral,
		status,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, { status }),
		timestamp
	};
}
