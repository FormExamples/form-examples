// Declarative Fluid Balance Chart rules and classification.
//
// The Fluid Balance Chart is NOT a validated named clinical score: rather than
// summing points, the engine arithmetically reconciles the recorded intake and
// output volumes and grades the resulting *fluid status*. The pure functions
// below implement the thresholds and the precedence-ordered classification from
// spec §4.
//
// Boundaries (spec §4):
//   scale               = hoursObserved / 24
//   positiveThresholdMl = 1000 * scale        (default +1000 mL per 24 h)
//   negativeThresholdMl = 1000 * scale        (default -1000 mL per 24 h)
//   fluidStatus (first match wins):
//     oliguria  when urineRate != null && hoursObserved >= 6 && urineRate < 0.5
//     positive  when netBalanceMl >=  positiveThresholdMl
//     negative  when netBalanceMl <= -negativeThresholdMl
//     balanced  otherwise

import type { FluidStatus } from './types';

/** Default significant-balance threshold in mL per 24 h (spec §4). */
export const SIGNIFICANT_BALANCE_ML_PER_24H = 1000;

/** KDIGO oliguria urine-output threshold in mL/kg/h. */
export const OLIGURIA_RATE_ML_PER_KG_PER_HOUR = 0.5;

/** Anuria urine-output threshold in mL/kg/h. */
export const ANURIA_RATE_ML_PER_KG_PER_HOUR = 0.05;

/** Minimum observation window (hours) for oliguria to be meaningful. */
export const OLIGURIA_MIN_HOURS = 6;

/** Minimum observation window (hours) for the absolute-volume anuria test. */
export const ANURIA_MIN_HOURS = 12;

/** Absolute urine-output floor (mL) below which, over >= 12 h, anuria fires. */
export const ANURIA_ABSOLUTE_ML = 100;

/**
 * Scale the significant-balance threshold to the observed charting period.
 * Defaults to +/-1000 mL per 24 h and scales linearly. A non-positive
 * `hoursObserved` yields the unscaled 24-hour threshold.
 */
export function significantBalanceThresholdMl(hoursObserved: number): number {
	const scale = hoursObserved > 0 ? hoursObserved / 24 : 1;
	return SIGNIFICANT_BALANCE_ML_PER_24H * scale;
}

/**
 * Classify fluid status in precedence order (spec §4). Oliguria takes precedence
 * because low urine output is the highest-priority monitoring signal, independent
 * of the net-balance sign.
 */
export function classifyFluidStatus(args: {
	netBalanceMl: number;
	urineOutputRateMlPerKgPerHour: number | null;
	hoursObserved: number;
	positiveThresholdMl: number;
	negativeThresholdMl: number;
}): FluidStatus {
	const {
		netBalanceMl,
		urineOutputRateMlPerKgPerHour,
		hoursObserved,
		positiveThresholdMl,
		negativeThresholdMl
	} = args;

	if (
		urineOutputRateMlPerKgPerHour !== null &&
		hoursObserved >= OLIGURIA_MIN_HOURS &&
		urineOutputRateMlPerKgPerHour < OLIGURIA_RATE_ML_PER_KG_PER_HOUR
	) {
		return 'oliguria';
	}
	if (netBalanceMl >= positiveThresholdMl) return 'positive';
	if (netBalanceMl <= -negativeThresholdMl) return 'negative';
	return 'balanced';
}
