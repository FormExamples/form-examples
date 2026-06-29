// Presentation helpers for the Audio-Vestibular Assessment: human-readable
// labels and Lily-token colour classes for the WHO hearing-loss grade and the
// DHI handicap level, plus small derivations (age, severity ordering).

import type { AdditionalFlag, DhiHandicapLevel, HearingLossGrade } from './types';

/** Calculate age in whole years from a date-of-birth string. */
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

/** Friendly label for a WHO hearing-loss grade. */
export function hearingLossGradeLabel(grade: HearingLossGrade): string {
	switch (grade) {
		case 'normal':
			return 'Normal hearing';
		case 'mild':
			return 'Mild hearing loss';
		case 'moderate':
			return 'Moderate hearing loss';
		case 'moderately-severe':
			return 'Moderately severe hearing loss';
		case 'severe':
			return 'Severe hearing loss';
		case 'profound':
			return 'Profound hearing loss';
		default:
			return 'Not assessed';
	}
}

/** Short dashboard label for a WHO hearing-loss grade. */
export function hearingLossGradeShort(grade: HearingLossGrade): string {
	switch (grade) {
		case 'normal':
			return 'Normal';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'moderately-severe':
			return 'Moderately Severe';
		case 'severe':
			return 'Severe';
		case 'profound':
			return 'Profound';
		default:
			return '—';
	}
}

/** Lily-token colour class for a WHO hearing-loss grade. */
export function hearingLossGradeColor(grade: HearingLossGrade): string {
	switch (grade) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-info text-info-content border-info';
		case 'moderate':
		case 'moderately-severe':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
		case 'profound':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a DHI handicap level. */
export function dhiHandicapLabel(level: DhiHandicapLevel): string {
	switch (level) {
		case 'no-handicap':
			return 'No handicap';
		case 'mild':
			return 'Mild handicap';
		case 'moderate':
			return 'Moderate handicap';
		case 'severe':
			return 'Severe handicap';
		default:
			return '';
	}
}

/** Short dashboard label for a DHI handicap level. */
export function dhiHandicapShort(level: DhiHandicapLevel): string {
	switch (level) {
		case 'no-handicap':
			return 'No Handicap';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		default:
			return '—';
	}
}

/** Lily-token colour class for a DHI handicap level. */
export function dhiHandicapColor(level: DhiHandicapLevel): string {
	switch (level) {
		case 'no-handicap':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour class for a flag priority. */
export function priorityColor(priority: AdditionalFlag['priority']): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
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
