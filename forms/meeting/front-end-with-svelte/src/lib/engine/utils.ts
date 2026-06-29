import type {
	Health,
	CompletionStatus,
	MeetingStatus,
	OverallResult,
	MeetingCategory
} from './types';

/** Human-readable label for the overall record health. */
export function healthLabel(health: Health): string {
	switch (health) {
		case 'green':
			return 'Healthy';
		case 'amber':
			return 'Needs attention';
		case 'red':
			return 'Action required';
	}
}

/** Lily token classes for the overall record health (bg/text/border triple). */
export function healthColor(health: Health): string {
	switch (health) {
		case 'green':
			return 'bg-success text-success-content border-success';
		case 'amber':
			return 'bg-warning text-warning-content border-warning';
		case 'red':
			return 'bg-error text-error-content border-error';
	}
}

/** Human-readable label for the completion status. */
export function completionStatusLabel(status: CompletionStatus): string {
	switch (status) {
		case 'planned':
			return 'Planned';
		case 'in-progress':
			return 'In progress';
		case 'complete':
			return 'Complete';
		case 'incomplete':
			return 'Incomplete';
	}
}

/** Lily token classes for a fired-rule grade (red = blocking, amber = advisory). */
export function gradeColor(grade: 'red' | 'amber'): string {
	return grade === 'red'
		? 'bg-error text-error-content border-error'
		: 'bg-warning text-warning-content border-warning';
}

/** Lily token classes for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Title-case a meeting status for display. */
export function statusLabel(status: MeetingStatus): string {
	if (!status) return 'Draft';
	return status
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

/** Title-case a meeting category for display. */
export function categoryLabel(category: MeetingCategory): string {
	if (!category) return '—';
	return category
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

/** Human-readable label for the overall sign-off result. */
export function overallResultLabel(result: OverallResult): string {
	if (!result) return '—';
	return result.charAt(0).toUpperCase() + result.slice(1);
}

/** Format an ISO datetime/date string for display, leaving blanks untouched. */
export function formatDateTime(value: string): string {
	if (!value) return '—';
	const d = new Date(value);
	if (isNaN(d.getTime())) return value;
	return d.toLocaleString();
}

/** Format a date-only string for display. */
export function formatDate(value: string): string {
	if (!value) return '—';
	const d = new Date(value);
	if (isNaN(d.getTime())) return value;
	return d.toLocaleDateString();
}
