// Time-to-surgery gating: the computation that distinguishes this form from
// an ordinary pre-operative assessment. See doc/time-to-surgery-gating.md.
//
// Pure: both dates come from the recorded data, never from the system clock.

import type { DomainEvaluation, DomainResult, DomainStatus } from './types';

export const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Whole weeks between the assessment date and the planned surgery date.
 *
 * Returns null when either date is missing or unparseable, which disables
 * gating. A negative value is returned as-is rather than clamped: a surgery
 * date before the assessment date is either a data-entry error or an assessment
 * done after the fact, and both should be visible rather than hidden.
 *
 * @param {string} assessmentDate - ISO date "YYYY-MM-DD"
 * @param {string} plannedSurgeryDate - ISO date "YYYY-MM-DD"
 * @returns {number|null}
 */
export function weeksBetween(
	assessmentDate: string,
	plannedSurgeryDate: string
): number | null {
	if (!assessmentDate || !plannedSurgeryDate) return null;
	const from = new Date(assessmentDate);
	const to = new Date(plannedSurgeryDate);
	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
	return Math.floor((to.getTime() - from.getTime()) / MILLISECONDS_PER_WEEK);
}

/**
 * Grade one domain against the time available.
 *
 * @param {object} evaluation - the domain evaluator's output
 * @param {number|null} weeksToSurgery
 * @returns {{ status: string, weeksShortfall: number|null }}
 */
export function gateDomain(
	evaluation: DomainEvaluation,
	weeksToSurgery: number | null
): { status: DomainStatus; weeksShortfall: number | null } {
	if (!evaluation.triggered) {
		return {
			status: evaluation.applicable ? 'optimised' : 'not-applicable',
			weeksShortfall: null
		};
	}

	// Ungated: no surgery date, so report the least alarming actionable status
	// and let the report say that gating could not be applied.
	if (weeksToSurgery === null) {
		return { status: 'action-required', weeksShortfall: null };
	}

	const shortfall = evaluation.leadTimeWeeks - weeksToSurgery;

	if (weeksToSurgery >= evaluation.leadTimeWeeks) {
		return {
			status: evaluation.started ? 'in-progress' : 'action-required',
			weeksShortfall: null
		};
	}

	return { status: 'insufficient-time', weeksShortfall: shortfall };
}

/**
 * The earliest surgery date at which every triggered domain would have had its
 * full lead time, derived from the largest shortfall. Returns '' when nothing
 * is short or when gating could not be applied.
 *
 * @param {object[]} domains - the gated domain results
 * @param {string} plannedSurgeryDate - ISO date "YYYY-MM-DD"
 * @returns {string} ISO date, or ''
 */
export function recommendedEarliestSurgeryDate(
	domains: DomainResult[],
	plannedSurgeryDate: string
): string {
	if (!plannedSurgeryDate) return '';
	const shortfalls = domains
		.map((d) => d.weeksShortfall)
		.filter((w): w is number => typeof w === 'number' && w > 0);
	if (shortfalls.length === 0) return '';
	const worst = Math.max(...shortfalls);
	const planned = new Date(plannedSurgeryDate);
	if (Number.isNaN(planned.getTime())) return '';
	const moved = new Date(planned.getTime() + worst * MILLISECONDS_PER_WEEK);
	return moved.toISOString().slice(0, 10);
}

