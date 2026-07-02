// Declarative Partogram progress rules and classification functions.
//
// The Partogram is NOT a validated numeric score: rather than summing points,
// the engine plots the latest cervical-dilatation observation against two
// reference lines and classifies labour progress. The pure functions below
// implement the alert / action line geometry and the precedence-ordered
// classification from spec §4; `partogram-grader.ts` calls them and
// `flagged-issues.ts` reuses the thresholds.
//
// Geometry (spec §4). Let the latest observation carrying a non-null cervical
// dilatation be D at time T, and let t be the elapsed hours from
// `activePhaseStartAt` to T (clamped at >= 0):
//
//   alertLineExpectedCm  = 4 + t        // 1 cm/hour from 4 cm; 10 cm at t = 6 h
//   actionLineExpectedCm = t            // 4 + (t - 4); four hours right of alert
//
//   progressClassification =
//       D >= alertLineExpectedCm  ? 'normal'
//     : D >  actionLineExpectedCm ? 'alertLineCrossed'
//     :                             'actionLineCrossed'
//
// A point is "right of" a line when its dilatation is LESS than that line's
// expected dilatation for the elapsed time.

import type { ProgressClassification } from './types';

/** Cervical dilatation (cm) at which the active phase — and the alert line — begins. */
export const ALERT_LINE_START_CM = 4;

/** Hours the action line is shifted to the right of the alert line. */
export const ACTION_LINE_OFFSET_HOURS = 4;

/** Fetal heart-rate bounds (bpm); outside this band raises a flag. */
export const FHR_LOW_BPM = 110;
export const FHR_HIGH_BPM = 160;

/** Maternal-vital thresholds. */
export const TEMPERATURE_FEVER_C = 37.5;
export const SYSTOLIC_HYPERTENSION_MMHG = 140;
export const DIASTOLIC_HYPERTENSION_MMHG = 90;
export const PULSE_TACHYCARDIA_BPM = 120;
export const SYSTOLIC_HYPOTENSION_MMHG = 90;

/** Hours of active labour without dilatation increase that raises poor-progress. */
export const POOR_PROGRESS_HOURS = 4;

/** Milliseconds per hour. */
export const MS_PER_HOUR = 1000 * 60 * 60;

/** Coerce a value to a finite number, or null when absent / non-numeric. */
export function num(v: unknown): number | null {
	return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v) ? v : null;
}

/**
 * Elapsed hours between two ISO-ish datetime strings, clamped at >= 0. Returns
 * null when either timestamp is missing or unparseable.
 */
export function elapsedHours(startAt: string, observedAt: string): number | null {
	if (!startAt || !observedAt) return null;
	const start = Date.parse(startAt);
	const obs = Date.parse(observedAt);
	if (Number.isNaN(start) || Number.isNaN(obs)) return null;
	const hours = (obs - start) / MS_PER_HOUR;
	return hours < 0 ? 0 : hours;
}

/** Expected dilatation (cm) on the alert line at elapsed time t hours. */
export function alertLineExpectedCm(t: number): number {
	return ALERT_LINE_START_CM + t;
}

/**
 * Expected dilatation (cm) on the action line at elapsed time t hours
 * (four hours to the right of the alert line): 4 + (t - 4) = t.
 */
export function actionLineExpectedCm(t: number): number {
	return t;
}

/** Classify labour progress for a plotted point D at elapsed time t (spec §4). */
export function classifyProgress(dilatationCm: number, t: number): ProgressClassification {
	const alert = alertLineExpectedCm(t);
	const action = actionLineExpectedCm(t);
	if (dilatationCm >= alert) return 'normal';
	if (dilatationCm > action) return 'alertLineCrossed';
	return 'actionLineCrossed';
}
