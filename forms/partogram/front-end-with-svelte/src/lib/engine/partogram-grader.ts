// Partogram grader. Pure function: takes an `AssessmentData` object (a parent
// labour-record header plus its repeating timed observation list) and derives
// the labour-progress classification and the reference-line geometry (spec §4),
// then attaches the independently-computed flagged issues.
//
// This is NOT a numeric score — it emits:
//
//   activePhaseStartAt    = echo of the reference time for the lines
//   latestDilatationCm    = dilatation of the latest timed observation carrying
//                           a non-null cervical dilatation (D)
//   elapsedHours          = hours from activePhaseStartAt to that observation (t)
//   alertLineExpectedCm   = 4 + t
//   actionLineExpectedCm  = t
//   progressClassification = normal | alertLineCrossed | actionLineCrossed
//   firedLines[]          = which reference lines the latest point has crossed
//   flaggedIssues[]       = threshold flags scanned across the whole series
//
// With no dilatation observation, or a null activePhaseStartAt, the
// classification is `normal`, the line-expected values are null, and an
// incomplete-observation flag is raised by `flagged-issues.ts`.

import type { AssessmentData, GradingResult, FiredLine, Observation } from './types';
import {
	num,
	elapsedHours,
	alertLineExpectedCm,
	actionLineExpectedCm,
	classifyProgress
} from './partogram-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Find the latest observation (by `observedAt`) carrying a non-null cervical
 * dilatation. Rows without a parseable time are considered earlier than any
 * timed row, but still eligible when they are the only dilatation reading.
 */
export function latestDilatationObservation(observations: Observation[]): Observation | null {
	const withDilatation = observations.filter((o) => num(o.cervicalDilatationCm) !== null);
	if (withDilatation.length === 0) return null;

	let best: Observation | null = null;
	let bestTime = -Infinity;
	for (const o of withDilatation) {
		const t = o.observedAt ? Date.parse(o.observedAt) : NaN;
		const key = Number.isNaN(t) ? -Infinity : t;
		if (best === null || key >= bestTime) {
			best = o;
			bestTime = key;
		}
	}
	return best;
}

/**
 * Compute the full partogram grade for the supplied record: the reference-line
 * geometry and progress classification, plus the flagged issues and a timestamp.
 */
export function calculateGrade(data: AssessmentData): GradingResult {
	const observations = data.observations || [];
	const activePhaseStartAt = data.context.activePhaseStartAt || null;

	const latest = latestDilatationObservation(observations);
	const latestDilatationCm = latest ? num(latest.cervicalDilatationCm) : null;

	// No plottable point, or no reference time: classification defaults to normal
	// and the line-expected values are null (spec §4).
	const t =
		latest && activePhaseStartAt ? elapsedHours(activePhaseStartAt, latest.observedAt) : null;

	let partial: Omit<GradingResult, 'flaggedIssues' | 'timestamp'>;

	if (latestDilatationCm === null || t === null) {
		partial = {
			activePhaseStartAt,
			latestDilatationCm,
			elapsedHours: null,
			alertLineExpectedCm: null,
			actionLineExpectedCm: null,
			progressClassification: 'normal',
			firedLines: []
		};
	} else {
		const alert = alertLineExpectedCm(t);
		const action = actionLineExpectedCm(t);
		const progressClassification = classifyProgress(latestDilatationCm, t);

		const firedLines: FiredLine[] = [];
		if (latestDilatationCm < alert) {
			firedLines.push({
				id: 'alert',
				description: `Latest dilatation ${latestDilatationCm} cm is below the alert-line expectation of ${alert.toFixed(1)} cm at ${t.toFixed(1)} h`
			});
		}
		if (latestDilatationCm <= action) {
			firedLines.push({
				id: 'action',
				description: `Latest dilatation ${latestDilatationCm} cm is on or right of the action line (${action.toFixed(1)} cm at ${t.toFixed(1)} h)`
			});
		}

		partial = {
			activePhaseStartAt,
			latestDilatationCm,
			elapsedHours: t,
			alertLineExpectedCm: alert,
			actionLineExpectedCm: action,
			progressClassification,
			firedLines
		};
	}

	const flaggedIssues = detectFlaggedIssues(data, partial);

	return {
		...partial,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
