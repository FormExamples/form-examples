import type { SeverityCategory } from './types';

/** Lily-token colour triple for a PCL-5 severity category. */
export function categoryColor(category: SeverityCategory): string {
	switch (category) {
		case 'Minimal':
			return 'bg-success text-success-content border-success';
		case 'Mild':
			return 'bg-warning text-warning-content border-warning';
		case 'Moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'Severe':
			return 'bg-error text-error-content border-error';
	}
}

/** Clinical interpretation of a PCL-5 severity category. */
export function categoryDescription(category: SeverityCategory): string {
	switch (category) {
		case 'Minimal':
			return 'Below clinical concern';
		case 'Mild':
			return 'Sub-threshold symptoms; monitor and offer support';
		case 'Moderate':
			return 'Probable PTSD (≥ 33 is the recommended provisional cut-off); diagnostic interview recommended';
		case 'Severe':
			return 'Clinically significant PTSD; trauma-focused therapy indicated';
	}
}

/** Lily-token colour triple for a fired-rule severity. */
export function severityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
	switch (severity) {
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Lily-token colour triple for an additional-flag priority. */
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

/** Calculate age from date of birth string. */
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
