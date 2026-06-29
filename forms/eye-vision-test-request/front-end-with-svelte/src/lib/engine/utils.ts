import type {
	AppropriatenessBand,
	TriageTier,
	PriorityBand,
	Recommendation,
	TestType,
	PrimaryIndication,
	Laterality,
	Setting
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const TEST_TYPE_LABELS: Record<string, string> = {
	'visual-acuity': 'Visual acuity',
	'visual-fields': 'Visual fields',
	refraction: 'Refraction',
	'fundus-examination': 'Fundus examination',
	'optical-coherence-tomography': 'Optical coherence tomography (OCT)',
	'fluorescein-angiography': 'Fluorescein angiography',
	tonometry: 'Tonometry',
	'slit-lamp': 'Slit-lamp examination',
	'orthoptic-assessment': 'Orthoptic assessment',
	other: 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
export function testTypeLabel(value: TestType | string): string {
	return TEST_TYPE_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'reduced-vision': 'Reduced vision',
	'suspected-glaucoma': 'Suspected glaucoma',
	'diabetic-retinopathy-screening': 'Diabetic retinopathy screening',
	'sudden-visual-loss': 'Sudden visual loss',
	'flashes-floaters': 'Flashes / floaters',
	'red-eye': 'Red eye',
	'childhood-squint': 'Childhood squint',
	'visual-field-defect': 'Visual-field defect',
	'cataract-assessment': 'Cataract assessment',
	'headache-visual-symptoms': 'Headache with visual symptoms',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Human-readable laterality label. */
export function lateralityLabel(value: Laterality | string): string {
	switch (value) {
		case 'right':
			return 'Right eye';
		case 'left':
			return 'Left eye';
		case 'both':
			return 'Both eyes';
		default:
			return 'Unspecified';
	}
}

/** Human-readable care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'hospital-eye-service':
			return 'Hospital eye service';
		case 'community-optometry':
			return 'Community optometry';
		case 'gp-surgery':
			return 'GP surgery';
		case 'emergency-eye-clinic':
			return 'Emergency eye clinic';
		case 'triage-desk':
			return 'Eye-care triage desk';
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

/** Axis B triage-tier display label. */
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

/** Axis D clinical-priority display label. */
export function priorityBandLabel(value: PriorityBand | string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
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

/** Axis B triage-tier badge colour. */
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

/** Axis D clinical-priority badge colour. */
export function priorityBandColor(value: PriorityBand | string): string {
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
