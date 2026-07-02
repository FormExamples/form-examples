// Flagged-issue detection (red flags). Independent of the total Rockall score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - High mortality / rebleeding risk (high) — fullRockallScore >= 5, or
//     clinicalRockallScore >= 3 when endoscopy not yet performed
//   - Shock (high)                            — shockPoints >= 1 (hypotension is worse)
//   - High-risk endoscopic stigmata (high)    — stigmata == 'high-risk'
//   - Upper GI malignancy (medium)            — diagnosis == 'upper-gi-malignancy'
//   - Incomplete assessment (low)             — age / heart rate / systolic BP
//     missing, or (when endoscopy performed) the endoscopic parameters unrecorded
//
// Rows here mirror the
// `rockall_score_for_upper_gastrointestinal_bleeding_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.RockallScoreForUpperGastrointestinalBleeding.
(function () {
'use strict';
window.RockallScoreForUpperGastrointestinalBleeding =
  window.RockallScoreForUpperGastrointestinalBleeding || {};

/**
 * @param {AssessmentData} data
 * @param {GradingResult} grade - grading result from calculateRockallGrade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const {
    clinicalRockallScore,
    fullRockallScore,
    shockPoints,
    endoscopyDone
  } = grade;

  // ─── High mortality / rebleeding risk (HIGH) ─────────────────
  const highRisk = endoscopyDone
    ? fullRockallScore >= 5
    : clinicalRockallScore >= 3;
  if (highRisk) {
    const detail = endoscopyDone
      ? `Full Rockall score ${fullRockallScore} of 11`
      : `Pre-endoscopy (clinical) Rockall score ${clinicalRockallScore} of 7`;
    flags.push({
      id: 'F-HIGH-MORTALITY-RISK-001',
      category: 'high-mortality-risk',
      priority: 'high',
      description: `${detail} — high risk of rebleeding and death.`,
      suggestedAction:
        'Admit and monitor closely; arrange endoscopic therapy, transfusion, and surgical / interventional-radiology input as indicated.'
    });
  }

  // ─── Shock (HIGH) ────────────────────────────────────────────
  if (shockPoints >= 1) {
    const isHypotensive = shockPoints === 2;
    flags.push({
      id: 'F-SHOCK-001',
      category: 'shock',
      priority: 'high',
      description: isHypotensive
        ? `Hypotension (systolic BP ${data.shock.systolicBloodPressure} mmHg, < 100) — haemodynamic instability.`
        : `Tachycardia (heart rate ${data.shock.heartRate} bpm, >= 100) — early shock.`,
      suggestedAction:
        'Resuscitate and monitor: secure IV access, fluids / blood as indicated, and continuous observation.'
    });
  }

  // ─── High-risk endoscopic stigmata (HIGH) ────────────────────
  if (data.endoscopy.stigmata === 'high-risk') {
    flags.push({
      id: 'F-HIGH-RISK-STIGMATA-001',
      category: 'high-risk-stigmata',
      priority: 'high',
      description:
        'High-risk stigmata of recent haemorrhage — active bleeding, non-bleeding visible vessel, or adherent clot.',
      suggestedAction:
        'Endoscopic haemostatic therapy is indicated; plan for possible rebleeding and repeat endoscopy.'
    });
  }

  // ─── Upper GI malignancy (MEDIUM) ────────────────────────────
  if (data.endoscopy.diagnosis === 'upper-gi-malignancy') {
    flags.push({
      id: 'F-UPPER-GI-MALIGNANCY-001',
      category: 'upper-gi-malignancy',
      priority: 'medium',
      description: 'Endoscopic diagnosis of upper GI malignancy.',
      suggestedAction:
        'Arrange oncology / upper-GI MDT referral and staging; discuss goals of care.'
    });
  }

  // ─── Incomplete assessment (LOW) ─────────────────────────────
  const missing = [];
  if (data.identification.ageYears === null) missing.push('age (years)');
  if (data.shock.heartRate === null) missing.push('heart rate');
  if (data.shock.systolicBloodPressure === null) missing.push('systolic blood pressure');
  if (endoscopyDone) {
    if (data.endoscopy.diagnosis === '') missing.push('endoscopic diagnosis');
    if (data.endoscopy.stigmata === '') missing.push('stigmata of recent haemorrhage');
  }
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing input(s): ${missing.join(', ')} — the score may understate risk.`,
      suggestedAction:
        'Record the missing parameter(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.RockallScoreForUpperGastrointestinalBleeding.detectFlaggedIssues =
  detectFlaggedIssues;
})();
