import type { SeverityLevel } from './types';

/** Calculate age (whole years) from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** SNOT-22 severity band full label. */
export function severityLabel(level: SeverityLevel): string {
	switch (level) {
		case 'severe':
			return 'Severe — significant impact';
		case 'moderate':
			return 'Moderate — targeted management advised';
		case 'mild':
			return 'Mild — minimal impact';
	}
}

/** SNOT-22 severity band short label (dashboard / badge). */
export function severityShortLabel(level: SeverityLevel): string {
	switch (level) {
		case 'severe':
			return 'Severe';
		case 'moderate':
			return 'Moderate';
		case 'mild':
			return 'Mild';
	}
}

/** Lily token colour triple for a SNOT-22 severity band. */
export function severityColor(level: SeverityLevel): string {
	switch (level) {
		case 'severe':
			return 'bg-error text-error-content border-error';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'mild':
			return 'bg-success text-success-content border-success';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}
