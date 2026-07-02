import type { CareSetting, ClinicianRole, Priority, RiskBand, Sex } from './types';

/** Risk-band label for display (banding uses the modified McIsaac score). */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk (McIsaac ≤ 1)';
		case 'moderate':
			return 'Moderate risk (McIsaac 2–3)';
		case 'high':
			return 'High risk (McIsaac 4–5)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Low → success; moderate → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
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

/** Lily-token colour utility classes for a criterion point pill (1 = warning). */
export function pointColor(point: 0 | 1): string {
	return point === 1
		? 'bg-warning text-warning-content border-warning'
		: 'bg-base-300 text-base-content border-base-300';
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

/** Human-readable label for the McIsaac age modifier. */
export function ageModifierLabel(modifier: -1 | 0 | 1): string {
	if (modifier > 0) return '+1 (age 3–14)';
	if (modifier < 0) return '−1 (age ≥ 45)';
	return '0 (age 15–44)';
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'General practitioner';
		case 'nurse-practitioner':
			return 'Nurse practitioner';
		case 'pharmacist':
			return 'Pharmacist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'general-practice':
			return 'General practice';
		case 'urgent-care':
			return 'Urgent / out-of-hours care';
		case 'pharmacy':
			return 'Community pharmacy';
		case 'emergency-department':
			return 'Emergency department';
		case 'other':
			return 'Other';
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
