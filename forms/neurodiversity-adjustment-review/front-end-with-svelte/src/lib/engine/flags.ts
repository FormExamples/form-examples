import type { NeurodiversityAdjustmentReview, Flag, FlagPriority } from './types';
import { anyNotWorking } from './utils';

/**
 * Detects compliance / risk flags independently of the four axes. Flag
 * categories mirror
 * sql/07_create_table_neurodiversity_adjustment_review_grade_flag.sql.
 *
 * The `completenessPercent` is passed in so the incomplete-review flag stays in
 * lock-step with the axis that computed it. Flags are returned sorted
 * high → medium → low.
 */
export function detectFlags(
	r: NeurodiversityAdjustmentReview,
	completenessPercent: number
): Flag[] {
	const flags: Flag[] = [];

	// ─── adjustments-not-working (the primary review alert) ───
	if (anyNotWorking(r)) {
		flags.push({
			flagId: 'F-ADJUSTMENTS-NOT-WORKING-001',
			category: 'adjustments-not-working',
			priority: 'high',
			description: 'An agreed adjustment is no longer working.',
			suggestedAction:
				'Act promptly; update the adjustment or consider an occupational-health re-referral.'
		});
	}

	// ─── worker-dissatisfied ───
	if (r.workerSatisfied === 'no') {
		flags.push({
			flagId: 'F-WORKER-DISSATISFIED-001',
			category: 'worker-dissatisfied',
			priority: 'high',
			description: 'The worker is not satisfied the adjustments meet their needs.',
			suggestedAction: 'Explore what would work with the worker.'
		});
	} else if (r.workerSatisfied === 'partially') {
		flags.push({
			flagId: 'F-WORKER-DISSATISFIED-001',
			category: 'worker-dissatisfied',
			priority: 'medium',
			description: 'The worker is only partially satisfied.',
			suggestedAction: 'Explore improvements with the worker.'
		});
	}

	// ─── wellbeing-declined ───
	if (r.wellbeingChange === 'worse') {
		flags.push({
			flagId: 'F-WELLBEING-DECLINED-001',
			category: 'wellbeing-declined',
			priority: 'high',
			description: "The worker's wellbeing has worsened since the adjustments.",
			suggestedAction: 'Review the adjustments and consider occupational-health input.'
		});
	}

	// ─── changes-outstanding ───
	if (r.changesNeeded === true && r.changesDetail.trim() === '') {
		flags.push({
			flagId: 'F-CHANGES-OUTSTANDING-001',
			category: 'changes-outstanding',
			priority: 'medium',
			description: 'Changes are needed but not yet detailed.',
			suggestedAction: 'Record and action the required changes.'
		});
	}

	// ─── no-next-review ───
	if (r.nextReviewDate.trim() === '') {
		flags.push({
			flagId: 'F-NO-NEXT-REVIEW-001',
			category: 'no-next-review',
			priority: 'medium',
			description: 'No next review date has been set.',
			suggestedAction: 'Schedule the next review.'
		});
	}

	// ─── escalation ───
	if (r.escalated === true) {
		flags.push({
			flagId: 'F-ESCALATION-001',
			category: 'escalation',
			priority: 'high',
			description: 'The matter has been escalated.',
			suggestedAction: 'Follow the escalation / grievance procedure.'
		});
	}

	// ─── incomplete-review ───
	if (completenessPercent < 60) {
		flags.push({
			flagId: 'F-INCOMPLETE-REVIEW-001',
			category: 'incomplete-review',
			priority: 'medium',
			description: 'Mandatory review sections are missing.',
			suggestedAction:
				'Complete the effectiveness ratings, worker feedback, and next review date.'
		});
	}

	// Sort: high > medium > low (stable — preserves insertion order within a tier)
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
