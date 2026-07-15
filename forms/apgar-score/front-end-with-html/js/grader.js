import { apgarRules, signPoints } from './rules.js';

// Apgar grader. Pure functions: take an `AssessmentData` object, and for each
// repeated timepoint sum the five signs (each 0/1/2) into a total of 0-10,
// derive the band, then compare consecutive scored timepoints for the trend.
//
// Grading algorithm (spec §4):
//   total(t) = appearance + pulse + grimace + activity + respiration        // 0..10
//   band(t)  = total >= 7 ? 'reassuring'
//            : total >= 4 ? 'moderately-low'
//            :              'low'
//   trend    = < 2 scored timepoints            -> 'insufficient'
//            | latest total > previous total    -> 'improving'
//            | latest total < previous total    -> 'falling'
//            | otherwise                        -> 'static'
//
// A missing sign contributes 0 to that timepoint's total (absent, not scored);
// `flags.js` raises a data-completeness flag separately. Trend and the derived
// flags operate on *scored* timepoints only (a timepoint with at least one sign
// answered), sorted by minutes after birth.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Timepoint} Timepoint
 * @typedef {import('./types.js').GradedTimepoint} GradedTimepoint
 * @typedef {import('./types.js').Band} Band
 * @typedef {import('./types.js').Trend} Trend
 * @typedef {import('./types.js').FiredSign} FiredSign
 */

/** Band for a per-timepoint total (0-10). */
function bandForTotal(total) {
  return total >= 7 ? 'reassuring' : total >= 4 ? 'moderately-low' : 'low';
}

/**
 * Grade a single timepoint: sum the five signs, derive band, and record how
 * many signs were answered.
 * @param {Timepoint} t
 * @returns {GradedTimepoint}
 */
function gradeTimepoint(t) {
  let total = 0;
  let answeredCount = 0;
  for (const rule of apgarRules) {
    total += rule.score(t);
    if (t[rule.sign] !== '' && t[rule.sign] != null) answeredCount++;
  }
  return {
    timepointMinutes: t.timepointMinutes,
    total,
    band: bandForTotal(total),
    answeredCount,
    scored: answeredCount > 0
  };
}

/**
 * Collect the signs that scored below 2 (contributing to a reduced total) at
 * each scored timepoint. These are the "fired" signs surfaced in the report.
 * @param {AssessmentData} data
 * @returns {FiredSign[]}
 */
function evaluateFiredSigns(data) {
  /** @type {FiredSign[]} */
  const fired = [];
  for (const t of data.timepoints) {
    const anyAnswered = apgarRules.some(
      (r) => t[r.sign] !== '' && t[r.sign] != null
    );
    if (!anyAnswered) continue;
    for (const rule of apgarRules) {
      const raw = t[rule.sign];
      if (raw === '' || raw == null) continue;
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

/**
 * Compute the full Apgar grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ timepoints: GradedTimepoint[], trend: Trend, firedSigns: FiredSign[] }}
 */
function calculateApgarGrade(data) {
  const timepoints = (data.timepoints || []).map(gradeTimepoint);

  // Scored timepoints only, ordered by minutes after birth (nulls last).
  const scored = timepoints
    .filter((g) => g.scored)
    .slice()
    .sort((a, b) => {
      const am = a.timepointMinutes == null ? Infinity : a.timepointMinutes;
      const bm = b.timepointMinutes == null ? Infinity : b.timepointMinutes;
      return am - bm;
    });

  /** @type {Trend} */
  let trend;
  if (scored.length < 2) {
    trend = 'insufficient';
  } else {
    const latest = scored[scored.length - 1].total;
    const previous = scored[scored.length - 2].total;
    trend = latest > previous ? 'improving'
      : latest < previous ? 'falling'
      : 'static';
  }

  return {
    timepoints,
    trend,
    firedSigns: evaluateFiredSigns(data)
  };
}

export { bandForTotal, gradeTimepoint, evaluateFiredSigns, calculateApgarGrade };
