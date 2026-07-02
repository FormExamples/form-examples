import type { AssessmentData, FiredRule, GradingResult, Status, Urgency } from './types';
import { mandatoryFor } from './gp-referral-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * General Practitioner Referral Letter grader. Pure functions: take a
 * `AssessmentData` referral, evaluate the mandatory-field set for the selected
 * urgency (`mandatoryFor`), and derive the completeness status, completeness
 * percentage, and echoed urgency classification.
 *
 * Grading algorithm (spec §4):
 *   mandatory  = mandatoryFor(referral)           // urgency-dependent field set
 *   present    = mandatory.filter(isPresent)
 *   completenessPercent = round(100 * present.length / mandatory.length)
 *   status     = present.length == mandatory.length ? 'Complete' : 'Incomplete'
 *   urgency    = referral.urgencyInfo.urgency      // echoed classification
 *   firedRules = each mandatory field with { satisfied: boolean }
 *
 * There is NO numeric clinical score. The engine reports; it never blocks
 * sending — the referrer decides. Urgency is always echoed, even when the
 * referral is `Incomplete`, so the pathway is never hidden by an unfinished
 * form.
 */

/**
 * Evaluate the mandatory-field set against the referral, returning one
 * FiredRule per applicable mandatory field with its satisfied state.
 */
export function evaluateRules(referral: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const field of mandatoryFor(referral)) {
		let satisfied = false;
		try {
			satisfied = field.present(referral) === true;
		} catch (e) {
			// Rule evaluation failed — log for debugging but continue grading.
			console.warn(`Referral rule ${field.id} evaluation failed:`, e);
		}
		fired.push({
			id: field.id,
			rule: field.rule,
			satisfied,
			category: field.category,
			description: field.description
		});
	}
	return fired;
}

/**
 * Count present mandatory fields over the mandatory fields that apply for the
 * selected urgency.
 */
export function completeness(referral: AssessmentData): {
	presentCount: number;
	mandatoryCount: number;
	completenessPercent: number;
	allPresent: boolean;
} {
	const mandatory = mandatoryFor(referral);
	let present = 0;
	for (const field of mandatory) {
		if (field.present(referral) === true) present++;
	}
	const mandatoryCount = mandatory.length;
	const completenessPercent =
		mandatoryCount === 0 ? 0 : Math.round((100 * present) / mandatoryCount);
	return {
		presentCount: present,
		mandatoryCount,
		completenessPercent,
		allPresent: mandatoryCount > 0 && present === mandatoryCount
	};
}

/**
 * Echo the selected urgency as the classification. The four values map directly
 * to the pathways in index.md; '' when not yet selected.
 */
export function classifyUrgency(referral: AssessmentData): Urgency {
	return referral.urgencyInfo.urgency;
}

/**
 * Pure function: compute the full completeness grade and echoed urgency for the
 * supplied referral, plus the independently-detected referral flags.
 */
export function gradeReferral(referral: AssessmentData): GradingResult {
	const firedRules = evaluateRules(referral);
	const c = completeness(referral);

	const status: Status = c.allPresent ? 'Complete' : 'Incomplete';

	return {
		status,
		urgency: classifyUrgency(referral),
		completenessPercent: c.completenessPercent,
		presentCount: c.presentCount,
		mandatoryCount: c.mandatoryCount,
		firedRules,
		flaggedIssues: detectFlaggedIssues(referral),
		timestamp: new Date().toISOString()
	};
}
