// Display label and colour helpers for the Nuclear Medicine Test Request
// engine.
//
// Colours are Lily Design System semantic tokens only (no hardcoded palette):
// success / warning / error / info / base-300, each as the
// `bg-<token> text-<token>-content border-<token>` triple.

import type {
	ScanType,
	Indication,
	AppropriatenessBand,
	PrepSafetyBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Domain value labels
// ──────────────────────────────────────────────

/** Pretty label for a scan type. */
export const SCAN_TYPE_LABELS: Record<string, string> = {
	'bone-scan': 'Bone scan (Tc-99m MDP)',
	'myocardial-perfusion': 'Myocardial perfusion',
	'vq-lung-scan': 'V/Q lung scan',
	'thyroid-uptake': 'Thyroid uptake',
	'renal-dmsa': 'Renal DMSA',
	'renal-mag3': 'Renal MAG3',
	'gallium-octreotide': 'Gallium / octreotide',
	'white-cell-scan': 'White-cell scan',
	'sentinel-node': 'Sentinel-node',
	other: 'Other'
};

/** Human-readable label for a scan type, falling back to the raw value. */
export function scanTypeLabel(value: ScanType | string): string {
	return SCAN_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
export const INDICATION_LABELS: Record<string, string> = {
	'suspected-bone-metastases': 'Suspected bone metastases',
	'cardiac-ischaemia': 'Cardiac ischaemia',
	'pulmonary-embolism': 'Pulmonary embolism',
	'thyroid-function': 'Thyroid function',
	'renal-function': 'Renal function',
	'infection-localisation': 'Infection localisation',
	'tumour-localisation': 'Tumour localisation',
	'sentinel-node-mapping': 'Sentinel-node mapping',
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

/** Axis B — preparation & radiation-safety band display label. */
export function prepSafetyLabel(value: PrepSafetyBand | string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not assessed';
	}
}

/** Axis B — radiation effective-dose band display label. */
export function radiationDoseLabel(value: RadiationDoseBand | string): string {
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
			return 'Accept with safety caution';
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

/** Axis B preparation & radiation-safety badge colour. */
export function prepSafetyColor(value: PrepSafetyBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B radiation effective-dose badge colour. */
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
