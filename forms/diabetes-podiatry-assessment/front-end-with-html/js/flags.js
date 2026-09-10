// Flagged-issue detection (safety flags). Independent of the review pathway
// (which the grader produces), this module raises assessor-facing safety
// flags per spec §5:
//
//   - Active ulceration (high)              — either foot's activeUlcer == 'yes'
//   - Suspected Charcot foot (high)          — either foot's suspectedCharcot == 'yes'
//   - Critical limb ischaemia (high)         — either foot's ulcerSeverity == 'critical-ischaemia'
//   - Previous major amputation (high)       — either foot's previousAmputation == 'major'
//   - Renal replacement therapy (high)       — onRenalReplacementTherapy == 'yes'
//   - Combined risk factors (medium)         — either foot's risk-factor count >= 2, no active ulcer
//   - Footwear (medium)                      — footwearAppropriate == 'no' and overall risk >= moderate
//   - Self-care (medium)                     — selfCareAbility != 'independent' without support noted
//   - Incomplete examination (low)           — either foot's neuropathy/pulses status not tested
//
// Rows here mirror the `diabetes_podiatry_assessment_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

import { perFootRiskFactorCount } from './rules.js';

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {{ status: string, overallRisk: string }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Active ulceration (HIGH) ───────────────────────────────
  if (data.rightFoot.activeUlcer === 'yes' || data.leftFoot.activeUlcer === 'yes') {
    flags.push({
      id: 'F-ACTIVE-ULCER-001',
      category: 'active-ulcer',
      priority: 'high',
      description:
        'Active ulceration present on at least one foot.',
      suggestedAction:
        'Urgent referral to the multidisciplinary foot team (same or next working day).'
    });
  }

  // ─── Suspected Charcot foot (HIGH) ──────────────────────────
  if (data.rightFoot.suspectedCharcot === 'yes' || data.leftFoot.suspectedCharcot === 'yes') {
    flags.push({
      id: 'F-SUSPECTED-CHARCOT-001',
      category: 'suspected-charcot',
      priority: 'high',
      description:
        'Suspected acute Charcot foot (unexplained hot, red, swollen foot) on at least one foot — a limb-threatening emergency.',
      suggestedAction:
        'Urgent same/next-working-day referral to the multidisciplinary foot team; do not wait for imaging.'
    });
  }

  // ─── Critical limb ischaemia (HIGH) ─────────────────────────
  if (data.rightFoot.ulcerSeverity === 'critical-ischaemia' || data.leftFoot.ulcerSeverity === 'critical-ischaemia') {
    flags.push({
      id: 'F-CRITICAL-ISCHAEMIA-001',
      category: 'critical-ischaemia',
      priority: 'high',
      description:
        'Signs of critical limb ischaemia recorded on at least one foot ulcer.',
      suggestedAction:
        'Urgent vascular referral.'
    });
  }

  // ─── Previous major amputation (HIGH) ───────────────────────
  if (data.rightFoot.previousAmputation === 'major' || data.leftFoot.previousAmputation === 'major') {
    flags.push({
      id: 'F-PREVIOUS-MAJOR-AMPUTATION-001',
      category: 'previous-major-amputation',
      priority: 'high',
      description:
        'History of major (below/above knee) amputation on at least one foot — high risk regardless of the current examination.',
      suggestedAction:
        'Manage under the multidisciplinary foot team; review the contralateral / residual limb closely.'
    });
  }

  // ─── Renal replacement therapy (HIGH) ───────────────────────
  if (data.riskFactors.onRenalReplacementTherapy === 'yes') {
    flags.push({
      id: 'F-RENAL-REPLACEMENT-THERAPY-001',
      category: 'renal-replacement-therapy',
      priority: 'high',
      description:
        'Patient is on renal replacement therapy (dialysis) — an automatic high-risk factor per NICE NG19.',
      suggestedAction:
        'Manage as high risk regardless of current foot examination findings.'
    });
  }

  // ─── Combined risk factors (MEDIUM) ─────────────────────────
  const rightCount = perFootRiskFactorCount(data.rightFoot);
  const leftCount = perFootRiskFactorCount(data.leftFoot);
  if (
    (rightCount >= 2 && data.rightFoot.activeUlcer !== 'yes') ||
    (leftCount >= 2 && data.leftFoot.activeUlcer !== 'yes')
  ) {
    flags.push({
      id: 'F-COMBINED-RISK-FACTORS-001',
      category: 'combined-risk-factors',
      priority: 'medium',
      description:
        'Two or more risk factors combined on at least one foot (e.g. neuropathy and peripheral arterial disease, or either combined with callus/deformity).',
      suggestedAction:
        'Review referral timing to the multidisciplinary foot team.'
    });
  }

  // ─── Footwear (MEDIUM) ───────────────────────────────────────
  const riskOrder = { '': -1, low: 0, moderate: 1, high: 2, 'active-urgent': 3 };
  if (
    data.riskFactors.footwearAppropriate === 'no' &&
    riskOrder[grade.overallRisk] >= riskOrder['moderate']
  ) {
    flags.push({
      id: 'F-FOOTWEAR-001',
      category: 'footwear',
      priority: 'medium',
      description:
        'Current footwear is not appropriate for the patient’s risk level.',
      suggestedAction:
        'Refer to orthotics / footwear assessment.'
    });
  }

  // ─── Self-care (MEDIUM) ──────────────────────────────────────
  const selfCareImpaired =
    data.riskFactors.selfCareAbility !== 'independent' ||
    data.riskFactors.visualAcuityImpairment === 'yes';
  const supportNoted = /carer|support|family|assist/i.test(data.note.clinicalContext || '');
  if (selfCareImpaired && !supportNoted) {
    flags.push({
      id: 'F-SELF-CARE-001',
      category: 'self-care',
      priority: 'medium',
      description:
        'Patient’s ability to self-inspect and self-care for their feet is impaired, with no support recorded.',
      suggestedAction:
        'Arrange support (carer, family, or service) for regular foot self-inspection.'
    });
  }

  // ─── Incomplete examination (LOW) ────────────────────────────
  if (grade.status === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'A foot is missing a neuropathy or pulses test result — the risk classification may understate risk.',
      suggestedAction:
        'Complete the sensory neuropathy and pedal pulses test for each foot.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
