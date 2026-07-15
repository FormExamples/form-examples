import { actionLineExpectedCm, alertLineExpectedCm, classifyProgress, elapsedHours, num } from './rules.js';

// Partogram grader. Pure function: takes a `PartogramRecord` object (a parent
// labour-record header plus its repeating timed observation list) and derives
// the labour-progress classification and the reference-line geometry (spec §4).
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
//
// With no dilatation observation, or a null activePhaseStartAt, the
// classification is `normal`, the line-expected values are null, and an
// incomplete-observation flag is raised by flags.js.

/**
 * @typedef {import('./types.js').PartogramRecord} PartogramRecord
 * @typedef {import('./types.js').Observation} Observation
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredLine} FiredLine
 */

/**
 * Find the latest observation (by `observedAt`) carrying a non-null cervical
 * dilatation. Rows without a parseable time are considered earlier than any
 * timed row, but still eligible when they are the only dilatation reading.
 * @param {Observation[]} observations
 * @returns {Observation | null}
 */
function latestDilatationObservation(observations) {
  const withDilatation = observations.filter((o) => num(o.cervicalDilatationCm) !== null);
  if (withDilatation.length === 0) return null;

  let best = null;
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
 * Compute the partogram grade (everything except flaggedIssues and timestamp).
 * @param {PartogramRecord} data
 * @returns {Omit<GradingResult, 'flaggedIssues' | 'timestamp'>}
 */
function gradePartogram(data) {
  const observations = data.observations || [];
  const activePhaseStartAt = data.context.activePhaseStartAt || null;

  const latest = latestDilatationObservation(observations);
  const latestDilatationCm = latest ? num(latest.cervicalDilatationCm) : null;

  // No plottable point, or no reference time: classification defaults to normal
  // and the line-expected values are null (spec §4).
  const t =
    latest && activePhaseStartAt
      ? elapsedHours(activePhaseStartAt, latest.observedAt)
      : null;

  if (latestDilatationCm === null || t === null) {
    return {
      activePhaseStartAt,
      latestDilatationCm,
      elapsedHours: null,
      alertLineExpectedCm: null,
      actionLineExpectedCm: null,
      progressClassification: 'normal',
      firedLines: []
    };
  }

  const alert = alertLineExpectedCm(t);
  const action = actionLineExpectedCm(t);
  const progressClassification = classifyProgress(latestDilatationCm, t);

  /** @type {FiredLine[]} */
  const firedLines = [];
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

  return {
    activePhaseStartAt,
    latestDilatationCm,
    elapsedHours: t,
    alertLineExpectedCm: alert,
    actionLineExpectedCm: action,
    progressClassification,
    firedLines
  };
}

export { latestDilatationObservation, gradePartogram };
