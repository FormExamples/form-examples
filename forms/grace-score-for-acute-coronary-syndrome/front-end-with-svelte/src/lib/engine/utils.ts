import type {
	CareSetting,
	ClinicianRole,
	CreatinineUnit,
	KillipClass,
	PointBand,
	PresentationType,
	Priority,
	RiskBand,
	Sex
} from './types';
import { BAND_RANK, UMOL_PER_MGDL, type BandThresholds } from './grace-rules';

// ──────────────────────────────────────────────
// Scoring helpers
// ──────────────────────────────────────────────

/**
 * Normalise a serum-creatinine value to mg/dL. µmol/L is divided by 88.4;
 * mg/dL (or an unspecified unit) is passed through unchanged.
 */
export function normaliseCreatinine(value: number | null, unit: CreatinineUnit): number | null {
	if (value === null || value === undefined) return null;
	return unit === 'umol/L' ? value / UMOL_PER_MGDL : value;
}

/**
 * Look up the points for a numeric value against an ordered band table.
 * A missing (null) value contributes 0 points.
 */
export function bandLookup(
	value: number | null,
	bands: PointBand[]
): { points: number; label: string } {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return { points: 0, label: 'not recorded' };
	}
	for (const band of bands) {
		if (value <= band.upTo) return { points: band.points, label: band.label };
	}
	const last = bands[bands.length - 1];
	return { points: last.points, label: last.label };
}

/**
 * Map a point total to a low / intermediate / high band using the supplied
 * threshold pair.
 */
export function bandForTotal(points: number, thresholds: BandThresholds): RiskBand {
	if (points <= thresholds.low) return 'low';
	if (points <= thresholds.intermediate) return 'intermediate';
	return 'high';
}

/** Return the worse (higher-rank) of two bands — the max-band rule. */
export function worseBand(a: RiskBand, b: RiskBand): RiskBand {
	return BAND_RANK[a] >= BAND_RANK[b] ? a : b;
}

/** Derived invasive-strategy recommendation keyed on the overall risk category. */
export function invasiveStrategyText(category: RiskBand): string {
	switch (category) {
		case 'high':
			return 'Early invasive strategy: coronary angiography within 24 hours, with senior cardiology review.';
		case 'intermediate':
			return 'Invasive strategy: coronary angiography within 72 hours.';
		case 'low':
			return 'Selective invasive strategy: non-invasive testing for ischaemia first, with angiography if positive.';
		default:
			return '';
	}
}

// ──────────────────────────────────────────────
// Display helpers
// ──────────────────────────────────────────────

/** Overall risk-category label for display. */
export function riskCategoryLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk';
		case 'intermediate':
			return 'Intermediate risk';
		case 'high':
			return 'High risk';
		default:
			return '';
	}
}

/** Short band label (in-hospital / 6-month cells). */
export function bandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low';
		case 'intermediate':
			return 'Intermediate';
		case 'high':
			return 'High';
		default:
			return 'N/A';
	}
}

/**
 * Lily-token colour utility classes for the risk-category badge/banner.
 * Low → success; intermediate → warning; high → error.
 */
export function riskCategoryColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'intermediate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
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

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'emergency-physician':
			return 'Emergency physician';
		case 'acute-physician':
			return 'Acute physician';
		case 'cardiologist':
			return 'Cardiologist';
		case 'nurse':
			return 'Nurse';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'emergency-department':
			return 'Emergency department';
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'coronary-care-unit':
			return 'Coronary care unit';
		case 'cardiology-ward':
			return 'Cardiology ward';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** ACS presentation-type label. */
export function presentationTypeLabel(type: PresentationType): string {
	switch (type) {
		case 'nstemi':
			return 'NSTEMI';
		case 'unstable-angina':
			return 'Unstable angina';
		case 'stemi':
			return 'STEMI';
		default:
			return '';
	}
}

/** Patient-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'intersex':
			return 'Intersex';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Killip-class label. */
export function killipClassLabel(cls: KillipClass): string {
	switch (cls) {
		case 'I':
			return 'Class I — no heart failure';
		case 'II':
			return 'Class II — rales / raised JVP';
		case 'III':
			return 'Class III — pulmonary oedema';
		case 'IV':
			return 'Class IV — cardiogenic shock';
		default:
			return '';
	}
}
