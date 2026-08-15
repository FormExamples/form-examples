import type { FiredRule, Instrument } from './types';

/** Round to one decimal place, the precision the SQL schema stores. */
export function round1(n: number): number {
	return Math.round(n * 10) / 10;
}

/** Coerce a possibly-empty numeric field to a number or null. */
export function num(v: number | string | null | undefined): number | null {
	if (v === null || v === undefined || v === '') return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

/** Build a fired-rule record in the shape the grade_rule table stores. */
export function rule(
	ruleId: string,
	instrument: Instrument,
	component: string,
	score: number | null,
	band: string,
	category: string,
	description: string
): FiredRule {
	return { ruleId, instrument, component, score, band, category, description };
}

/**
 * Age in whole years at the assessment date, or null when either date is
 * unknown. The assessment date is passed in rather than read from the clock so
 * the engine stays pure.
 */
export function ageInYears(birthDate: string, assessmentDate: string): number | null {
	if (!birthDate) return null;
	const born = new Date(birthDate);
	const at = assessmentDate ? new Date(assessmentDate) : null;
	if (Number.isNaN(born.getTime()) || !at || Number.isNaN(at.getTime())) return null;
	let age = at.getFullYear() - born.getFullYear();
	const m = at.getMonth() - born.getMonth();
	if (m < 0 || (m === 0 && at.getDate() < born.getDate())) age -= 1;
	return age;
}

/** Title-case a kebab-case value for display. */
export function titleCase(s: string): string {
	return String(s || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}
