import type {
	AppropriatenessBand,
	BodyRegion,
	Indication,
	Recommendation,
	SuitabilityBand,
	TriageTier,
	Urgency
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const BODY_REGION_LABELS: Record<string, string> = {
	abdomen: 'Abdomen',
	pelvis: 'Pelvis',
	'renal-tract': 'Renal tract',
	'liver-biliary': 'Liver / biliary',
	'thyroid-neck': 'Thyroid / neck',
	'scrotum-testes': 'Scrotum / testes',
	breast: 'Breast',
	'soft-tissue': 'Soft tissue',
	'vascular-doppler': 'Vascular Doppler',
	'dvt-leg': 'DVT (leg)',
	carotid: 'Carotid',
	'msk-joint': 'MSK / joint',
	other: 'Other'
};

/** Human-readable body-region label, falling back to the raw value. */
export function bodyRegionLabel(value: BodyRegion | string): string {
	return BODY_REGION_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'abdominal-pain': 'Abdominal pain',
	'suspected-gallstones': 'Suspected gallstones',
	'abnormal-lfts': 'Abnormal LFTs',
	'renal-impairment': 'Renal impairment',
	haematuria: 'Haematuria',
	'palpable-mass': 'Palpable mass',
	'suspected-dvt': 'Suspected DVT',
	'suspected-aaa': 'Suspected AAA',
	'thyroid-nodule': 'Thyroid nodule',
	'testicular-pain': 'Testicular pain',
	'follow-up': 'Follow-up',
	other: 'Other'
};

/** Human-readable indication label, falling back to the raw value. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Human-readable laterality label. */
export function lateralityLabel(value: string): string {
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

/** Human-readable care-setting label. */
export function settingLabel(value: string): string {
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

/** Human-readable requested-urgency label. */
export function urgencyLabel(value: Urgency | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
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

/** Axis B suitability display label. */
export function suitabilityLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'limited':
			return 'Limited';
		default:
			return 'Not assessed';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
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
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect / amend preparation';
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

/** Axis B suitability badge colour. */
export function suitabilityColor(value: SuitabilityBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'limited':
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
