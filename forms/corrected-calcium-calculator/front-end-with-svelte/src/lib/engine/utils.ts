import type {
	AgeBand,
	CareSetting,
	Classification,
	ClinicianRole,
	Priority,
	Sex
} from './types';

/** Classification label for display. */
export function classificationLabel(classification: Classification): string {
	switch (classification) {
		case 'hypocalcaemia':
			return 'Hypocalcaemia (< 2.20 mmol/L)';
		case 'normal':
			return 'Normal (2.20-2.60 mmol/L)';
		case 'hypercalcaemia':
			return 'Hypercalcaemia (> 2.60 mmol/L)';
		case 'unknown':
			return 'Awaiting both inputs';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the classification badge/banner.
 * Normal → success; hypocalcaemia → warning; hypercalcaemia → error.
 */
export function classificationColor(classification: Classification): string {
	switch (classification) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'hypocalcaemia':
			return 'bg-warning text-warning-content border-warning';
		case 'hypercalcaemia':
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
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'pharmacist':
			return 'Pharmacist';
		case 'laboratory-staff':
			return 'Laboratory staff';
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
		case 'ward':
			return 'Ward';
		case 'emergency-department':
			return 'Emergency department';
		case 'outpatient':
			return 'Outpatient';
		case 'laboratory':
			return 'Laboratory';
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
		case '18-39':
			return '18-39';
		case '40-64':
			return '40-64';
		case '65-74':
			return '65-74';
		case '75-84':
			return '75-84';
		case '85-plus':
			return '85 and over';
		default:
			return '';
	}
}

/** Format a corrected-calcium value for display, or a dash when null. */
export function formatCalcium(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n.toFixed(2)} mmol/L`;
}
