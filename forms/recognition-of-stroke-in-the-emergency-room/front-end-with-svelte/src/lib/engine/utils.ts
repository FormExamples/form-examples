import type {
	AgeBand,
	Band,
	CareSetting,
	ClinicianRole,
	Priority,
	Sex,
	YesNoNa
} from './types';

/** Band label for display. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'stroke-likely':
			return 'Stroke likely (ROSIER > 0)';
		case 'stroke-unlikely':
			return 'Stroke unlikely (ROSIER <= 0)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the band badge/banner.
 * Stroke likely → error; stroke unlikely → success.
 */
export function bandColor(band: Band): string {
	switch (band) {
		case 'stroke-likely':
			return 'bg-error text-error-content border-error';
		case 'stroke-unlikely':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Lily-token colour utility classes for a signed criterion point pill.
 * +1 (sign present) → warning; -1 (mimic present) → info; 0 → neutral.
 */
export function pointColor(point: number): string {
	if (point > 0) return 'bg-warning text-warning-content border-warning';
	if (point < 0) return 'bg-info text-info-content border-info';
	return 'bg-base-300 text-base-content border-base-300';
}

/** Format a signed integer with an explicit sign, e.g. +1, 0, -1. */
export function signed(n: number): string {
	return n > 0 ? `+${n}` : String(n);
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
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
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
		case 'acute-medical':
			return 'Acute medical';
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

/** Adult age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case '16-39':
			return '16-39';
		case '40-59':
			return '40-59';
		case '60-74':
			return '60-74';
		case '75-plus':
			return '75 and over';
		default:
			return '';
	}
}

/** Hypoglycaemia-corrected label. */
export function hypoglycaemiaCorrectedLabel(value: YesNoNa): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		case 'na':
			return 'Not applicable';
		default:
			return '';
	}
}
