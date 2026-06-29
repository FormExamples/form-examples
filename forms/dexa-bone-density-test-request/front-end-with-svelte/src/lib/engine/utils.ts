import type {
	AppropriatenessBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation,
	ScanRegion,
	Indication,
	ClinicianRole,
	PregnancyStatus,
	MenopauseStatus,
	PreviousDexaResult,
	Setting,
	Urgency
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

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

/** Axis B radiation dose-band display label. */
export function radiationDoseLabel(value: string): string {
	switch (value) {
		case 'low':
			return 'Low dose';
		case 'moderate':
			return 'Moderate dose';
		case 'high':
			return 'Defer (pregnancy)';
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
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect / defer';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

/** Human-readable scan-region label. */
export function scanRegionLabel(value: ScanRegion | string): string {
	switch (value) {
		case 'hip':
			return 'Hip';
		case 'spine':
			return 'Spine';
		case 'hip-and-spine':
			return 'Hip and spine';
		case 'forearm':
			return 'Forearm';
		case 'whole-body':
			return 'Whole body';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'osteoporosis-screening':
			return 'Osteoporosis screening';
		case 'fragility-fracture':
			return 'Fragility fracture';
		case 'long-term-steroids':
			return 'Long-term steroids';
		case 'early-menopause':
			return 'Early menopause';
		case 'high-frax-risk':
			return 'High FRAX risk';
		case 'monitoring-treatment':
			return 'Monitoring treatment';
		case 'secondary-osteoporosis':
			return 'Secondary osteoporosis';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable clinician-role label. */
export function clinicianRoleLabel(value: ClinicianRole | string): string {
	switch (value) {
		case 'radiologist':
			return 'Radiologist';
		case 'gp':
			return 'GP';
		case 'rheumatologist':
			return 'Rheumatologist';
		case 'endocrinologist':
			return 'Endocrinologist';
		case 'hospital-doctor':
			return 'Hospital doctor';
		case 'radiographer':
			return 'Radiographer';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable pregnancy-status label. */
export function pregnancyStatusLabel(value: PregnancyStatus | string): string {
	switch (value) {
		case 'not-pregnant':
			return 'Not pregnant';
		case 'possible':
			return 'Possible';
		case 'pregnant':
			return 'Pregnant';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable menopause-status label. */
export function menopauseStatusLabel(value: MenopauseStatus | string): string {
	switch (value) {
		case 'pre':
			return 'Pre-menopausal';
		case 'peri':
			return 'Peri-menopausal';
		case 'post':
			return 'Post-menopausal';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable previous-DEXA-result label. */
export function previousDexaLabel(value: PreviousDexaResult | string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'normal':
			return 'Normal';
		case 'osteopenia':
			return 'Osteopenia';
		case 'osteoporosis':
			return 'Osteoporosis';
		case 'unknown':
			return 'Unknown';
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

/** Human-readable urgency label. */
export function urgencyLabel(value: Urgency | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		default:
			return 'Unspecified';
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

/** Axis B radiation dose-band badge colour. */
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
