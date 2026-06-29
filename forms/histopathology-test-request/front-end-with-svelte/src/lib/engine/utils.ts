import type {
	AppropriatenessBand,
	SpecimenQualityBand,
	TriageTier,
	Recommendation,
	SpecimenType,
	PrimaryIndication,
	Fixative,
	Setting,
	ClinicianRole
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	switch (value) {
		case 'biopsy':
			return 'Biopsy';
		case 'excision':
			return 'Excision';
		case 'resection':
			return 'Resection';
		case 'endoscopic-biopsy':
			return 'Endoscopic biopsy';
		case 'skin-lesion':
			return 'Skin lesion';
		case 'frozen-section':
			return 'Frozen section';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable primary-indication label. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'suspected-malignancy':
			return 'Suspected malignancy';
		case 'cancer-staging':
			return 'Cancer staging';
		case 'inflammatory-disease':
			return 'Inflammatory disease';
		case 'infection':
			return 'Infection';
		case 'characterise-lesion':
			return 'Characterise lesion';
		case 'margin-assessment':
			return 'Margin assessment';
		case 'transplant-monitoring':
			return 'Transplant monitoring';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable fixative label. */
export function fixativeLabel(value: Fixative | string): string {
	switch (value) {
		case 'formalin':
			return 'Formalin';
		case 'fresh':
			return 'Fresh (unfixed)';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'community':
			return 'Community';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Human-readable clinician-role label. */
export function clinicianRoleLabel(value: ClinicianRole | string): string {
	switch (value) {
		case 'pathologist':
			return 'Pathologist';
		case 'surgeon':
			return 'Surgeon';
		case 'gp':
			return 'GP';
		case 'dermatologist':
			return 'Dermatologist';
		case 'gastroenterologist':
			return 'Gastroenterologist';
		case 'radiologist':
			return 'Radiologist';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
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

/** Axis B specimen-quality display label. */
export function specimenQualityLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'reject-risk':
			return 'Reject risk';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week-wait';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and process';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable test';
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

/** Axis B specimen-quality badge colour. */
export function specimenQualityColor(value: SpecimenQualityBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'reject-risk':
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
		case 'two-week-wait':
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
