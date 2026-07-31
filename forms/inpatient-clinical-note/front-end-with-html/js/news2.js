// NEWS2 scoring, per the Royal College of Physicians 2017 report.
//
// See `doc/news2.md` for the full parameter tables and the escalation
// thresholds. This module derives the aggregate from the seven parameters; it
// never overwrites a total the clinician entered from the ward chart. The
// grader reports both, so a discrepancy between the chart and the parameters is
// visible rather than silently resolved.
//
//   scoreParameters(obs) -> per-parameter sub-scores, or null where the
//                           parameter is missing
//   deriveNews2(obs)     -> { total, subScores, anyParameterScoresThree,
//                             complete }
//
// `complete` is false when any of the seven parameters is missing, in which case
// `total` is null: a partial observation set yields no derived aggregate.

/**
 * @typedef {import('./types.js').Observations} Observations
 */

/** True when a numeric parameter is usable. */
function num(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

/** Respiratory rate sub-score (breaths per minute). */
function scoreRespiratoryRate(rr) {
  if (!num(rr)) return null;
  if (rr <= 8) return 3;
  if (rr <= 11) return 1;
  if (rr <= 20) return 0;
  if (rr <= 24) return 2;
  return 3;
}

/**
 * Oxygen-saturation sub-score. Scale 2 applies only to patients with confirmed
 * hypercapnic respiratory failure and a prescribed target of 88-92%, and its
 * upper range scores differently depending on whether the patient is on oxygen.
 */
function scoreOxygenSaturation(spo2, scale, onOxygen) {
  if (!num(spo2)) return null;
  if (scale === 'scale-2') {
    if (spo2 <= 83) return 3;
    if (spo2 <= 85) return 2;
    if (spo2 <= 87) return 1;
    if (spo2 <= 92) return 0;
    // Above the target range: scores only when the patient is on oxygen.
    if (!onOxygen) return 0;
    if (spo2 <= 94) return 1;
    if (spo2 <= 96) return 2;
    return 3;
  }
  if (spo2 <= 91) return 3;
  if (spo2 <= 93) return 2;
  if (spo2 <= 95) return 1;
  return 0;
}

/** Air-or-oxygen sub-score: 2 on supplemental oxygen, 0 on room air. */
function scoreOxygenSupplement(oxygenDelivery) {
  if (!oxygenDelivery) return null;
  return oxygenDelivery === 'air' ? 0 : 2;
}

/** Systolic blood-pressure sub-score (mmHg). */
function scoreSystolicBloodPressure(sbp) {
  if (!num(sbp)) return null;
  if (sbp <= 90) return 3;
  if (sbp <= 100) return 2;
  if (sbp <= 110) return 1;
  if (sbp <= 219) return 0;
  return 3;
}

/** Pulse sub-score (beats per minute). */
function scorePulse(pulse) {
  if (!num(pulse)) return null;
  if (pulse <= 40) return 3;
  if (pulse <= 50) return 1;
  if (pulse <= 90) return 0;
  if (pulse <= 110) return 1;
  if (pulse <= 130) return 2;
  return 3;
}

/** Consciousness sub-score: 0 when Alert, 3 for any of C, V, P, or U. */
function scoreConsciousness(acvpu) {
  if (!acvpu) return null;
  return acvpu === 'alert' ? 0 : 3;
}

/** Temperature sub-score (degrees Celsius). */
function scoreTemperature(temp) {
  if (!num(temp)) return null;
  if (temp <= 35.0) return 3;
  if (temp <= 36.0) return 1;
  if (temp <= 38.0) return 0;
  if (temp <= 39.0) return 1;
  return 2;
}

/**
 * Per-parameter sub-scores. A missing parameter yields null for that row.
 * @param {Observations} obs
 * @returns {{respiratoryRate: number|null, oxygenSaturation: number|null,
 *            oxygenSupplement: number|null, systolicBloodPressure: number|null,
 *            pulse: number|null, consciousness: number|null,
 *            temperature: number|null}}
 */
function scoreParameters(obs) {
  const onOxygen = !!obs.oxygenDelivery && obs.oxygenDelivery !== 'air';
  return {
    respiratoryRate: scoreRespiratoryRate(obs.respiratoryRate),
    oxygenSaturation: scoreOxygenSaturation(obs.oxygenSaturation, obs.spo2Scale, onOxygen),
    oxygenSupplement: scoreOxygenSupplement(obs.oxygenDelivery),
    systolicBloodPressure: scoreSystolicBloodPressure(obs.systolicBloodPressure),
    pulse: scorePulse(obs.pulseRate),
    consciousness: scoreConsciousness(obs.acvpu),
    temperature: scoreTemperature(obs.temperatureCelsius)
  };
}

/**
 * Derive the NEWS2 aggregate from the seven parameters.
 *
 * @param {Observations} obs
 * @returns {{total: number|null, subScores: object,
 *            anyParameterScoresThree: boolean, complete: boolean}}
 */
function deriveNews2(obs) {
  const subScores = scoreParameters(obs);
  const values = Object.values(subScores);
  const complete = values.every((v) => v !== null);
  const total = complete ? values.reduce((sum, v) => sum + v, 0) : null;
  const anyParameterScoresThree = values.some((v) => v === 3);
  return { total, subScores, anyParameterScoresThree, complete };
}

/**
 * The NEWS2 total the acuity engine should use: the entered total when the
 * clinician recorded one, otherwise the derived total. Returns null when
 * neither is available.
 *
 * @param {Observations} obs
 * @returns {{effective: number|null, entered: number|null, derived: number|null,
 *            anyParameterScoresThree: boolean}}
 */
function effectiveNews2(obs) {
  const d = deriveNews2(obs);
  const entered = num(obs.news2Total) ? obs.news2Total : null;
  return {
    effective: entered !== null ? entered : d.total,
    entered,
    derived: d.total,
    anyParameterScoresThree: d.anyParameterScoresThree
  };
}

/** Whether every one of the seven NEWS2 parameters has been recorded. */
function hasFullObservationSet(obs) {
  return deriveNews2(obs).complete;
}

export {
  scoreParameters,
  deriveNews2,
  effectiveNews2,
  hasFullObservationSet
};
