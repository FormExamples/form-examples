import type { AssessmentData, FlagPriority, FollowUpTimeframe, SectionKey } from './types';

/** Calculate age from a date-of-birth string. Returns null on invalid input. */
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

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No field has been answered (either yes or no). */
export function isYesNoAnswered(value: string): boolean {
	return value === 'yes' || value === 'no';
}

/** True if any one of a set of boolean status flags is set. */
export function hasAnyStatusFlag(data: AssessmentData): boolean {
	const f = data.recommendations.statusFlags;
	return (
		f.cognitiveImpairment ||
		f.carerDependent ||
		f.spinalPrecautions ||
		f.weightBearingRestrictions ||
		f.palliativeCare
	);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'patientIdentification':
			return 'Patient Identification';
		case 'facilityDetails':
			return 'Facility Details';
		case 'situation':
			return 'Situation';
		case 'background':
			return 'Background';
		case 'assessment':
			return 'Assessment';
		case 'recommendations':
			return 'Recommendations';
		case 'providerSignOff':
			return 'Provider Sign-off';
	}
}

/** Lily-token colour classes for a flag priority badge. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error/80 text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for a flag priority. */
export function priorityLabel(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
	}
}

/** Highest priority among a set of flags (for the dashboard review column). */
export function highestPriority(priorities: FlagPriority[]): FlagPriority | 'none' {
	if (priorities.includes('urgent')) return 'urgent';
	if (priorities.includes('high')) return 'high';
	if (priorities.includes('medium')) return 'medium';
	if (priorities.includes('low')) return 'low';
	return 'none';
}

/** Human-readable label for a follow-up timeframe. */
export function followUpTimeframeLabel(tf: FollowUpTimeframe): string {
	switch (tf) {
		case 'urgent-within-24-hours':
			return 'Urgent (within 24h)';
		case '2-to-6-days':
			return '2–6 days';
		case '1-to-2-weeks':
			return '1–2 weeks';
		case 'more-than-2-weeks':
			return 'More than 2 weeks';
		case '':
			return '—';
	}
}
