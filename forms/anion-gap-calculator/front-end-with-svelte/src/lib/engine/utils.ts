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
		case 'low':
			return 'Low anion gap';
		case 'normal':
			return 'Normal anion gap';
		case 'high':
			return 'High anion gap';
		case 'very-high':
			return 'Very high anion gap (≥ 20)';
		case 'unknown':
			return 'Awaiting the electrolyte panel';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the classification badge/banner.
 * Normal → success; low → warning; high / very-high → error.
 */
export function classificationColor(classification: Classification): string {
	switch (classification) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'very-high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'urgent':
			return 'URGENT';
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
		case 'scientist':
			return 'Clinical scientist';
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
		case 'emergency-department':
			return 'Emergency department';
		case 'ward':
			return 'Ward';
		case 'intensive-care':
			return 'Intensive care';
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

/** Format an anion-gap value (1 dp) for display, or a dash when null. */
export function formatGap(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n.toFixed(1)} mmol/L`;
}
