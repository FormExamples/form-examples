import type { ChecklistStatus, SafetyFlagPriority, Urgency } from './types.js';

/** Human-readable label for a checklist lifecycle status. */
export function statusLabel(status: ChecklistStatus): string {
	switch (status) {
		case 'not-started':
			return 'Not started';
		case 'sign-in-complete':
			return 'Sign In complete';
		case 'time-out-complete':
			return 'Time Out complete';
		case 'sign-out-complete':
			return 'Sign Out complete';
		case 'completed':
			return 'Completed';
		case 'abandoned':
			return 'Abandoned';
		default:
			return status;
	}
}

/** Lily token colour triple for a checklist lifecycle status banner. */
export function statusColor(status: ChecklistStatus): string {
	switch (status) {
		case 'completed':
			return 'bg-success text-success-content border-success';
		case 'abandoned':
			return 'bg-error text-error-content border-error';
		case 'not-started':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-info text-info-content border-info';
	}
}

/** Human-readable label for a case urgency. */
export function urgencyLabel(urgency: Urgency): string {
	switch (urgency) {
		case 'elective':
			return 'Elective';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		case 'immediate':
			return 'Immediate';
		default:
			return '—';
	}
}

/** Lily token colour triple for a safety-flag priority badge. */
export function priorityColor(priority: SafetyFlagPriority): string {
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
