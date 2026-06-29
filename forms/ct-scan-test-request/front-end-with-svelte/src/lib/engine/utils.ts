// ──────────────────────────────────────────────
// Display helpers and shared predicates for the CT Scan Test Request engine.
//
// Label helpers and Lily-token badge colours are shared by the wizard, the
// report, and the dashboard so every surface stays in lock-step.
// ──────────────────────────────────────────────

import type {
	AppropriatenessBand,
	BodyRegion,
	ContrastRequired,
	ContrastSafetyBand,
	DoseBand,
	Indication,
	Recommendation,
	TriageTier
} from './types';

// ─── Predicates ───

/** True when the requested study involves intravascular iodinated contrast. */
export function usesIvContrast(contrastRequired: ContrastRequired | string): boolean {
	return contrastRequired === 'iv-iodinated' || contrastRequired === 'both';
}

// ─── Display labels ───

const BODY_REGION_LABELS: Record<string, string> = {
	head: 'Head',
	neck: 'Neck',
	chest: 'Chest',
	abdomen: 'Abdomen',
	pelvis: 'Pelvis',
	'abdomen-pelvis': 'Abdomen / pelvis',
	spine: 'Spine',
	'ct-angiogram': 'CT angiogram',
	'ct-colonography': 'CT colonography',
	'whole-body': 'Whole body',
	extremity: 'Extremity',
	other: 'Other'
};

/** Human-readable body-region label. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	return BODY_REGION_LABELS[value] ?? (value || 'Unspecified');
}

const INDICATION_LABELS: Record<string, string> = {
	trauma: 'Trauma',
	'suspected-stroke': 'Suspected stroke',
	'suspected-malignancy': 'Suspected malignancy',
	'cancer-staging': 'Cancer staging',
	'pulmonary-embolism': 'Pulmonary embolism',
	'abdominal-pain': 'Abdominal pain',
	'renal-colic': 'Renal colic',
	'infection-abscess': 'Infection / abscess',
	'pre-surgical-planning': 'Pre-surgical planning',
	'follow-up-surveillance': 'Follow-up surveillance',
	headache: 'Headache',
	other: 'Other'
};

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] ?? (value || 'Unspecified');
}

const CONTRAST_LABELS: Record<string, string> = {
	none: 'None',
	'iv-iodinated': 'IV iodinated',
	oral: 'Oral',
	both: 'IV + oral',
	unknown: 'Unknown'
};

/** Human-readable contrast-requirement label. */
export function contrastLabel(value: ContrastRequired | string): string {
	return CONTRAST_LABELS[value] ?? (value || 'Unspecified');
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

/** Axis B contrast-safety display label. */
export function contrastSafetyLabel(value: ContrastSafetyBand | string): string {
	switch (value) {
		case 'safe':
			return 'Safe';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not assessed';
	}
}

/** Axis B estimated radiation-dose display label. */
export function doseLabel(value: DoseBand | string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not assessed';
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
			return 'Accept and protocol';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect / alternative study';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ─── Display colours (Lily token utility classes) ───

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

/** Axis B contrast-safety badge colour. */
export function contrastSafetyColor(value: ContrastSafetyBand | string): string {
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

/** Axis B estimated-dose badge colour. */
export function doseColor(value: DoseBand | string): string {
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
