/** Completeness level label. */
export function completenessLevelLabel(level: string): string {
	switch (level) {
		case 'incomplete':
			return 'Incomplete';
		case 'partial':
			return 'Partial';
		case 'complete':
			return 'Complete';
		case 'verified':
			return 'Verified';
		default:
			return level;
	}
}

/** Completeness level colour class. */
export function completenessLevelColor(level: string): string {
	switch (level) {
		case 'incomplete':
			return 'bg-error text-error-content border-error';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'verified':
			return 'bg-info text-info-content border-info';
		default:
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

/** Format date for display (DD/MM/YYYY). */
export function formatDate(dateStr: string): string {
	if (!dateStr) return 'Not specified';
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return dateStr;
	return date.toLocaleDateString('en-GB');
}

/** Get priority colour class. */
export function priorityColor(priority: string): string {
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

/** Place of care/death label. */
export function placeLabel(place: string): string {
	switch (place) {
		case 'home':
			return 'Home';
		case 'hospital':
			return 'Hospital';
		case 'hospice':
			return 'Hospice';
		case 'care-home':
			return 'Care Home';
		case 'no-preference':
			return 'No Preference';
		default:
			return place || 'Not specified';
	}
}
