import type { EligibleConditionCode, RulePriority } from './types';

/**
 * Number of whole days between two YYYY-MM-DD dates (later - earlier).
 * Returns null when either input is missing or unparseable.
 */
export function daysBetween(earlier: string, later: string): number | null {
	if (!earlier || !later) return null;
	const a = new Date(earlier);
	const b = new Date(later);
	if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
	const ms = b.getTime() - a.getTime();
	return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/**
 * Whole-year age (in years) from a YYYY-MM-DD birth date relative to today.
 * Returns null when the birth date is missing or unparseable.
 */
export function ageInYears(birthDate: string, reference: Date = new Date()): number | null {
	if (!birthDate) return null;
	const d = new Date(birthDate);
	if (isNaN(d.getTime())) return null;
	let age = reference.getFullYear() - d.getFullYear();
	const m = reference.getMonth() - d.getMonth();
	if (m < 0 || (m === 0 && reference.getDate() < d.getDate())) {
		age -= 1;
	}
	return age;
}

/** Add `years` to a YYYY-MM-DD date and return YYYY-MM-DD. Returns '' on bad input. */
export function addYears(dateStr: string, years: number): string {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return '';
	d.setFullYear(d.getFullYear() + years);
	return toIsoDate(d);
}

/** Today's date as YYYY-MM-DD. */
export function todayIso(reference: Date = new Date()): string {
	return toIsoDate(reference);
}

/** Convert a Date to YYYY-MM-DD. */
export function toIsoDate(d: Date): string {
	const yyyy = d.getFullYear().toString().padStart(4, '0');
	const mm = (d.getMonth() + 1).toString().padStart(2, '0');
	const dd = d.getDate().toString().padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

/** Tailwind colour classes for a priority badge. */
export function priorityColor(priority: RulePriority | ''): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for a priority. */
export function priorityLabel(priority: RulePriority | ''): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
		default:
			return '';
	}
}

/** Numeric ordering for priority sort: urgent < high < medium < low. */
export function priorityOrder(priority: RulePriority): number {
	switch (priority) {
		case 'urgent':
			return 0;
		case 'high':
			return 1;
		case 'medium':
			return 2;
		case 'low':
			return 3;
	}
}

/** True when a string looks like a non-empty trimmed value. */
export function isFilled(value: string): boolean {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Light-touch shape check for a 10-digit NHS number (ignoring spaces).
 * Does *not* validate the Modulus-11 checksum.
 */
export function looksLikeNhsNumber(value: string): boolean {
	if (!isFilled(value)) return false;
	const compact = value.replace(/\s+/g, '');
	return /^\d{10}$/.test(compact);
}

/** Human-readable label for an eligible-condition code. */
export function conditionLabel(code: EligibleConditionCode | ''): string {
	switch (code) {
		case 'permanent-fistula':
			return 'Permanent fistula requiring continuous surgical dressing or appliance';
		case 'hypoadrenalism':
			return "Hypoadrenalism (e.g. Addison's disease) on substitution therapy";
		case 'diabetes-insipidus-or-hypopituitarism':
			return 'Diabetes insipidus or hypopituitarism';
		case 'diabetes-mellitus-not-diet-only':
			return 'Diabetes mellitus (not diet alone)';
		case 'hypoparathyroidism':
			return 'Hypoparathyroidism';
		case 'myasthenia-gravis':
			return 'Myasthenia gravis';
		case 'myxoedema':
			return 'Myxoedema (hypothyroidism requiring thyroid hormone replacement)';
		case 'epilepsy-on-anticonvulsant':
			return 'Epilepsy requiring continuous anticonvulsive therapy';
		case 'continuing-physical-disability':
			return 'Continuing physical disability — cannot leave home unaided';
		case 'cancer-or-effects':
			return 'Cancer (active treatment, effects of cancer, or effects of treatment)';
		default:
			return '';
	}
}
