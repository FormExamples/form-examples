import type {
	CareSetting,
	Classification,
	ClinicianRole,
	PretestProbability,
	Priority,
	Sex,
	YesNo
} from './types';

/** Classification label for display. */
export function classificationLabel(classification: Classification): string {
	switch (classification) {
		case 'perc-negative':
			return 'PERC-negative';
		case 'perc-positive':
			return 'PERC-positive';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the classification badge/banner.
 * perc-negative → success; perc-positive → error.
 */
export function classificationColor(classification: Classification): string {
	switch (classification) {
		case 'perc-negative':
			return 'bg-success text-success-content border-success';
		case 'perc-positive':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Satisfied / failed label for a single criterion. */
export function criterionStatusLabel(satisfied: boolean): string {
	return satisfied ? 'Satisfied' : 'Failed';
}

/** Lily-token colour utility classes for a criterion-status pill. */
export function criterionStatusColor(satisfied: boolean): string {
	return satisfied
		? 'bg-success text-success-content border-success'
		: 'bg-error text-error-content border-error';
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

/** Clinician-role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'physician':
			return 'Physician';
		case 'advanced-practitioner':
			return 'Advanced practitioner';
		case 'nurse':
			return 'Nurse';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(value: CareSetting): string {
	switch (value) {
		case 'emergency-department':
			return 'Emergency department';
		case 'acute-ambulatory':
			return 'Acute ambulatory care';
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

/** Pre-test-probability label. */
export function pretestProbabilityLabel(value: PretestProbability): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'not-low':
			return 'Not low (moderate or high)';
		default:
			return '';
	}
}

/** Yes/No label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return 'Not recorded';
	}
}
