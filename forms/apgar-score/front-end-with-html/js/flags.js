// Flagged-issue detection (red flags). Independent of the per-timepoint totals
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Resuscitation required (high)  — any scored timepoint total <= 3
//   - Continue scoring (high)        — 5-minute total < 7
//   - Falling trend (high)           — a later total below an earlier total
//   - Support and stimulation (med)  — any scored timepoint total 4-6
//   - Missing 10-minute score (med)  — 5-minute total < 7 but no >= 10-min score
//   - Incomplete assessment (low)    — any of the five signs missing at a
//                                      scored timepoint
//
// Rows here mirror the `apgar_score_grade_flag` SQL table (flag_id, category,
// priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradedTimepoint} GradedTimepoint
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ApgarScore.
(function () {
'use strict';
window.ApgarScore = window.ApgarScore || {};

/** Format a timepoint's minutes for display, e.g. "5-minute". */
function tpLabel(minutes) {
  return minutes == null ? 'a' : `${minutes}-minute`;
}

/**
 * @param {AssessmentData} data
 * @param {GradedTimepoint[]} gradedTimepoints - from calculateApgarGrade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, gradedTimepoints) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const scored = (gradedTimepoints || [])
    .filter((g) => g.scored)
    .slice()
    .sort((a, b) => {
      const am = a.timepointMinutes == null ? Infinity : a.timepointMinutes;
      const bm = b.timepointMinutes == null ? Infinity : b.timepointMinutes;
      return am - bm;
    });

  const fiveMinute = scored.find((g) => g.timepointMinutes === 5);
  const hasTenPlus = scored.some(
    (g) => g.timepointMinutes != null && g.timepointMinutes >= 10
  );

  // ─── Resuscitation required (HIGH) ──────────────────────────
  const severe = scored.filter((g) => g.total <= 3);
  if (severe.length > 0) {
    const worst = severe.reduce((a, b) => (b.total < a.total ? b : a));
    flags.push({
      id: 'F-RESUSCITATION-REQUIRED-001',
      category: 'resuscitation-required',
      priority: 'high',
      description: `Apgar total ${worst.total} of 10 at ${tpLabel(worst.timepointMinutes)} — the newborn is severely depressed (0-3, low band)`,
      suggestedAction:
        'Commence active resuscitation per the newborn-life-support algorithm and obtain senior / neonatal support immediately.'
    });
  }

  // ─── Continue scoring (HIGH) ────────────────────────────────
  if (fiveMinute && fiveMinute.total < 7) {
    flags.push({
      id: 'F-CONTINUE-SCORING-001',
      category: 'continue-scoring',
      priority: 'high',
      description: `5-minute Apgar total ${fiveMinute.total} of 10 is below 7 — the newborn has not yet adapted`,
      suggestedAction:
        'Repeat scoring at 10 minutes and every 5 minutes thereafter until the newborn stabilises or is transferred.'
    });
  }

  // ─── Falling trend (HIGH) ───────────────────────────────────
  // Any later total below an earlier total across the ordered scored series.
  let falling = false;
  for (let i = 1; i < scored.length && !falling; i++) {
    for (let j = 0; j < i; j++) {
      if (scored[i].total < scored[j].total) { falling = true; break; }
    }
  }
  if (falling) {
    const first = scored[0];
    const last = scored[scored.length - 1];
    flags.push({
      id: 'F-FALLING-TREND-001',
      category: 'falling-trend',
      priority: 'high',
      description: `Apgar total fell across timepoints (${first.total} at ${tpLabel(first.timepointMinutes)} to ${last.total} at ${tpLabel(last.timepointMinutes)}) — the newborn is deteriorating`,
      suggestedAction:
        'Escalate: reassess airway, breathing, and circulation, provide active support, and obtain senior / neonatal review.'
    });
  }

  // ─── Support and stimulation (MEDIUM) ───────────────────────
  const moderate = scored.filter((g) => g.total >= 4 && g.total <= 6);
  if (moderate.length > 0) {
    const g = moderate[moderate.length - 1];
    flags.push({
      id: 'F-SUPPORT-AND-STIMULATION-001',
      category: 'support-and-stimulation',
      priority: 'medium',
      description: `Apgar total ${g.total} of 10 at ${tpLabel(g.timepointMinutes)} is moderately low (4-6)`,
      suggestedAction:
        'Provide support and stimulation (drying, warmth, airway positioning, tactile stimulation, oxygen as indicated) and reassess.'
    });
  }

  // ─── Missing 10-minute score (MEDIUM) ───────────────────────
  if (fiveMinute && fiveMinute.total < 7 && !hasTenPlus) {
    flags.push({
      id: 'F-MISSING-TEN-MINUTE-SCORE-001',
      category: 'missing-ten-minute-score',
      priority: 'medium',
      description: 'The 5-minute total is below 7 but no 10-minute (or later) timepoint has been scored',
      suggestedAction:
        'Add and complete the required 10-minute timepoint (and further 5-minute scores until the newborn stabilises).'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const incomplete = scored.filter((g) => g.answeredCount < 5);
  if (incomplete.length > 0) {
    const labels = incomplete.map((g) => tpLabel(g.timepointMinutes)).join(', ');
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `One or more of the five signs is missing at: ${labels} — the total may understate depression`,
      suggestedAction:
        'Record every sign (Appearance, Pulse, Grimace, Activity, Respiration) at each scored timepoint and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.ApgarScore.detectFlaggedIssues = detectFlaggedIssues;
})();
