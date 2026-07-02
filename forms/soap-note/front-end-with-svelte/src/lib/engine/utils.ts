import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	CompletenessStatus,
	EncounterType,
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
 * complete → success (note stands alone); partial → warning (documentation
 * gaps); incomplete → error (a critical section is absent).
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

/** Lily-token colour utility classes for a per-section presence pill. */
export function presentColor(present: boolean): string {
	return present
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Authoring-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
		case 'pharmacist':
			return 'Pharmacist';
		case 'allied-health':
			return 'Allied-health professional';
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
		case 'outpatient':
			return 'Outpatient clinic';
		case 'ward':
			return 'Hospital ward';
		case 'emergency-department':
			return 'Emergency department';
		case 'community':
			return 'Community / allied-health';
		case 'telehealth':
			return 'Telehealth';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Encounter-type label. */
export function encounterTypeLabel(type: EncounterType): string {
	switch (type) {
		case 'new-problem':
			return 'New problem';
		case 'follow-up':
			return 'Follow-up';
		case 'review':
			return 'Review';
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

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'under-18':
			return 'Under 18';
		case '18-39':
			return '18-39';
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
