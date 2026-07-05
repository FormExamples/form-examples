import type { NeurodiversityAdjustmentResponse, LegalRiskBand, Flag, FlagPriority } from './types';
import { anyAgreed, daysBetween } from './utils';

/** Working days threshold above which the response counts as unduly delayed. */
const UNDUE_DELAY_DAYS = 20;

/**
 * Detects compliance / risk flags independently of the four axes. Flag
 * categories mirror
 * sql/07_create_table_neurodiversity_adjustment_response_grade_flag.sql.
 *
 * The `legalRiskBand` and `completenessPercent` are passed in so the
 * discrimination-risk and incomplete-response flags stay in lock-step with the
 * axes that computed them. Flags are returned sorted high → medium → low.
 */
export function detectFlags(
	r: NeurodiversityAdjustmentResponse,
	legalRiskBand: LegalRiskBand,
	completenessPercent: number
): Flag[] {
	const flags: Flag[] = [];
	const declined = r.overallDecision === 'declined';

	// ─── discrimination-risk (auto-raised with a high-risk legal band) ───
	if (legalRiskBand === 'high-risk') {
		flags.push({
			flagId: 'F-DISCRIMINATION-RISK-001',
			category: 'discrimination-risk',
			priority: 'high',
			description:
				'Adjustments declined for a worker likely covered by the Equality Act 2010 without adequate justification or alternatives.',
			suggestedAction:
				'Reconsider the decision, or record a reasonableness justification and offer alternatives before finalising.'
		});
	}

	// ─── grievance-escalation ───
	if (r.escalated) {
		flags.push({
			flagId: 'F-GRIEVANCE-001',
			category: 'grievance-escalation',
			priority: 'high',
			description: 'Matter escalated (dispute / grievance / appeal).',
			suggestedAction: 'Engage HR and follow the grievance / appeal procedure.'
		});
	}

	// ─── undue-delay ───
	const gap = daysBetween(r.assessedDate, r.respondedDate);
	if (gap !== null && gap > UNDUE_DELAY_DAYS) {
		flags.push({
			flagId: 'F-UNDUE-DELAY-001',
			category: 'undue-delay',
			priority: 'medium',
			description: 'More than 20 working days between assessment and response.',
			suggestedAction:
				'The Equality Act duty is to act without unreasonable delay; expedite.'
		});
	}

	// ─── no-review-scheduled ───
	if (anyAgreed(r) && r.reviewScheduled === false) {
		flags.push({
			flagId: 'F-NO-REVIEW-001',
			category: 'no-review-scheduled',
			priority: 'medium',
			description: 'Adjustments agreed but no review date set.',
			suggestedAction: 'Schedule a review to check the adjustments are working.'
		});
	}

	// ─── no-trial-defined ───
	if (r.trialPeriod === true && (r.trialPeriodWeeks === null || r.trialPeriodWeeks === 0)) {
		flags.push({
			flagId: 'F-NO-TRIAL-001',
			category: 'no-trial-defined',
			priority: 'low',
			description: 'Trial adjustments without a defined trial period.',
			suggestedAction: 'Set a trial length and a review date.'
		});
	}

	// ─── missing-rationale ───
	if (r.overallDecision !== '' && r.overallDecision !== 'agreed' && r.decisionRationale.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-RATIONALE-001',
			category: 'missing-rationale',
			priority: declined ? 'high' : 'medium',
			description: 'A decision was recorded without a rationale.',
			suggestedAction:
				'Record why the decision was reached, especially where anything was declined.'
		});
	}

	// ─── incomplete-response ───
	if (completenessPercent < 60) {
		flags.push({
			flagId: 'F-INCOMPLETE-001',
			category: 'incomplete-response',
			priority: 'medium',
			description: 'Mandatory response sections are missing.',
			suggestedAction:
				'Complete the decision, rationale, review arrangements, and point of contact.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
