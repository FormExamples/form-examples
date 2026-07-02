import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	Priority,
	ResultBand,
	Sex
} from './types';

/** Result-band label for display. */
export function resultBandLabel(band: ResultBand): string {
	switch (band) {
		case 'negative':
			return 'Negative (CAGE 0)';
		case 'low':
			return 'Sub-threshold (CAGE 1)';
		case 'positive':
			return 'Positive (CAGE 2-4)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the result-band badge/banner.
 * Negative → success; sub-threshold → warning; positive → error.
 */
export function resultBandColor(band: ResultBand): string {
	switch (band) {
		case 'negative':
			return 'bg-success text-success-content border-success';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
		case 'positive':
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

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'midwife':
			return 'Midwife';
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
		case 'ward':
			return 'Ward';
		case 'emergency-department':
			return 'Emergency department';
		case 'antenatal':
			return 'Antenatal';
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
