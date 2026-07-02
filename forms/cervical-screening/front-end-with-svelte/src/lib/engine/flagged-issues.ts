import type { AssessmentData, FlaggedIssue, ManagementAction, ResultClass, Status } from './types';
import { GRADED_CYTOLOGY, MIN_AGE, MAX_AGE } from './cervical-screening-rules';

/** The grade summary the flag detector reads (produced by the grader). */
export interface GradeSummary {
	resultClass: ResultClass;
	managementAction: ManagementAction;
	status: Status;
}

/** Is a date string strictly in the past (before today)? */
function isPast(dateStr: string): boolean {
	if (!dateStr) return false;
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return false;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return d.getTime() < today.getTime();
}

/**
 * Detect clinician-facing safety flags, computed INDEPENDENTLY of the result
 * class (which the grader produces), per spec §5:
 *
 *   - Urgent colposcopy (high)              — HPV positive + high-grade cytology
 *   - Symptomatic, refer regardless (high)  — symptomatic == 'yes' (NG12 pathway)
 *   - Missing consent (high)                — consentGiven != 'yes'
 *   - Inadequate sample (medium)            — sampleAdequacy == 'inadequate'
 *   - HPV positive, cytology outstanding    — HPV positive + cytology not graded (medium)
 *   - Patient overdue (medium)              — overdue == 'yes' or screenDueDate in the past
 *   - Age outside eligible range (medium)   — age < 25 or age > 64
 *   - Incomplete record (low)               — grade.status == 'incomplete'
 *
 * Rows mirror the `cervical_screening_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, grade: GradeSummary): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const age = data.identification.age;
	const hpv = data.hpv.hpvResult;
	const cytology = data.cytology.cytologyGrade;

	// ─── Urgent colposcopy (HIGH) ───────────────────────────────
	if (hpv === 'positive' && cytology === 'high-grade') {
		flags.push({
			id: 'F-URGENT-COLPOSCOPY-001',
			category: 'urgent-colposcopy',
			priority: 'high',
			description:
				'hrHPV positive with high-grade dyskaryosis — high risk of significant cervical intraepithelial neoplasia.',
			suggestedAction:
				'Refer urgently for colposcopy (suspected-cancer / two-week-wait pathway per local policy).'
		});
	}

	// ─── Symptomatic — refer regardless of screen (HIGH) ────────
	if (data.symptoms.symptomatic === 'yes') {
		flags.push({
			id: 'F-SYMPTOMATIC-REFER-REGARDLESS-001',
			category: 'symptomatic-refer-regardless',
			priority: 'high',
			description:
				'Patient reports symptoms (abnormal bleeding, discharge, or pain). A negative screen does not exclude cancer in a symptomatic person.',
			suggestedAction:
				'Manage symptoms on the symptomatic (NICE NG12) pathway irrespective of the screening result.'
		});
	}

	// ─── Missing consent (HIGH) ─────────────────────────────────
	if (data.consent.consentGiven !== 'yes') {
		flags.push({
			id: 'F-MISSING-CONSENT-001',
			category: 'missing-consent',
			priority: 'high',
			description:
				'Informed consent to take the sample and process the result is not recorded as given.',
			suggestedAction: 'Do not report the result until informed consent is recorded.'
		});
	}

	// ─── Inadequate sample (MEDIUM) ─────────────────────────────
	if (data.adequacy.sampleAdequacy === 'inadequate') {
		flags.push({
			id: 'F-INADEQUATE-SAMPLE-001',
			category: 'inadequate-sample',
			priority: 'medium',
			description:
				'The cytology sample is inadequate / unsatisfactory and cannot be tested.',
			suggestedAction:
				'Repeat the sample in ~3 months. Three consecutive inadequate samples escalate to colposcopy.'
		});
	}

	// ─── HPV positive, cytology outstanding (MEDIUM) ────────────
	if (hpv === 'positive' && GRADED_CYTOLOGY.indexOf(cytology) === -1) {
		flags.push({
			id: 'F-CYTOLOGY-OUTSTANDING-001',
			category: 'cytology-outstanding',
			priority: 'medium',
			description:
				'hrHPV positive but reflex cytology has not yet been graded — the result is not classifiable.',
			suggestedAction:
				'Ensure reflex cytology is performed and graded on the HPV-positive sample.'
		});
	}

	// ─── Patient overdue (MEDIUM) ───────────────────────────────
	if (data.eligibility.overdue === 'yes' || isPast(data.eligibility.screenDueDate)) {
		flags.push({
			id: 'F-PATIENT-OVERDUE-001',
			category: 'patient-overdue',
			priority: 'medium',
			description:
				'Screening is overdue (recorded as overdue or the screen-due date has passed).',
			suggestedAction: 'Prioritise recall and follow up any non-attendance.'
		});
	}

	// ─── Age outside eligible range (MEDIUM) ────────────────────
	if (age !== null && (age < MIN_AGE || age > MAX_AGE)) {
		flags.push({
			id: 'F-AGE-OUTSIDE-RANGE-001',
			category: 'age-outside-range',
			priority: 'medium',
			description: `Patient age ${age} is outside the routine ${MIN_AGE}-${MAX_AGE} screening range.`,
			suggestedAction:
				'Confirm eligibility; a routine screen is not indicated outside the programme age range.'
		});
	}

	// ─── Incomplete record (LOW) ────────────────────────────────
	if (grade.status === 'incomplete') {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description:
				'The record is incomplete: eligibility, consent, adequacy, or the required result field for the reached branch is missing.',
			suggestedAction:
				'Complete the outstanding field(s) so the result can be classified and reported.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
