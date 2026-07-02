import type {
	ClinicianRole,
	ManagementAction,
	Priority,
	ResultClass,
	SampleAdequacy,
	Sex,
	WithinAgeRange
} from './types';

/** Result-class label for display. */
export function resultClassLabel(resultClass: ResultClass): string {
	switch (resultClass) {
		case 'negative':
			return 'Negative — below threshold';
		case 'positive':
			return 'Positive — at or above threshold';
		case 'spoilt':
			return 'Spoilt / inadequate';
		default:
			return 'Not classified';
	}
}

/**
 * Lily-token colour utility classes for the result-class badge/banner.
 * Negative → success; spoilt → warning; positive → error.
 */
export function resultClassColor(resultClass: ResultClass): string {
	switch (resultClass) {
		case 'negative':
			return 'bg-success text-success-content border-success';
		case 'spoilt':
			return 'bg-warning text-warning-content border-warning';
		case 'positive':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Management-action label for display. */
export function managementActionLabel(action: ManagementAction): string {
	switch (action) {
		case 'routine-recall':
			return 'Routine two-yearly recall';
		case 'refer-colonoscopy':
			return 'Refer for colonoscopy';
		case 'repeat-kit':
			return 'Repeat kit / reminder';
		default:
			return 'Not determined';
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

/** Reviewing clinician / administrator role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'screening-administrator':
			return 'Screening administrator';
		case 'screening-practitioner':
			return 'Screening practitioner';
		case 'gp':
			return 'GP';
		case 'ssp':
			return 'Specialist screening practitioner (SSP)';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Participant-sex label. */
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

/** Eligibility-against-age-range label. */
export function withinAgeRangeLabel(value: WithinAgeRange): string {
	switch (value) {
		case 'eligible':
			return 'Eligible (within age range)';
		case 'over-age-self-request':
			return 'Over age — self-request';
		case 'not-eligible':
			return 'Not eligible';
		default:
			return '';
	}
}

/** Sample-adequacy label. */
export function sampleAdequacyLabel(value: SampleAdequacy): string {
	switch (value) {
		case 'adequate':
			return 'Adequate';
		case 'spoilt':
			return 'Spoilt';
		case 'insufficient':
			return 'Insufficient';
		case 'expired':
			return 'Expired';
		default:
			return '';
	}
}

/** Format a faecal-haemoglobin value for display, or a dash when null. */
export function formatHb(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n} µg Hb/g`;
}
