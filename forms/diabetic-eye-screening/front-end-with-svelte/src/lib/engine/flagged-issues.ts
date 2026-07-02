import type { AssessmentData, FlaggedIssue, RetinopathyGrade, Status } from './types';

/** The grade summary the flag detector reads (produced by the grader). */
export interface GradeSummary {
	status: Status;
}

/** Whole months between two date strings (b - a); null when either unparseable. */
function monthsBetween(aStr: string, bStr: string): number | null {
	if (!aStr || !bStr) return null;
	const a = new Date(aStr);
	const b = new Date(bStr);
	if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
	return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

/** True when either eye carries the given retinopathy grade. */
function eitherEyeR(data: AssessmentData, grade: RetinopathyGrade): boolean {
	return data.rightEye.retinopathy === grade || data.leftEye.retinopathy === grade;
}

/**
 * Detect clinician-facing safety flags, computed INDEPENDENTLY of the recall /
 * referral pathway (which the grader produces), per spec §5:
 *
 *   - Active proliferative retinopathy (high)   — any eye R3A
 *   - Maculopathy referral (high)               — any eye M1
 *   - Stable proliferative retinopathy (high)   — any eye R3S
 *   - Pre-proliferative retinopathy (medium)    — any eye R2
 *   - Ungradable images (medium)                — any eye U
 *   - Patient overdue (medium)                  — previous screen beyond interval
 *   - Incomplete grading (low)                  — an eye's R/M grade missing, not ungradable
 *   - Eligibility (low)                         — age band < 12, or diabetes type unknown
 *
 * Rows mirror the `diabetic_eye_screening_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, grade: GradeSummary): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	// ─── Active proliferative retinopathy (HIGH) ────────────────
	if (eitherEyeR(data, 'R3A')) {
		flags.push({
			id: 'F-ACTIVE-PROLIFERATIVE-001',
			category: 'active-proliferative',
			priority: 'high',
			description:
				'Active proliferative diabetic retinopathy (R3A) in at least one eye — sight-threatening disease.',
			suggestedAction:
				'Refer urgently / fast-track to ophthalmology (hospital eye service).'
		});
	}

	// ─── Maculopathy referral (HIGH) ────────────────────────────
	if (data.rightEye.maculopathy === 'M1' || data.leftEye.maculopathy === 'M1') {
		flags.push({
			id: 'F-MACULOPATHY-001',
			category: 'maculopathy',
			priority: 'high',
			description: 'Diabetic maculopathy (M1) in at least one eye — referable disease.',
			suggestedAction: 'Refer to the hospital eye service for assessment of maculopathy.'
		});
	}

	// ─── Stable proliferative retinopathy (HIGH) ────────────────
	if (eitherEyeR(data, 'R3S')) {
		flags.push({
			id: 'F-STABLE-PROLIFERATIVE-001',
			category: 'stable-proliferative',
			priority: 'high',
			description:
				'Stable (treated) proliferative diabetic retinopathy (R3S) in at least one eye.',
			suggestedAction: 'Refer to / keep under hospital eye service surveillance.'
		});
	}

	// ─── Pre-proliferative retinopathy (MEDIUM) ─────────────────
	if (eitherEyeR(data, 'R2')) {
		flags.push({
			id: 'F-PRE-PROLIFERATIVE-001',
			category: 'pre-proliferative',
			priority: 'medium',
			description: 'Pre-proliferative diabetic retinopathy (R2) in at least one eye.',
			suggestedAction:
				'Place on 6-monthly digital surveillance and monitor for progression.'
		});
	}

	// ─── Ungradable images (MEDIUM) ─────────────────────────────
	if (data.rightEye.ungradable === 'yes' || data.leftEye.ungradable === 'yes') {
		flags.push({
			id: 'F-UNGRADABLE-001',
			category: 'ungradable',
			priority: 'medium',
			description:
				'Retinal images for at least one eye are ungradable — a grade cannot be assigned.',
			suggestedAction:
				'Re-screen or refer for slit-lamp biomicroscopy to obtain a gradable assessment.'
		});
	}

	// ─── Patient overdue (MEDIUM) ───────────────────────────────
	const gapMonths = monthsBetween(
		data.identification.previousScreenDate,
		data.context.gradedAt || new Date().toISOString().slice(0, 10)
	);
	if (gapMonths !== null && gapMonths > 12) {
		flags.push({
			id: 'F-PATIENT-OVERDUE-001',
			category: 'patient-overdue',
			priority: 'medium',
			description: `The previous screen was ${gapMonths} months before this grading — beyond the recommended recall interval.`,
			suggestedAction:
				'Confirm the recall interval and follow up any missed screening episodes.'
		});
	}

	// ─── Incomplete grading (LOW) ───────────────────────────────
	if (grade.status === 'incomplete') {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description:
				'An eye is missing an R or M grade and is not marked ungradable — the outcome may understate risk.',
			suggestedAction:
				'Complete the retinopathy and maculopathy grade for each eye, or mark it ungradable.'
		});
	}

	// ─── Eligibility (LOW) ──────────────────────────────────────
	if (
		data.identification.ageBand === 'under-12' ||
		data.identification.diabetesType === 'unknown'
	) {
		flags.push({
			id: 'F-ELIGIBILITY-001',
			category: 'eligibility',
			priority: 'low',
			description:
				'Patient may be outside programme eligibility (age band under 12, or diabetes status not confirmed).',
			suggestedAction:
				'Confirm the patient is a person with diabetes aged 12 or over before routine screening.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
