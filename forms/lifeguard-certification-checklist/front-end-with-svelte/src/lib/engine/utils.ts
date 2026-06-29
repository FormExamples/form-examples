import type { Outcome, TriState } from './types';

// ──────────────────────────────────────────────
// Acceptable physiologic / NPLQ ranges for the numeric inputs.
// ──────────────────────────────────────────────

/** NPLQ: 50 m timed swim in ≤ 60 s. */
export const SWIM_50M_MAX_SECONDS = 60;
/** 6 min target for 200 m mixed strokes. */
export const SWIM_200M_MAX_SECONDS = 360;
export const COMPRESSION_RATE_MIN = 100;
export const COMPRESSION_RATE_MAX = 120;
export const COMPRESSION_DEPTH_MIN = 5.0;
export const COMPRESSION_DEPTH_MAX = 6.0;
/** ILSF target time-to-first-shock. */
export const SLOW_AED_SECONDS = 90;
/** Typical NPLQ pool surface-dive depth. */
export const SURFACE_DIVE_MIN_METRES = 1.5;

/** RLSS UK NPLQ / ILSF critical competencies (any failure → overall Fail). */
export const CRITICAL_RULE_IDS: string[] = [
	'LIFE-PF-50M-TIME',
	'LIFE-SCAN-PATTERN',
	'LIFE-RU-TOW',
	'LIFE-RU-EXTRICATE',
	'LIFE-SP-HEADSPLINT',
	'LIFE-SP-BOARD',
	'LIFE-CPR-COMPRESSIONS',
	'LIFE-CPR-AED-PROMPT'
];

/** True when the 50 m swim time is within the NPLQ target. */
export function swim50mWithinTarget(sec: number | null): boolean {
	return sec !== null && sec !== undefined && sec > 0 && sec <= SWIM_50M_MAX_SECONDS;
}

/** True when the 200 m swim time is within the suggested target. */
export function swim200mWithinTarget(sec: number | null): boolean {
	return sec !== null && sec !== undefined && sec > 0 && sec <= SWIM_200M_MAX_SECONDS;
}

/** True when the compression rate is in the resuscitation-council range. */
export function compressionRateInRange(rate: number | null): boolean {
	return (
		rate !== null && rate !== undefined && rate >= COMPRESSION_RATE_MIN && rate <= COMPRESSION_RATE_MAX
	);
}

/** True when the compression depth is in the resuscitation-council range. */
export function compressionDepthInRange(depth: number | null): boolean {
	return (
		depth !== null &&
		depth !== undefined &&
		depth >= COMPRESSION_DEPTH_MIN &&
		depth <= COMPRESSION_DEPTH_MAX
	);
}

/** True when the surface-dive depth meets the suggested NPLQ minimum. */
export function surfaceDiveDepthAdequate(m: number | null): boolean {
	return m !== null && m !== undefined && m >= SURFACE_DIVE_MIN_METRES;
}

// ──────────────────────────────────────────────
// Outcome / TriState label + colour helpers
// ──────────────────────────────────────────────

/** Friendly label for an outcome. */
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

/** Lily token colour triple for an outcome badge/banner. */
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

/** Friendly label for a tri-state response. */
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

/** Lily token colour triple for a tri-state pill. */
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

/** Calculate age from a date-of-birth string. */
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

/** Friendly label for a venue type. */
export function venueTypeLabel(venue: string): string {
	switch (venue) {
		case 'pool':
			return 'Swimming pool';
		case 'beach':
			return 'Beach';
		case 'inland-water':
			return 'Inland water';
		case 'water-park':
			return 'Water park';
		case 'leisure':
			return 'Leisure centre';
		case 'other':
			return 'Other';
		default:
			return '—';
	}
}
