import type {
	CareSetting,
	ClinicianRole,
	Disposition,
	Priority,
	RiskBand,
	ScoreVariant,
	Sex
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
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

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Low → success; intermediate → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
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

/** Score-variant label. */
export function scoreVariantLabel(variant: ScoreVariant): string {
	switch (variant) {
		case 'curb-65':
			return 'CURB-65';
		case 'crb-65':
			return 'CRB-65';
		default:
			return '';
	}
}

/** Recommended-disposition label. */
export function dispositionLabel(disposition: Disposition): string {
	switch (disposition) {
		case 'home-outpatient':
			return 'Home / outpatient management';
		case 'short-stay-supervised':
			return 'Short-stay / hospital-supervised';
		case 'hospital-admission':
			return 'Hospital admission';
		default:
			return '';
	}
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'physician':
			return 'Physician';
		case 'general-practitioner':
			return 'General practitioner';
		case 'advanced-nurse-practitioner':
			return 'Advanced nurse practitioner';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
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
		case 'primary-care':
			return 'Primary care';
		case 'emergency-department':
			return 'Emergency department';
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'ward':
			return 'Ward';
		case 'community':
			return 'Community';
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
