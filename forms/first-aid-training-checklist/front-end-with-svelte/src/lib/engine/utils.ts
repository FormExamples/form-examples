import type { Outcome, TriState, TraineeRole } from './types';

/** Friendly label for an overall outcome. */
export function outcomeLabel(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'Pass';
		case 'needs-development':
			return 'Needs Development';
		case 'fail':
			return 'Fail';
		default:
			return 'Not graded';
	}
}

/** Lily-token colour triple for an outcome banner/badge. */
export function outcomeColor(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'bg-success text-success-content border-success';
		case 'needs-development':
			return 'bg-warning text-warning-content border-warning';
		case 'fail':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a tri-state checklist response. */
export function triStateLabel(status: TriState): string {
	switch (status) {
		case 'yes':
			return 'Demonstrated';
		case 'no':
			return 'Not yet';
		case 'na':
			return 'Not assessed';
		default:
			return '—';
	}
}

/** Lily-token colour triple for a tri-state pill. */
export function triStateColor(status: TriState): string {
	switch (status) {
		case 'yes':
			return 'bg-success text-success-content border-success';
		case 'no':
			return 'bg-error text-error-content border-error';
		case 'na':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a trainee workplace role. */
export function traineeRoleLabel(role: TraineeRole): string {
	switch (role) {
		case 'first-aider':
			return 'First Aider';
		case 'workplace-first-aider':
			return 'Workplace First Aider';
		case 'instructor-candidate':
			return 'Instructor Candidate';
		case 'security-officer':
			return 'Security Officer';
		case 'lifeguard':
			return 'Lifeguard';
		case 'teacher':
			return 'Teacher';
		case 'volunteer':
			return 'Volunteer';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Format a "Surname, Given" display name from trainee details. */
export function formatTraineeName(firstName: string, lastName: string): string {
	const f = firstName.trim();
	const l = lastName.trim();
	if (l && f) return `${l}, ${f}`;
	return l || f || '';
}

/**
 * Certification-currency band derived from an expiry date relative to "today":
 *   - 'current'       — expires more than 60 days from now
 *   - 'expiring-soon' — expires within 60 days (inclusive)
 *   - 'expired'       — expiry date has passed
 *   - ''              — no expiry recorded
 */
export type CertificationCurrency = 'current' | 'expiring-soon' | 'expired' | '';

export function certificationCurrency(
	expiry: string,
	now: Date = new Date()
): CertificationCurrency {
	if (!expiry) return '';
	const expiryDate = new Date(expiry);
	if (Number.isNaN(expiryDate.getTime())) return '';
	const days = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
	if (days < 0) return 'expired';
	if (days <= 60) return 'expiring-soon';
	return 'current';
}

/** Friendly label for a certification-currency band. */
export function certificationCurrencyLabel(band: CertificationCurrency): string {
	switch (band) {
		case 'current':
			return 'Current';
		case 'expiring-soon':
			return 'Expiring Soon';
		case 'expired':
			return 'Expired';
		default:
			return '—';
	}
}
