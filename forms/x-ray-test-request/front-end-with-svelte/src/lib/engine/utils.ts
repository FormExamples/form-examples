import type {
	AppropriatenessBand,
	RadiationSafetyBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation,
	BodyRegion,
	PrimaryIndication,
	Laterality
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const BODY_REGION_LABELS: Record<string, string> = {
	chest: 'Chest',
	abdomen: 'Abdomen',
	'spine-cervical': 'Spine (cervical)',
	'spine-thoracic': 'Spine (thoracic)',
	'spine-lumbar': 'Spine (lumbar)',
	pelvis: 'Pelvis',
	hip: 'Hip',
	knee: 'Knee',
	'ankle-foot': 'Ankle / foot',
	shoulder: 'Shoulder',
	'wrist-hand': 'Wrist / hand',
	skull: 'Skull',
	dental: 'Dental',
	other: 'Other'
};

/** Human-readable body-region label, falling back to the raw value. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	return BODY_REGION_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'trauma-fracture': 'Trauma / fracture',
	'chest-infection': 'Chest infection',
	'suspected-pneumothorax': 'Suspected pneumothorax',
	'foreign-body': 'Foreign body',
	'joint-pain': 'Joint pain',
	arthritis: 'Arthritis',
	'pre-operative': 'Pre-operative',
	'line-position-check': 'Line-position check',
	'abdominal-obstruction': 'Abdominal obstruction',
	'swallowed-object': 'Swallowed object',
	'follow-up': 'Follow-up',
	other: 'Other'
};

/** Human-readable indication label, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Human-readable laterality label. */
export function lateralityLabel(value: Laterality | string): string {
	switch (value) {
		case 'left':
			return 'Left';
		case 'right':
			return 'Right';
		case 'bilateral':
			return 'Bilateral';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
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

/** Axis B radiation-safety display label. */
export function radiationSafetyLabel(value: RadiationSafetyBand | string): string {
	switch (value) {
		case 'safe':
			return 'Safe';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis B relative effective-dose display label. */
export function radiationDoseLabel(value: RadiationDoseBand | string): string {
	switch (value) {
		case 'low':
			return 'Low dose';
		case 'moderate':
			return 'Moderate dose';
		case 'high':
			return 'High dose';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
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
			return 'Redirect to another modality';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
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

/** Axis B radiation-safety badge colour. */
export function radiationSafetyColor(value: RadiationSafetyBand | string): string {
	switch (value) {
		case 'safe':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B relative effective-dose badge colour. */
export function radiationDoseColor(value: RadiationDoseBand | string): string {
	switch (value) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
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

/** Title-case a hyphenated token (e.g. `wrong-laterality-risk` → `Wrong Laterality Risk`). */
export function titleCase(value: string): string {
	return String(value || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}
