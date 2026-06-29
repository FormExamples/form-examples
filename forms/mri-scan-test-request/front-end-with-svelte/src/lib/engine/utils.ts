// Display label and colour helpers for the MRI Scan Test Request engine.
//
// Colours are Lily Design System semantic tokens only (no hardcoded palette):
// success / warning / error / info / base-300, each as the
// `bg-<token> text-<token>-content border-<token>` triple.

import type {
	BodyRegion,
	Indication,
	AppropriatenessBand,
	MriSafetyBand,
	ContrastRenalFlag,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Domain value labels
// ──────────────────────────────────────────────

/** Pretty label for a body region. */
export const BODY_REGION_LABELS: Record<string, string> = {
	brain: 'Brain',
	'spine-cervical': 'Spine — cervical',
	'spine-thoracic': 'Spine — thoracic',
	'spine-lumbar': 'Spine — lumbar',
	'head-neck': 'Head & neck',
	chest: 'Chest',
	abdomen: 'Abdomen',
	pelvis: 'Pelvis',
	cardiac: 'Cardiac',
	'mr-angiogram': 'MR angiogram',
	breast: 'Breast',
	'musculoskeletal-joint': 'Musculoskeletal joint',
	'whole-body': 'Whole body',
	other: 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
export const INDICATION_LABELS: Record<string, string> = {
	'suspected-malignancy': 'Suspected malignancy',
	'cancer-staging': 'Cancer staging',
	'neurological-deficit': 'Neurological deficit',
	'suspected-ms': 'Suspected MS',
	'back-pain-radiculopathy': 'Back pain with radiculopathy',
	'joint-derangement': 'Joint derangement',
	'suspected-stroke': 'Suspected stroke',
	epilepsy: 'Epilepsy',
	dementia: 'Dementia',
	pituitary: 'Pituitary',
	'cardiac-function': 'Cardiac function',
	'follow-up-surveillance': 'Follow-up / surveillance',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || '';
}

// ──────────────────────────────────────────────
// Axis display labels
// ──────────────────────────────────────────────

/** Axis A — appropriateness band display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B — MRI safety band display label. */
export function mriSafetyLabel(value: MriSafetyBand | string): string {
	switch (value) {
		case 'cleared':
			return 'Cleared';
		case 'conditional':
			return 'Conditional';
		case 'needs-mri-physics-review':
			return 'Needs MR physics review';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis B (contrast) — gadolinium-vs-eGFR renal flag display label. */
export function contrastRenalLabel(value: ContrastRenalFlag | string): string {
	switch (value) {
		case 'none':
			return 'No renal concern';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		case 'unknown':
			return 'eGFR unknown';
		default:
			return 'Not assessed';
	}
}

/** Axis D — triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect / modify protocol';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily semantic token utilities)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B MRI safety badge colour. */
export function mriSafetyColor(value: MriSafetyBand | string): string {
	switch (value) {
		case 'cleared':
			return 'bg-success text-success-content border-success';
		case 'conditional':
			return 'bg-info text-info-content border-info';
		case 'needs-mri-physics-review':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B contrast-renal flag badge colour. */
export function contrastRenalColor(value: ContrastRenalFlag | string): string {
	switch (value) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		case 'unknown':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Compute integer age in years from an ISO date-of-birth string. */
export function calculateAge(dateOfBirth: string): number | null {
	if (!dateOfBirth) return null;
	const dob = new Date(dateOfBirth);
	if (Number.isNaN(dob.getTime())) return null;
	const now = new Date();
	let age = now.getFullYear() - dob.getFullYear();
	const m = now.getMonth() - dob.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
	return age >= 0 ? age : null;
}
