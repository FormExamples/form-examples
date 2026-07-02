// Declarative NEWS2 per-parameter scoring rules (RCP 2017 allocation).
//
// NEWS2 scores six physiological parameters 0-3 each, plus a supplemental-oxygen
// weighting of 0 or 2. Each pure scoring function below maps a measured value to
// its subscore per the published bands. The grader (`news2-grader.ts`) sums the
// subscores into the aggregate and derives the risk band. These band tables
// mirror the `national_early_warning_score_2_grade_rule` SQL instrument rows.
//
// SpO2 is scored against Scale 1 (default) or Scale 2 (prescribed 88-92% target,
// e.g. hypercapnic respiratory failure); Scale 2 additionally depends on whether
// the patient is on air or on supplemental oxygen.

import type { Spo2Scale, AirOrOxygen, Acvpu } from './types';

/**
 * Respiration rate (breaths/min).
 *   <=8 -> 3 | 9-11 -> 1 | 12-20 -> 0 | 21-24 -> 2 | >=25 -> 3
 */
export function scoreRespiratoryRate(rr: number | null): 0 | 1 | 2 | 3 | null {
	if (rr === null || rr === undefined || Number.isNaN(rr)) return null;
	if (rr <= 8) return 3;
	if (rr <= 11) return 1;
	if (rr <= 20) return 0;
	if (rr <= 24) return 2;
	return 3;
}

/**
 * Oxygen saturation (%). Scored against the selected scale.
 *
 * Scale 1: <=91 -> 3 | 92-93 -> 2 | 94-95 -> 1 | >=96 -> 0
 * Scale 2 shares the low bands (<=83 -> 3 | 84-85 -> 2 | 86-87 -> 1 |
 *   88-92 -> 0); above target the score depends on air vs oxygen:
 *     on oxygen: 93-94 -> 1 | 95-96 -> 2 | >=97 -> 3
 *     on air:    >=93 -> 1
 */
export function scoreSpo2(
	spo2: number | null,
	scale: Spo2Scale,
	onOxygen: AirOrOxygen
): 0 | 1 | 2 | 3 | null {
	if (spo2 === null || spo2 === undefined || Number.isNaN(spo2)) return null;

	if (scale === 'scale-2') {
		if (spo2 <= 83) return 3;
		if (spo2 <= 85) return 2;
		if (spo2 <= 87) return 1;
		if (spo2 <= 92) return 0;
		// Above the 88-92 target: air vs oxygen sub-rows.
		if (onOxygen === 'oxygen') {
			if (spo2 <= 94) return 1;
			if (spo2 <= 96) return 2;
			return 3;
		}
		// On air (or not yet specified): any value >= 93 scores 1.
		return 1;
	}

	// Scale 1 (default).
	if (spo2 <= 91) return 3;
	if (spo2 <= 93) return 2;
	if (spo2 <= 95) return 1;
	return 0;
}

/** Supplemental-oxygen weighting: 2 on oxygen, otherwise 0. */
export function scoreOxygen(onOxygen: AirOrOxygen): 0 | 2 {
	return onOxygen === 'oxygen' ? 2 : 0;
}

/**
 * Systolic blood pressure (mmHg).
 *   <=90 -> 3 | 91-100 -> 2 | 101-110 -> 1 | 111-219 -> 0 | >=220 -> 3
 */
export function scoreBloodPressure(sbp: number | null): 0 | 1 | 2 | 3 | null {
	if (sbp === null || sbp === undefined || Number.isNaN(sbp)) return null;
	if (sbp <= 90) return 3;
	if (sbp <= 100) return 2;
	if (sbp <= 110) return 1;
	if (sbp <= 219) return 0;
	return 3;
}

/**
 * Pulse (beats/min).
 *   <=40 -> 3 | 41-50 -> 1 | 51-90 -> 0 | 91-110 -> 1 | 111-130 -> 2 | >=131 -> 3
 */
export function scorePulse(pulse: number | null): 0 | 1 | 2 | 3 | null {
	if (pulse === null || pulse === undefined || Number.isNaN(pulse)) return null;
	if (pulse <= 40) return 3;
	if (pulse <= 50) return 1;
	if (pulse <= 90) return 0;
	if (pulse <= 110) return 1;
	if (pulse <= 130) return 2;
	return 3;
}

/** Consciousness (ACVPU): A (alert) -> 0; any of C/V/P/U -> 3. */
export function scoreConsciousness(acvpu: Acvpu): 0 | 3 | null {
	if (acvpu === '' || acvpu === null || acvpu === undefined) return null;
	return acvpu === 'A' ? 0 : 3;
}

/**
 * Temperature (degrees Celsius).
 *   <=35.0 -> 3 | 35.1-36.0 -> 1 | 36.1-38.0 -> 0 | 38.1-39.0 -> 1 | >=39.1 -> 2
 */
export function scoreTemperature(temp: number | null): 0 | 1 | 2 | 3 | null {
	if (temp === null || temp === undefined || Number.isNaN(temp)) return null;
	if (temp <= 35.0) return 3;
	if (temp <= 36.0) return 1;
	if (temp <= 38.0) return 0;
	if (temp <= 39.0) return 1;
	return 2;
}
