// Flagged-issue detection (red flags). Independent of the numeric Waterlow total
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Very high risk (high)                 — waterlowScore >= 20
//   - High risk (high)                      — 15 <= waterlowScore < 20
//   - At risk (medium)                      — 10 <= waterlowScore < 15
//   - Existing pressure damage (high)       — existingPressureDamage == 'yes' or
//                                             skinType is discoloured / broken
//   - Multiple special risk factors (medium)— two or more of the four special-risk
//                                             groups contribute points
//   - Incomplete assessment (low)           — any core category input missing
//
// Rows here mirror the
// `waterlow_pressure_ulcer_risk_assessment_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// The six core category inputs (build, skin, sex, age, continence, mobility)
// used for the completeness check. Each is [section, field].
const CORE_INPUTS = [
  ['core', 'buildWeightForHeight'],
  ['core', 'skinType'],
  ['identification', 'sex'],
  ['identification', 'ageBand'],
  ['core', 'continence'],
  ['core', 'mobility']
];

/**
 * @param {AssessmentData} data
 * @param {GradingResult} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const score = grade.waterlowScore;
  const band = grade.riskBand;

  // ─── Very high risk (HIGH) ──────────────────────────────────
  if (score >= 20) {
    flags.push({
      id: 'F-VERY-HIGH-RISK-001',
      category: 'very-high-risk',
      priority: 'high',
      description: `Very high pressure-ulcer risk — Waterlow score ${score} (20 or more)`,
      suggestedAction:
        'Institute a high-specification dynamic support surface, frequent repositioning, and an urgent tissue-viability review; treat reversible factors (nutrition, moisture, perfusion).'
    });
  } else if (score >= 15) {
    // ─── High risk (HIGH) ─────────────────────────────────────
    flags.push({
      id: 'F-HIGH-RISK-001',
      category: 'high-risk',
      priority: 'high',
      description: `High pressure-ulcer risk — Waterlow score ${score} (15-19)`,
      suggestedAction:
        'Escalate to an alternating-pressure / dynamic support surface, increase repositioning frequency, and refer to tissue viability with a formal skin-care plan.'
    });
  } else if (score >= 10) {
    // ─── At risk (MEDIUM) ─────────────────────────────────────
    flags.push({
      id: 'F-AT-RISK-001',
      category: 'at-risk',
      priority: 'medium',
      description: `At risk of pressure ulceration — Waterlow score ${score} (10-14)`,
      suggestedAction:
        'Introduce a pressure-redistributing foam mattress and cushion, document a repositioning schedule, and review nutrition and continence.'
    });
  }

  // ─── Existing pressure damage (HIGH) ────────────────────────
  const damaged =
    data.special.existingPressureDamage === 'yes' ||
    data.core.skinType === 'discoloured' ||
    data.core.skinType === 'broken';
  if (damaged) {
    flags.push({
      id: 'F-EXISTING-PRESSURE-DAMAGE-001',
      category: 'existing-pressure-damage',
      priority: 'high',
      description:
        'Existing pressure damage indicated (recorded damage, or discoloured / broken skin) — the skin is already compromised',
      suggestedAction:
        'Grade and treat the pressure ulcer with a validated category (EPUAP/NPIAP); do not rely on prevention alone.'
    });
  }

  // ─── Multiple special risk factors (MEDIUM) ─────────────────
  const specialGroupsWithPoints = [
    grade.tissueMalnutritionPoints,
    grade.neurologicalDeficitPoints,
    grade.majorSurgeryTraumaPoints,
    grade.medicationPoints
  ].filter((p) => p > 0).length;
  if (specialGroupsWithPoints >= 2) {
    flags.push({
      id: 'F-MULTIPLE-SPECIAL-RISKS-001',
      category: 'multiple-special-risks',
      priority: 'medium',
      description: `Multiple special risk factors present (${specialGroupsWithPoints} of 4 groups contribute points) — compounded risk`,
      suggestedAction:
        'Treat reversible factors and escalate prevention in line with the overall risk band.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  let missing = 0;
  for (const [section, field] of CORE_INPUTS) {
    const obj = data[section] || {};
    if (obj[field] === '' || obj[field] == null) missing++;
  }
  if (missing > 0) {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description: `${missing} core category input(s) unanswered — the score may understate risk`,
      suggestedAction:
        'Complete the outstanding core categories and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
