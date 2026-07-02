import type {
	AssessmentData,
	Band,
	FiredSign,
	GradedTimepoint,
	GradingResult,
	Timepoint,
	Trend
} from './types';
import { apgarRules, signPoints } from './apgar-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Band for a per-timepoint total (0-10). */
export function bandForTotal(total: number): Band {
	return total >= 7 ? 'reassuring' : total >= 4 ? 'moderately-low' : 'low';
}

/**
 * Grade a single timepoint: sum the five signs, derive the band, and record how
 * many signs were answered.
 */
export function gradeTimepoint(t: Timepoint): GradedTimepoint {
	let total = 0;
	let answeredCount = 0;
	for (const rule of apgarRules) {
		total += rule.score(t);
		if (t[rule.sign] !== '') answeredCount++;
	}
	return {
		timepointMinutes: t.timepointMinutes,
		total,
		band: bandForTotal(total),
		answeredCount,
		scored: answeredCount > 0
	};
}

/** Sort graded timepoints by minutes after birth (nulls last). */
function byMinutes(a: GradedTimepoint, b: GradedTimepoint): number {
	const am = a.timepointMinutes == null ? Infinity : a.timepointMinutes;
	const bm = b.timepointMinutes == null ? Infinity : b.timepointMinutes;
	return am - bm;
}

/**
 * Collect the signs that scored below 2 (contributing to a reduced total) at
 * each scored timepoint. These are the "fired" signs surfaced in the report.
 */
export function evaluateFiredSigns(data: AssessmentData): FiredSign[] {
	const fired: FiredSign[] = [];
	for (const t of data.timepoints) {
		const anyAnswered = apgarRules.some((r) => t[r.sign] !== '');
		if (!anyAnswered) continue;
		for (const rule of apgarRules) {
			const raw = t[rule.sign];
			if (raw === '') continue;
			const points = signPoints(raw);
			if (points < 2) {
				fired.push({
					id: rule.id,
					timepointMinutes: t.timepointMinutes,
					sign: rule.sign,
					points,
					category: rule.category,
					description: rule.description
				});
			}
		}
	}
	return fired;
}

/** Trend across consecutive scored timepoints, ordered by minutes. */
export function trendFor(scored: GradedTimepoint[]): Trend {
	if (scored.length < 2) return 'insufficient';
	const latest = scored[scored.length - 1].total;
	const previous = scored[scored.length - 2].total;
	return latest > previous ? 'improving' : latest < previous ? 'falling' : 'static';
}

/**
 * Pure function: compute the full Apgar grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   total(t) = appearance + pulse + grimace + activity + respiration        // 0..10
 *   band(t)  = total >= 7 ? 'reassuring' : total >= 4 ? 'moderately-low' : 'low'
 *   trend    = < 2 scored timepoints -> 'insufficient'
 *            | latest > previous     -> 'improving'
 *            | latest < previous     -> 'falling'
 *            | otherwise             -> 'static'
 *
 * A missing sign contributes 0 to that timepoint's total (absent, not scored);
 * `flagged-issues.ts` raises a data-completeness flag separately. Trend operates
 * on scored timepoints only, sorted by minutes after birth.
 */
export function calculateApgarGrade(data: AssessmentData): GradingResult {
	const timepoints = (data.timepoints || []).map(gradeTimepoint);

	const scored = timepoints.filter((g) => g.scored).slice().sort(byMinutes);
	const trend = trendFor(scored);
	const firedSigns = evaluateFiredSigns(data);
	const flaggedIssues = detectFlaggedIssues(data, timepoints);

	return {
		timepoints,
		trend,
		firedSigns,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
