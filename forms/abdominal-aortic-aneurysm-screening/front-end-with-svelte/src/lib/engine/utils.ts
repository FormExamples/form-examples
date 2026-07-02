import type {
	Category,
	EligibilityRoute,
	Priority,
	ScanType,
	Sex,
	SurveillanceBand,
	TechnicianRole
} from './types';

/** Aneurysm-category label for display. */
export function categoryLabel(category: Category): string {
	switch (category) {
		case 'normal':
			return 'Normal (< 3.0 cm)';
		case 'small':
			return 'Small aneurysm (3.0-4.4 cm)';
		case 'medium':
			return 'Medium aneurysm (4.5-5.4 cm)';
		case 'large':
			return 'Large aneurysm (>= 5.5 cm)';
		case 'non-visualised':
			return 'Non-visualised';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the category badge/banner.
 * normal → success; small → info; medium → warning; large → error;
 * non-visualised → neutral.
 */
export function categoryColor(category: Category): string {
	switch (category) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'small':
			return 'bg-info text-info-content border-info';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'large':
			return 'bg-error text-error-content border-error';
		case 'non-visualised':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Surveillance / referral band label. */
export function surveillanceBandLabel(band: SurveillanceBand): string {
	switch (band) {
		case 'discharge':
			return 'Discharge — no further surveillance';
		case 'annual':
			return 'Annual (12-monthly) surveillance';
		case 'three-monthly':
			return 'Three-monthly surveillance';
		case 'refer-vascular':
			return 'Refer to vascular surgery';
		case 'rescan':
			return 'Arrange a re-scan';
		default:
			return '';
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

/** Screening-technician role label. */
export function technicianRoleLabel(role: TechnicianRole): string {
	switch (role) {
		case 'screening-technician':
			return 'Screening technician';
		case 'clinical-skills-trainer':
			return 'Clinical skills trainer';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Eligibility-route label. */
export function eligibilityRouteLabel(route: EligibilityRoute): string {
	switch (route) {
		case 'routine-year-of-65':
			return 'Routine — year of 65 invitation';
		case 'self-referral-over-65':
			return 'Self-referral — over 65';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Scan-type label. */
export function scanTypeLabel(type: ScanType): string {
	switch (type) {
		case 'first-scan':
			return 'First scan';
		case 'surveillance-rescan':
			return 'Surveillance re-scan';
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

/** Format an aortic diameter for display, or a dash when null. */
export function formatDiameter(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n.toFixed(1)} cm`;
}
