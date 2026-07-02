// Flagged-issue detection (red flags). Independent of the total Caprini score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - High VTE risk (high)                 — capriniScore >= 5
//   - Bleeding-risk contraindication (high)— highBleedingRisk == 'yes' while the
//                                            band is moderate or high
//   - Prior VTE (medium)                   — historyOfVte == 'yes'
//   - Known thrombophilia (medium)         — any 3-point thrombophilia factor fired
//   - Incomplete assessment (low)          — any risk-factor or bleeding input unanswered
//
// Rows here mirror the
// `caprini_venous_thromboembolism_risk_assessment_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.CapriniVenousThromboembolismRiskAssessment.
(function () {
'use strict';
window.CapriniVenousThromboembolismRiskAssessment =
  window.CapriniVenousThromboembolismRiskAssessment || {};
const NS = window.CapriniVenousThromboembolismRiskAssessment;

// The 3-point thrombophilia factors (excludes historyOfVte, which has its own
// prior-VTE flag).
const THROMBOPHILIA_FIELDS = [
  'familyHistoryOfThrombosis',
  'factorVLeiden',
  'prothrombin20210a',
  'lupusAnticoagulant',
  'anticardiolipinAntibodies',
  'elevatedHomocysteine',
  'heparinInducedThrombocytopenia',
  'otherThrombophilia'
];

// Every yes/no risk-factor and bleeding input, used for the completeness check.
const FACTOR_SECTIONS = ['onePoint', 'twoPoint', 'threePoint', 'fivePoint', 'bleeding'];

/**
 * @param {AssessmentData} data
 * @param {import('./types.js').GradingResult} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const score = grade.capriniScore;
  const band = grade.riskBand;
  const highBleeding = data.bleeding.highBleedingRisk === 'yes';

  // ─── High VTE risk (HIGH) ───────────────────────────────────
  if (score >= 5) {
    flags.push({
      id: 'F-HIGH-VTE-RISK-001',
      category: 'high-vte-risk',
      priority: 'high',
      description: `High VTE risk — Caprini score ${score} (5 or more)`,
      suggestedAction:
        'Commence pharmacological prophylaxis plus mechanical prophylaxis after a bleeding-risk review; consider extended-duration prophylaxis.'
    });
  }

  // ─── Bleeding-risk contraindication (HIGH) ──────────────────
  if (highBleeding && (band === 'moderate' || band === 'high')) {
    flags.push({
      id: 'F-BLEEDING-CONTRAINDICATION-001',
      category: 'bleeding-contraindication',
      priority: 'high',
      description:
        'High bleeding risk with a moderate or high Caprini score — pharmacological prophylaxis is contraindicated',
      suggestedAction:
        'Substitute mechanical prophylaxis for pharmacological prophylaxis until the bleeding risk resolves; seek senior review.'
    });
  }

  // ─── Prior VTE (MEDIUM) ─────────────────────────────────────
  if (data.threePoint.historyOfVte === 'yes') {
    flags.push({
      id: 'F-PRIOR-VTE-001',
      category: 'prior-vte',
      priority: 'medium',
      description: 'Personal history of venous thromboembolism — a strong independent risk factor',
      suggestedAction:
        'Confirm prophylaxis is prescribed and consider extended-duration prophylaxis.'
    });
  }

  // ─── Known thrombophilia (MEDIUM) ───────────────────────────
  const thrombophilia = THROMBOPHILIA_FIELDS.filter(
    (f) => data.threePoint[f] === 'yes'
  );
  if (thrombophilia.length > 0) {
    flags.push({
      id: 'F-KNOWN-THROMBOPHILIA-001',
      category: 'known-thrombophilia',
      priority: 'medium',
      description: `Known thrombophilia (${thrombophilia.length} factor${thrombophilia.length === 1 ? '' : 's'} present)`,
      suggestedAction:
        'Consider haematology input on prophylaxis intensity and duration.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  let unanswered = 0;
  for (const section of FACTOR_SECTIONS) {
    const obj = data[section];
    for (const key of Object.keys(obj)) {
      if (obj[key] === '') unanswered++;
    }
  }
  if (data.identification.ageBand === '') unanswered++;
  if (unanswered > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `${unanswered} risk-factor or bleeding input(s) unanswered — the score may understate risk`,
      suggestedAction:
        'Complete the outstanding items and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

NS.detectFlaggedIssues = detectFlaggedIssues;
})();
