// Flagged-issue detection (red flags). Independent of the classification band
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5, using the unrounded grader output:
//
//   - Very high anion gap (urgent)          — classificationValue >= 20
//   - High anion gap (high)                 — normalHigh < classificationValue < 20
//   - Hypoalbuminaemia masking (high)       — anionGap <= normalHigh but correctedAnionGap > normalHigh
//   - Low anion gap (medium)                — classificationValue < normalLow (8)
//   - Incomplete calculation (low)          — sodium, chloride, or bicarbonate missing
//
// Rows here mirror the `anion_gap_calculator_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.AnionGapCalculator.
(function () {
'use strict';
window.AnionGapCalculator = window.AnionGapCalculator || {};
const { VERY_HIGH, present, roundOne } = window.AnionGapCalculator;

/**
 * @param {AssessmentData} data
 * @param {import('./grader.js')} grade - the object returned by calculateAnionGap
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const { sodium, chloride, bicarbonate } = data.electrolytes;
  const {
    anionGapRaw,
    correctedAnionGapRaw,
    classificationValue,
    normalLow,
    normalHigh
  } = grade;

  // ─── Incomplete calculation (LOW) ───────────────────────────
  if (anionGapRaw === null) {
    const missing = [];
    if (!present(sodium)) missing.push('serum sodium');
    if (!present(chloride)) missing.push('serum chloride');
    if (!present(bicarbonate)) missing.push('serum bicarbonate');
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        `Missing input(s): ${missing.join(', ')} — the anion gap cannot be computed`,
      suggestedAction:
        'Complete the serum electrolyte panel (sodium, chloride, bicarbonate), then re-calculate.'
    });
    return flags;
  }

  const shown = `${roundOne(classificationValue).toFixed(1)} mmol/L`;
  const usingCorrected = correctedAnionGapRaw !== null;
  const basis = usingCorrected ? 'albumin-corrected anion gap' : 'anion gap';

  // ─── Very high anion gap (URGENT) ───────────────────────────
  if (classificationValue >= VERY_HIGH) {
    flags.push({
      id: 'F-VERY-HIGH-001',
      category: 'very-high',
      priority: 'urgent',
      description:
        `The ${basis} ${shown} is at or above the ${VERY_HIGH} mmol/L very-high threshold — marked elevation`,
      suggestedAction:
        'Urgent: search for the cause of the metabolic acidosis without delay (GOLDMARK / MUDPILES); check lactate, ketones, renal function, and a toxicology history.'
    });
  }

  // ─── High anion gap (HIGH) ──────────────────────────────────
  if (classificationValue > normalHigh && classificationValue < VERY_HIGH) {
    flags.push({
      id: 'F-HIGH-HAGMA-001',
      category: 'high-hagma',
      priority: 'high',
      description:
        `The ${basis} ${shown} is above the ${normalHigh} mmol/L upper reference limit — suggests a high anion gap metabolic acidosis`,
      suggestedAction:
        'Investigate the cause: work through the GOLDMARK / MUDPILES differential and correlate with the clinical picture.'
    });
  }

  // ─── Hypoalbuminaemia masking a raised gap (HIGH) ───────────
  if (usingCorrected &&
      anionGapRaw <= normalHigh &&
      correctedAnionGapRaw > normalHigh) {
    flags.push({
      id: 'F-HYPOALBUMINAEMIA-MASKING-001',
      category: 'hypoalbuminaemia-masking',
      priority: 'high',
      description:
        `The uncorrected anion gap ${roundOne(anionGapRaw).toFixed(1)} mmol/L looks normal, but the albumin-corrected gap ${roundOne(correctedAnionGapRaw).toFixed(1)} mmol/L is raised`,
      suggestedAction:
        'Do not be reassured by the raw gap: hypoalbuminaemia is masking a raised anion gap. Investigate as a high anion gap acidosis.'
    });
  }

  // ─── Low anion gap (MEDIUM) ─────────────────────────────────
  if (classificationValue < normalLow) {
    flags.push({
      id: 'F-LOW-001',
      category: 'low',
      priority: 'medium',
      description:
        `The ${basis} ${shown} is below the ${normalLow} mmol/L lower reference limit`,
      suggestedAction:
        'Consider hypoalbuminaemia (if uncorrected), laboratory error, paraproteinaemia, or lithium / bromide toxicity.'
    });
  }

  // Sort: urgent > high > medium > low.
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.AnionGapCalculator.detectFlaggedIssues = detectFlaggedIssues;
})();
