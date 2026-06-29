import type { Outcome, TriState, TraineeRole } from './types';

// ──────────────────────────────────────────────
// AHA BLS adult acceptable physiologic ranges
// ──────────────────────────────────────────────

/** Critical-action rule IDs (any failure forces an overall Fail). */
export const CRITICAL_RULE_IDS = [
	'BLS-CC-RATE',
	'BLS-CC-DEPTH',
	'BLS-AB-CHEST-RISE',
	'BLS-AED-SAFE-SHOCK'
];

export const COMPRESSION_RATE_MIN = 100;
export const COMPRESSION_RATE_MAX = 120;
export const COMPRESSION_DEPTH_MIN = 5.0;
export const COMPRESSION_DEPTH_MAX = 6.0;

/** Is a measured compression rate within the AHA BLS adult range? */
export function compressionRateInRange(rate: number | null): boolean {
	return rate !== null && rate !== undefined && rate >= COMPRESSION_RATE_MIN && rate <= COMPRESSION_RATE_MAX;
}

/** Is a measured compression depth within the AHA BLS adult range? */
export function compressionDepthInRange(depth: number | null): boolean {
	return depth !== null && depth !== undefined && depth >= COMPRESSION_DEPTH_MIN && depth <= COMPRESSION_DEPTH_MAX;
}

// ──────────────────────────────────────────────
// Label helpers
// ──────────────────────────────────────────────

/** Friendly label for the overall outcome. */
export function outcomeLabel(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'Pass';
		case 'fail':
			return 'Fail';
		default:
			return 'Not graded';
	}
}

/** Lily token colour triple for the overall outcome (Badge / banner). */
export function outcomeColor(outcome: Outcome): string {
	switch (outcome) {
		case 'pass':
			return 'bg-success text-success-content border-success';
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

/** Lily token colour triple for a tri-state checklist response. */
export function triStateColor(status: TriState): string {
	switch (status) {
		case 'yes':
			return 'bg-success text-success-content border-success';
		case 'no':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a trainee role. */
export function roleLabel(role: TraineeRole): string {
	switch (role) {
		case 'instructor':
			return 'Instructor';
		case 'first-responder':
			return 'First responder';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
		case 'physician':
			return 'Physician';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Has a prior certification expiry date already passed? */
export function certificationExpired(expiry: string): boolean {
	if (!expiry) return false;
	const expiryDate = new Date(expiry);
	return !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now();
}
