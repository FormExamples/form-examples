// Declarative MEWS per-parameter scoring rules (Subbe et al., QJM 2001).
//
// MEWS maps each of five physiological parameters to a sub-score of 0-3 by a
// value-range table. Each pure scoring function below maps a measured value to
// its subscore per the published bands; `null` means the input was not recorded
// (contributes 0 to the aggregate but marks the grade incomplete). These band
// tables mirror the `modified_early_warning_score_grade_rule` SQL instrument
// rows. The grader (`mews-grader.ts`) sums the subscores into the aggregate,
// derives the risk band, and detects the single-parameter=3 trigger.

import type { Avpu } from './types';

/**
 * Systolic blood pressure (mmHg).
 *   <=70 -> 3 | 71-80 -> 2 | 81-100 -> 1 | 101-199 -> 0 | >=200 -> 2
 */
export function scoreSystolicBloodPressure(sbp: number | null): 0 | 1 | 2 | 3 | null {
	if (sbp === null || sbp === undefined || Number.isNaN(sbp)) return null;
	if (sbp <= 70) return 3;
	if (sbp <= 80) return 2;
	if (sbp <= 100) return 1;
	if (sbp <= 199) return 0;
	return 2; // >= 200
}

/**
 * Heart rate (beats/min).
 *   <=40 -> 2 | 41-50 -> 1 | 51-100 -> 0 | 101-110 -> 1 | 111-129 -> 2 | >=130 -> 3
 */
export function scoreHeartRate(hr: number | null): 0 | 1 | 2 | 3 | null {
	if (hr === null || hr === undefined || Number.isNaN(hr)) return null;
	if (hr <= 40) return 2;
	if (hr <= 50) return 1;
	if (hr <= 100) return 0;
	if (hr <= 110) return 1;
	if (hr <= 129) return 2;
	return 3; // >= 130
}

/**
 * Respiratory rate (breaths/min).
 *   <9 -> 2 | 9-14 -> 0 | 15-20 -> 1 | 21-29 -> 2 | >=30 -> 3
 */
export function scoreRespiratoryRate(rr: number | null): 0 | 1 | 2 | 3 | null {
	if (rr === null || rr === undefined || Number.isNaN(rr)) return null;
	if (rr < 9) return 2;
	if (rr <= 14) return 0;
	if (rr <= 20) return 1;
	if (rr <= 29) return 2;
	return 3; // >= 30
}

/**
 * Temperature (degrees Celsius).
 *   <35.0 -> 2 | 35.0-38.4 -> 0 | >=38.5 -> 2
 */
export function scoreTemperature(temp: number | null): 0 | 1 | 2 | 3 | null {
	if (temp === null || temp === undefined || Number.isNaN(temp)) return null;
	if (temp < 35.0) return 2;
	if (temp <= 38.4) return 0;
	return 2; // >= 38.5
}

/** AVPU level of consciousness: alert -> 0 | voice -> 1 | pain -> 2 | unresponsive -> 3. */
export function scoreAvpu(avpu: Avpu): 0 | 1 | 2 | 3 | null {
	switch (avpu) {
		case 'alert':
			return 0;
		case 'voice':
			return 1;
		case 'pain':
			return 2;
		case 'unresponsive':
			return 3;
		default:
			return null;
	}
}
