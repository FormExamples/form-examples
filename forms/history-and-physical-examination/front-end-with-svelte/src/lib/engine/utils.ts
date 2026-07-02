import type {
	AdmissionSource,
	AgeBand,
	AllergyStatus,
	CareSetting,
	ClinicianRole,
	CompletenessStatus,
	ConsciousnessLevel,
	Priority,
	Sex
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'partial':
			return 'Partial';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the completeness-status badge/banner.
 * complete → success; partial → warning; incomplete → error.
 */
export function statusColor(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'incomplete':
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

/** Lily-token colour utility classes for a per-component documented pill. */
export function satisfiedColor(satisfied: boolean): string {
	return satisfied
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Clerking clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'acp':
			return 'Advanced clinical practitioner';
		case 'physician-associate':
			return 'Physician associate';
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
		case 'ward':
			return 'Ward';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Admission-source label. */
export function admissionSourceLabel(source: AdmissionSource): string {
	switch (source) {
		case 'self':
			return 'Self-presentation';
		case 'gp':
			return 'GP referral';
		case 'ambulance':
			return 'Ambulance';
		case 'transfer':
			return 'Inter-hospital transfer';
		case 'other':
			return 'Other';
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
		case '65-79':
			return '65-79';
		case '80-plus':
			return '80 and over';
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

/** Allergy-status label. */
export function allergyStatusLabel(status: AllergyStatus): string {
	switch (status) {
		case 'none-known':
			return 'No known drug allergies';
		case 'has-allergies':
			return 'Has documented allergies';
		case 'not-documented':
			return 'Not documented';
		default:
			return '';
	}
}

/** Consciousness-level (AVPU) label. */
export function consciousnessLabel(level: ConsciousnessLevel): string {
	switch (level) {
		case 'alert':
			return 'Alert';
		case 'voice':
			return 'Responds to voice';
		case 'pain':
			return 'Responds to pain';
		case 'unresponsive':
			return 'Unresponsive';
		default:
			return '';
	}
}
