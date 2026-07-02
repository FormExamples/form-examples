import type {
	ClinicianGrade,
	CompletenessStatus,
	EscalationStatus,
	ObservationTrend,
	Priority,
	VteStatus
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
 * complete → success (entry stands alone); partial → warning (documentation
 * gaps); incomplete → error (a required component is absent).
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

/** Lily-token colour utility classes for a per-component presence pill. */
export function presentColor(present: boolean): string {
	return present
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Reviewing-clinician grade label. */
export function clinicianGradeLabel(grade: ClinicianGrade): string {
	switch (grade) {
		case 'fy1':
			return 'Foundation Year 1 (FY1)';
		case 'fy2':
			return 'Foundation Year 2 (FY2)';
		case 'core-trainee':
			return 'Core trainee';
		case 'specialty-registrar':
			return 'Specialty registrar';
		case 'acp':
			return 'Advanced clinical practitioner (ACP)';
		case 'physician-associate':
			return 'Physician associate';
		case 'consultant':
			return 'Consultant';
		default:
			return '';
	}
}

/** Observation-trend label. */
export function observationTrendLabel(trend: ObservationTrend): string {
	switch (trend) {
		case 'improving':
			return 'Improving';
		case 'stable':
			return 'Stable';
		case 'deteriorating':
			return 'Deteriorating';
		default:
			return '';
	}
}

/** VTE-status label. */
export function vteStatusLabel(status: VteStatus): string {
	switch (status) {
		case 'assessed':
			return 'Assessed';
		case 'not-required':
			return 'Not required';
		case 'not-done':
			return 'Not done';
		default:
			return '';
	}
}

/** Escalation / ceiling-of-care status label. */
export function escalationStatusLabel(status: EscalationStatus): string {
	switch (status) {
		case 'for-full-escalation':
			return 'For full escalation';
		case 'ward-level-ceiling':
			return 'Ward-level ceiling of care';
		case 'dnacpr':
			return 'DNACPR in place';
		case 'not-recorded':
			return 'Not recorded';
		default:
			return '';
	}
}
