// Flagged-issue detection (red flags). Independent of the mortality band (which
// the grader produces), this module raises clinician-facing safety flags per
// spec §5, using the computed score and the raw laboratory inputs:
//
//   - Transplant referral (high)        — meldScore >= 15
//   - Urgent review (high)              — meldScore >= 30
//   - On dialysis / renal failure (high)— dialysis rule applied
//   - Hyponatraemia (medium)            — sodium < 130
//   - Coagulopathy (medium)             — inr >= 2.5
//   - Incomplete assessment (low)       — a required lab input missing (no score)
//
// Rows here mirror the `model_for_end_stage_liver_disease_score_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ModelForEndStageLiverDiseaseScore.
(function () {
'use strict';
window.ModelForEndStageLiverDiseaseScore =
  window.ModelForEndStageLiverDiseaseScore || {};
const { isNum, missingInputs } = window.ModelForEndStageLiverDiseaseScore;

/**
 * @param {AssessmentData} data
 * @param {GradingResult} result   - output of calculateMeld(data)
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, result) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const variant = data.context.meldVariant || '';
  const inr = data.inr.inr;
  const sodium = data.sodium.sodium;
  const meldScore = result.meldScore;

  // ─── Incomplete assessment (LOW) ────────────────────────────
  if (meldScore === null) {
    const missing = missingInputs(variant, {
      bili: data.bilirubin.bilirubin,
      inr: data.inr.inr,
      creat: data.renal.creatinine,
      sodium: data.sodium.sodium,
      albumin: data.albumin.albumin
    });
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description:
        `Missing input(s): ${missing.join(', ')} — no MELD score can be computed`,
      suggestedAction:
        'Record the missing laboratory value(s) and re-calculate.'
    });
    return flags;
  }

  // ─── Transplant referral (HIGH) ─────────────────────────────
  if (meldScore >= 15) {
    flags.push({
      id: 'F-TRANSPLANT-REFERRAL-001',
      category: 'transplant-referral',
      priority: 'high',
      description:
        `MELD ${meldScore} at or above the conventional transplant-benefit threshold of 15`,
      suggestedAction:
        'Refer to, or discuss with, a liver transplant centre.'
    });
  }

  // ─── Urgent review (HIGH) ───────────────────────────────────
  if (meldScore >= 30) {
    flags.push({
      id: 'F-URGENT-REVIEW-001',
      category: 'urgent-review',
      priority: 'high',
      description:
        `MELD ${meldScore} indicates very high short-term mortality`,
      suggestedAction:
        'Arrange urgent hepatology / critical-care review.'
    });
  }

  // ─── On dialysis / renal failure (HIGH) ─────────────────────
  if (result.dialysisRuleApplied) {
    flags.push({
      id: 'F-ON-DIALYSIS-001',
      category: 'on-dialysis',
      priority: 'high',
      description:
        'Dialysis rule applied — creatinine set to 4.0 mg/dL, reflecting significant renal impairment',
      suggestedAction:
        'Review renal-replacement status and involve nephrology as indicated.'
    });
  }

  // ─── Hyponatraemia (MEDIUM) ─────────────────────────────────
  if (isNum(sodium) && Number(sodium) < 130) {
    flags.push({
      id: 'F-HYPONATRAEMIA-001',
      category: 'hyponatraemia',
      priority: 'medium',
      description:
        `Serum sodium ${sodium} mEq/L below 130 — raises mortality risk and increases MELD-Na`,
      suggestedAction:
        'Assess the cause of hyponatraemia and correct cautiously per local policy.'
    });
  }

  // ─── Coagulopathy (MEDIUM) ──────────────────────────────────
  if (isNum(inr) && Number(inr) >= 2.5) {
    flags.push({
      id: 'F-COAGULOPATHY-001',
      category: 'coagulopathy',
      priority: 'medium',
      description:
        `INR ${inr} at or above 2.5 — marked derangement of clotting`,
      suggestedAction:
        'Assess bleeding risk; correct only for active bleeding or procedures.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.ModelForEndStageLiverDiseaseScore.detectFlaggedIssues = detectFlaggedIssues;
})();
