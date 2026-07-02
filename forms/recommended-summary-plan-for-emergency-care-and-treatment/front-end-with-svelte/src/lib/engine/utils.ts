import type {
	Ceiling,
	ClinicianRole,
	CprRecommendation,
	Involvement,
	PriorityBalance,
	Priority,
	Status,
	YesNo
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: Status): string {
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
 * Lily-token colour utility classes for the status badge/banner.
 * Complete → success; incomplete → error.
 */
export function statusColor(status: Status): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
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

/** Balance-of-priorities label. */
export function priorityBalanceLabel(value: PriorityBalance): string {
	switch (value) {
		case 'sustain-life':
			return 'Prioritise sustaining life';
		case 'balanced':
			return 'Balanced — weigh both';
		case 'comfort':
			return 'Prioritise comfort';
		default:
			return '';
	}
}

/** CPR-recommendation label. */
export function cprRecommendationLabel(value: CprRecommendation): string {
	switch (value) {
		case 'attempt':
			return 'CPR should be attempted';
		case 'do-not-attempt':
			return 'CPR should NOT be attempted (DNACPR)';
		default:
			return 'Not documented';
	}
}

/**
 * Lily-token colour utility classes for the CPR-recommendation badge.
 * Attempt → success; do-not-attempt → warning; undocumented → error.
 */
export function cprRecommendationColor(value: CprRecommendation): string {
	switch (value) {
		case 'attempt':
			return 'bg-success text-success-content border-success';
		case 'do-not-attempt':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-error text-error-content border-error';
	}
}

/** Ceiling-of-treatment label. */
export function ceilingLabel(value: Ceiling): string {
	switch (value) {
		case 'appropriate':
			return 'Appropriate';
		case 'not-appropriate':
			return 'Not appropriate';
		default:
			return 'Not recorded';
	}
}

/** Capacity / involvement label. */
export function involvementLabel(value: Involvement): string {
	switch (value) {
		case 'person':
			return 'The person';
		case 'legal-proxy':
			return 'Legal proxy (welfare attorney / deputy)';
		case 'consultees':
			return 'Consultees / those close to the person';
		default:
			return '';
	}
}

/** Clinician-role label. */
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

/** Yes / No label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}
