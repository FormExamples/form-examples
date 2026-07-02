// Flagged-issue detection (red flags). Independent of the total Padua score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - High VTE risk (high)                  — paduaScore >= 4
//   - Bleeding-risk contraindication (high) — activeBleeding or highBleedingRisk == 'yes'
//   - Active cancer (medium)                — activeCancer == 'yes'
//   - Previous VTE (medium)                 — previousVte == 'yes'
//   - Incomplete assessment (low)           — ageYears or bodyMassIndex missing
//
// Rows here mirror the
// `padua_venous_thromboembolism_risk_assessment_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.PaduaVenousThromboembolismRiskAssessment.
(function () {
'use strict';
window.PaduaVenousThromboembolismRiskAssessment =
  window.PaduaVenousThromboembolismRiskAssessment || {};

/**
 * @param {AssessmentData} data
 * @param {number} paduaScore  - total 0-20 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, paduaScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const activeBleeding = data.bleeding.activeBleeding;
  const highBleedingRisk = data.bleeding.highBleedingRisk;
  const ageYears = data.identification.ageYears;
  const bodyMassIndex = data.metabolic.bodyMassIndex;

  // ─── High VTE risk (HIGH) ───────────────────────────────────
  if (paduaScore >= 4) {
    flags.push({
      id: 'F-HIGH-VTE-RISK-001',
      category: 'high-vte-risk',
      priority: 'high',
      description: `High-risk Padua score (${paduaScore} of 20, at or above the threshold of 4) — heightened risk of venous thromboembolism`,
      suggestedAction:
        'Consider pharmacological thromboprophylaxis (e.g. low-molecular-weight heparin, unfractionated heparin, or fondaparinux) after assessing bleeding risk and contraindications.'
    });
  }

  // ─── Bleeding-risk contraindication (HIGH) ──────────────────
  if (activeBleeding === 'yes' || highBleedingRisk === 'yes') {
    const detail =
      activeBleeding === 'yes'
        ? 'Active bleeding present'
        : 'High bleeding-risk factors present';
    flags.push({
      id: 'F-BLEEDING-CONTRAINDICATION-001',
      category: 'bleeding-contraindication',
      priority: 'high',
      description: `${detail} — pharmacological thromboprophylaxis may be contraindicated`,
      suggestedAction:
        'Consider mechanical prophylaxis (e.g. intermittent pneumatic compression) and seek senior review before starting any anticoagulant.'
    });
  }

  // ─── Active cancer (MEDIUM) ─────────────────────────────────
  if (data.history.activeCancer === 'yes') {
    flags.push({
      id: 'F-ACTIVE-CANCER-001',
      category: 'active-cancer',
      priority: 'medium',
      description: 'Active cancer — the highest single-factor contribution (3 points) to the Padua score',
      suggestedAction:
        'Note the heightened baseline VTE risk associated with active malignancy when planning thromboprophylaxis.'
    });
  }

  // ─── Previous VTE (MEDIUM) ──────────────────────────────────
  if (data.history.previousVte === 'yes') {
    flags.push({
      id: 'F-PREVIOUS-VTE-001',
      category: 'previous-vte',
      priority: 'medium',
      description: 'Previous venous thromboembolism — a strong independent predictor of recurrence',
      suggestedAction:
        'Consider prior VTE history when planning thromboprophylaxis and duration of cover.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (ageYears === null) missing.push('age in years');
  if (bodyMassIndex === null) missing.push('body mass index');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing input(s): ${missing.join(', ')} — the score may understate risk`,
      suggestedAction:
        'Record the missing value(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.PaduaVenousThromboembolismRiskAssessment.detectFlaggedIssues =
  detectFlaggedIssues;
})();
