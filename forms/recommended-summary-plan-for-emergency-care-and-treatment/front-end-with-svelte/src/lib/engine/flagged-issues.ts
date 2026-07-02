import type { AssessmentData, FlaggedIssue } from './types';

const nonEmpty = (s: string): boolean => typeof s === 'string' && s.trim() !== '';

/**
 * Parse an ISO date string (yyyy-mm-dd or full ISO) into a Date at local
 * midnight, or null when unparseable / empty.
 */
function parseDate(value: string): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d;
}

/**
 * Detect clinician-facing safety and governance flags. Independent of the
 * completeness status the grader produces (spec §5):
 *
 *   - CPR recommendation not documented (high) — no attempt / do-not-attempt.
 *   - Capacity assessment missing (high)        — person lacks capacity but no
 *                                                 assessment / proxy recorded.
 *   - No clinician signature (high)             — plan unsigned / undated.
 *   - DNACPR without documented discussion (high) — do-not-attempt-CPR with no
 *                                                 record of discussion.
 *   - Review date passed (medium)               — planned review date in the past.
 *   - Summary of health missing (low)           — no clinical summary recorded.
 *
 * Rows mirror the `respect_grade_flag` SQL table (flag_id, category, priority,
 * description, suggested_action). `today` is injectable for deterministic tests.
 */
export function detectFlaggedIssues(plan: AssessmentData, today?: Date): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const now = today instanceof Date ? today : new Date();

	const cpr = plan.cpr.cprRecommendation;
	const hasCapacity = plan.capacity.hasCapacity;

	// ─── CPR recommendation not documented (HIGH) ───────────────
	if (cpr !== 'attempt' && cpr !== 'do-not-attempt') {
		flags.push({
			id: 'F-CPR-NOT-DOCUMENTED-001',
			category: 'cpr-not-documented',
			priority: 'high',
			description:
				'No CPR recommendation recorded — the single most safety-critical omission; it is unclear whether CPR should be attempted.',
			suggestedAction:
				'Record an explicit CPR recommendation (attempt or do-not-attempt) with its clinical rationale.'
		});
	}

	// ─── Capacity assessment missing (HIGH) ─────────────────────
	if (
		hasCapacity === 'no' &&
		(!nonEmpty(plan.capacity.capacityAssessment) ||
			!nonEmpty(plan.capacity.involvement) ||
			plan.capacity.involvement === 'person')
	) {
		flags.push({
			id: 'F-CAPACITY-MISSING-001',
			category: 'capacity-missing',
			priority: 'high',
			description:
				'The person is recorded as lacking capacity but no capacity assessment or legal-proxy / consultee involvement is documented (Mental Capacity Act 2005).',
			suggestedAction:
				'Document the capacity assessment and record the welfare attorney, court-appointed deputy, or consultees involved in the best-interests decision.'
		});
	}

	// ─── No clinician signature (HIGH) ──────────────────────────
	if (!nonEmpty(plan.signOff.signature) || !nonEmpty(plan.signOff.signedAt)) {
		flags.push({
			id: 'F-NO-SIGNATURE-001',
			category: 'no-clinician-signature',
			priority: 'high',
			description:
				'The plan is unsigned or undated, so it is not valid and should not be relied upon.',
			suggestedAction:
				'The completing clinician should sign and date the plan, recording their name, role, and registration.'
		});
	}

	// ─── DNACPR without documented discussion (HIGH) ────────────
	if (cpr === 'do-not-attempt' && plan.cpr.cprDiscussed !== 'yes') {
		flags.push({
			id: 'F-DNACPR-NO-DISCUSSION-001',
			category: 'dnacpr-without-discussion',
			priority: 'high',
			description:
				'A do-not-attempt-CPR recommendation is recorded but there is no record of discussion with the person or, where they lack capacity, their legal proxy or those close to them.',
			suggestedAction:
				'Record the discussion held with the person or their proxy, or the reason a discussion was not appropriate.'
		});
	}

	// ─── Review date passed (MEDIUM) ────────────────────────────
	const reviewDate = parseDate(plan.signOff.reviewDate);
	if (reviewDate !== null) {
		const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const reviewMidnight = new Date(
			reviewDate.getFullYear(),
			reviewDate.getMonth(),
			reviewDate.getDate()
		);
		if (reviewMidnight < todayMidnight) {
			flags.push({
				id: 'F-REVIEW-DATE-PASSED-001',
				category: 'review-date-passed',
				priority: 'medium',
				description:
					'The planned review date is in the past — the plan may no longer reflect the person’s wishes or condition.',
				suggestedAction:
					'Review the plan with the person (or their proxy) and record a new review date.'
			});
		}
	}

	// ─── Summary of health missing (LOW) ────────────────────────
	if (!nonEmpty(plan.health.healthSummary)) {
		flags.push({
			id: 'F-HEALTH-SUMMARY-MISSING-001',
			category: 'health-summary-missing',
			priority: 'low',
			description:
				'No summary of relevant health is recorded, so the recommendations lack clinical context.',
			suggestedAction: 'Add a brief clinical summary and the relevant diagnoses.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
