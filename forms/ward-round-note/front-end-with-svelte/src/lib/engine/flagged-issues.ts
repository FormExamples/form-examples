// Flagged-issue detection (safety flags). Independent of the completeness
// status (which the grader produces), this module raises clinician-facing
// safety flags per spec §5, each with a priority.
//
//   - Deteriorating NEWS2 — escalation needed (high) — NEWS2 total >= 5, or a
//     single parameter scoring 3, or a deteriorating trend, with no escalation
//     action recorded in the plan/jobs or escalation status.
//   - VTE assessment not done (high)                — vteStatus == 'not-done'.
//   - No plan or jobs documented (high)             — planAndJobs empty.
//   - Abnormal results not actioned (medium)        — an abnormal result is
//     flagged but no action is recorded.
//   - No senior review when required (medium)       — a deteriorating patient or
//     a ceiling-of-care decision with no senior grade named on the entry.
//   - Incomplete entry (low)                        — a required component absent.
//
// Categories mirror the `ward_round_note_grade_flag` SQL CHECK constraint
// (deteriorating-news2-escalation, vte-not-done, no-plan-jobs,
// abnormal-results-not-actioned, no-senior-review, incomplete-entry, other).

import type { AssessmentData, FlaggedIssue } from './types';
import { has } from './ward-round-rules';

/**
 * Detect the safety flags raised by the note. Computed INDEPENDENTLY of the
 * completeness status (spec §5). `grade` supplies the required-component tally
 * already computed by the grader.
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { documentedRequired: number; totalRequired: number }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const ex = data.examination;
	const inv = data.investigations;
	const esc = data.escalation;
	const planDocumented = has(data.plan.planAndJobs);
	const escalationDocumented =
		has(esc.escalationStatus) && esc.escalationStatus !== 'not-recorded';

	const deteriorating =
		(ex.news2Total !== null && ex.news2Total >= 5) ||
		ex.news2SingleParamThree === 'yes' ||
		ex.observationTrend === 'deteriorating';
	// An escalation action is recorded when the plan/jobs are documented or a
	// concrete escalation / ceiling-of-care status is recorded.
	const escalationActionRecorded = planDocumented || escalationDocumented;

	// ─── Deteriorating NEWS2 — escalation needed (HIGH) ────────
	if (deteriorating && !escalationActionRecorded) {
		flags.push({
			id: 'F-DETERIORATING-NEWS2-001',
			category: 'deteriorating-news2-escalation',
			priority: 'high',
			description:
				'The patient is deteriorating (NEWS2 at or above the escalation threshold, a single parameter scoring 3, or a deteriorating trend) but no escalation action is documented',
			suggestedAction:
				'Escalate to the senior clinician on call and record the escalation plan and jobs.'
		});
	}

	// ─── VTE assessment not done (HIGH) ────────────────────────
	if (data.vte.vteStatus === 'not-done') {
		flags.push({
			id: 'F-VTE-NOT-DONE-001',
			category: 'vte-not-done',
			priority: 'high',
			description: 'The VTE assessment is recorded as not done',
			suggestedAction:
				'Complete the VTE risk assessment and prescribe prophylaxis where indicated.'
		});
	}

	// ─── No plan or jobs documented (HIGH) ─────────────────────
	if (!planDocumented) {
		flags.push({
			id: 'F-NO-PLAN-JOBS-001',
			category: 'no-plan-jobs',
			priority: 'high',
			description: 'No plan or jobs for the day are documented',
			suggestedAction:
				'Record the plan and jobs so the entry can safely guide the rest of the shift.'
		});
	}

	// ─── Abnormal results not actioned (MEDIUM) ────────────────
	if (inv.abnormalResultFlagged === 'yes' && inv.abnormalResultActioned !== 'yes') {
		flags.push({
			id: 'F-ABNORMAL-RESULTS-001',
			category: 'abnormal-results-not-actioned',
			priority: 'medium',
			description:
				'An abnormal or critical investigation result is flagged but no corresponding action is recorded',
			suggestedAction:
				'Record the action taken for the abnormal result, or add it to the plan and jobs.'
		});
	}

	// ─── No senior review when required (MEDIUM) ───────────────
	const seniorReviewRequired =
		ex.observationTrend === 'deteriorating' ||
		esc.escalationStatus === 'dnacpr' ||
		esc.escalationStatus === 'ward-level-ceiling';
	if (seniorReviewRequired && esc.seniorReviewPresent !== 'yes') {
		flags.push({
			id: 'F-NO-SENIOR-REVIEW-001',
			category: 'no-senior-review',
			priority: 'medium',
			description:
				esc.escalationStatus === 'dnacpr' || esc.escalationStatus === 'ward-level-ceiling'
					? 'A ceiling-of-care decision is recorded but no consultant or senior grade is named on the entry'
					: 'The patient is deteriorating but no consultant or senior grade is named on the entry',
			suggestedAction: 'Obtain and document a senior / consultant review of this entry.'
		});
	}

	// ─── Incomplete entry (LOW) ────────────────────────────────
	if (grade.documentedRequired < grade.totalRequired) {
		flags.push({
			id: 'F-INCOMPLETE-ENTRY-001',
			category: 'incomplete-entry',
			priority: 'low',
			description:
				'One or more required components are absent — the entry is not fully documented',
			suggestedAction:
				'Complete the outstanding required components so the ward round note is whole.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

	return flags;
}
