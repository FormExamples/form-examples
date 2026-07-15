import { HIGH, LOW, SEVERE_HIGH, SEVERE_LOW } from './rules.js';

// Flagged-issue detection (red flags). Independent of the classification band
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5, using the unrounded corrected calcium value:
//
//   - Severe hypercalcaemia (high)     — correctedCalcium >= 3.0
//   - Severe hypocalcaemia (high)      — correctedCalcium < 1.9
//   - Symptomatic hypercalcaemia (high)— correctedCalcium > 2.60 && symptomatic == 'yes'
//   - Hypercalcaemia (medium)          — correctedCalcium > 2.60
//   - Hypocalcaemia (medium)           — correctedCalcium < 2.20
//   - Incomplete data (low)            — total calcium or albumin missing
//
// Rows here mirror the `corrected_calcium_calculator_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.CorrectedCalciumCalculator.

/**
 * @param {AssessmentData} data
 * @param {number | null} correctedCalcium  - unrounded corrected value, or null
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, correctedCalcium) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const totalCalcium = data.calcium.totalCalcium;
  const albumin = data.albumin.albumin;
  const symptomatic = data.symptoms.symptomatic;

  // ─── Incomplete data (LOW) ──────────────────────────────────
  if (correctedCalcium === null) {
    const missing = [];
    if (totalCalcium === null || totalCalcium === undefined) missing.push('total calcium');
    if (albumin === null || albumin === undefined) missing.push('serum albumin');
    flags.push({
      id: 'F-INCOMPLETE-DATA-001',
      category: 'incomplete-data',
      priority: 'low',
      description: `Missing input(s): ${missing.join(', ')} — no corrected calcium can be computed`,
      suggestedAction:
        'Record the measured total calcium and serum albumin, then re-calculate.'
    });
    return flags;
  }

  const shown = `${(Math.round(correctedCalcium * 100) / 100).toFixed(2)} mmol/L`;

  // ─── Severe hypercalcaemia (HIGH) ───────────────────────────
  if (correctedCalcium >= SEVERE_HIGH) {
    flags.push({
      id: 'F-SEVERE-HYPERCALCAEMIA-001',
      category: 'severe-hypercalcaemia',
      priority: 'high',
      description: `Corrected calcium ${shown} at or above the ${SEVERE_HIGH.toFixed(1)} mmol/L severe threshold — risk of hypercalcaemic crisis`,
      suggestedAction:
        'Urgent: seek immediate senior / endocrine review, monitor ECG and fluids, and treat per local hypercalcaemia protocol.'
    });
  }

  // ─── Severe hypocalcaemia (HIGH) ────────────────────────────
  if (correctedCalcium < SEVERE_LOW) {
    flags.push({
      id: 'F-SEVERE-HYPOCALCAEMIA-001',
      category: 'severe-hypocalcaemia',
      priority: 'high',
      description: `Corrected calcium ${shown} below the ${SEVERE_LOW.toFixed(1)} mmol/L severe threshold — risk of tetany, seizures, arrhythmia`,
      suggestedAction:
        'Urgent: seek immediate review, check ECG and magnesium, and consider intravenous calcium replacement per local policy.'
    });
  }

  // ─── Symptomatic hypercalcaemia (HIGH) ──────────────────────
  if (correctedCalcium > HIGH && symptomatic === 'yes') {
    flags.push({
      id: 'F-SYMPTOMATIC-HYPERCALCAEMIA-001',
      category: 'symptomatic-hypercalcaemia',
      priority: 'high',
      description: `Corrected calcium ${shown} above ${HIGH.toFixed(2)} mmol/L with reported symptoms`,
      suggestedAction:
        'Escalate; correlate polyuria, confusion, and arrhythmia, and investigate the cause of hypercalcaemia.'
    });
  }

  // ─── Hypercalcaemia (MEDIUM) ────────────────────────────────
  if (correctedCalcium > HIGH) {
    flags.push({
      id: 'F-HYPERCALCAEMIA-001',
      category: 'hypercalcaemia',
      priority: 'medium',
      description: `Corrected calcium ${shown} above the ${HIGH.toFixed(2)} mmol/L upper reference limit`,
      suggestedAction:
        'Investigate the cause (parathyroid, malignancy, drugs) and correlate with symptoms.'
    });
  }

  // ─── Hypocalcaemia (MEDIUM) ─────────────────────────────────
  if (correctedCalcium < LOW) {
    flags.push({
      id: 'F-HYPOCALCAEMIA-001',
      category: 'hypocalcaemia',
      priority: 'medium',
      description: `Corrected calcium ${shown} below the ${LOW.toFixed(2)} mmol/L lower reference limit`,
      suggestedAction:
        'Investigate the cause (vitamin D, magnesium, renal, parathyroid) and correlate with symptoms.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
