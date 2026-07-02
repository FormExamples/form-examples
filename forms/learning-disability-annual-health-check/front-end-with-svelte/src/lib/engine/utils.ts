import type {
	AgeBand,
	ClinicianRole,
	CompletenessStatus,
	LdRegisterStatus,
	Priority,
	Sex
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the completeness-status badge/banner.
 * complete → success (check carried out in full); incomplete → warning
 * (components outstanding).
 */
export function statusColor(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'incomplete':
			return 'bg-warning text-warning-content border-warning';
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

/** Lily-token colour utility classes for a per-component completed pill. */
export function completedColor(completed: boolean): string {
	return completed
		? 'bg-success text-success-content border-success'
		: 'bg-warning text-warning-content border-warning';
}

/**
 * Lily-token colour utility classes for the Health Action Plan pill.
 * produced-and-shared → success; otherwise warning.
 */
export function healthActionPlanColor(complete: boolean): string {
	return complete
		? 'bg-success text-success-content border-success'
		: 'bg-warning text-warning-content border-warning';
}

/** Checking-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'GP';
		case 'practice-nurse':
			return 'Practice nurse';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
		case 'ld-team':
			return 'Community LD-team clinician';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Person-sex label. */
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
		case '14-17':
			return '14-17';
		case '18-24':
			return '18-24';
		case '25-44':
			return '25-44';
		case '45-64':
			return '45-64';
		case '65+':
			return '65 and over';
		default:
			return '';
	}
}

/** LD-register-status label. */
export function ldRegisterStatusLabel(status: LdRegisterStatus): string {
	switch (status) {
		case 'on-register':
			return 'On the LD register';
		case 'not-on-register':
			return 'Not on the LD register';
		case 'newly-added':
			return 'Newly added to the register';
		default:
			return '';
	}
}

/**
 * Human-readable label for a kebab-case enum finding value. Converts an
 * unrecognised token to a Title Case phrase so the report and dashboard render
 * sensibly without a lookup per field. A blank value returns 'Not recorded'.
 */
export function findingLabel(value: string): string {
	if (!value || value.trim() === '') return 'Not recorded';
	return value
		.split('-')
		.map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
		.join(' ');
}
