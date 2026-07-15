import { abnormalVitals, allergyDocumented, missingCoreExam, missingHistory, nonEmpty } from './rules.js';

// Flagged-issue detection (safety flags). Computed independently of the
// completeness status per spec §5, each flag carries a priority and a suggested
// action. Two categories are BLOCKING (they force an incomplete status in the
// grader): allergies-not-documented and no-impression-or-plan.
//
//   - Allergies not documented (high, blocking) — allergyStatus '' or 'not-documented'
//   - No impression or plan (high, blocking)    — impression '' AND managementPlan ''
//   - Red-flag finding without a plan (high)    — redFlagFindings != '' AND managementPlan ''
//   - Abnormal vital signs (medium)             — any recorded vital outside range, or not alert
//   - Incomplete systems examination (medium)   — a core system neither examined nor deferred
//   - Incomplete history (low)                  — a required history section missing
//
// Rows here mirror the `history_and_physical_examination_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').ClerkingRecord} ClerkingRecord
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {ClerkingRecord} r
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(r) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Allergies not documented (HIGH, BLOCKING) ──────────────
  if (!allergyDocumented(r)) {
    flags.push({
      id: 'F-ALLERGIES-NOT-DOCUMENTED-001',
      category: 'allergies-not-documented',
      priority: 'high',
      blocking: true,
      description:
        'Allergy status is not documented — neither an allergy nor "no known drug allergies" has been recorded.',
      suggestedAction:
        'Document the allergy status explicitly (record "no known drug allergies" if none) before completing the clerking.'
    });
  }

  // ─── No impression or plan (HIGH, BLOCKING) ─────────────────
  if (!nonEmpty(r.impression) && !nonEmpty(r.managementPlan)) {
    flags.push({
      id: 'F-NO-IMPRESSION-OR-PLAN-001',
      category: 'no-impression-or-plan',
      priority: 'high',
      blocking: true,
      description:
        'Neither an impression / problem list nor a management plan has been recorded.',
      suggestedAction:
        'Record a working impression and a management plan; both are required for a complete clerking.'
    });
  }

  // ─── Red-flag finding without a plan (HIGH) ─────────────────
  if (nonEmpty(r.redFlagFindings) && !nonEmpty(r.managementPlan)) {
    flags.push({
      id: 'F-RED-FLAG-NO-PLAN-001',
      category: 'red-flag-no-plan',
      priority: 'high',
      blocking: false,
      description:
        'A red-flag finding is recorded but there is no corresponding management plan.',
      suggestedAction:
        'Document a management-plan entry addressing the recorded red-flag finding (escalation, investigation, or treatment).'
    });
  }

  // ─── Abnormal vital signs (MEDIUM) ──────────────────────────
  const abnormal = abnormalVitals(r);
  if (abnormal.length > 0) {
    flags.push({
      id: 'F-ABNORMAL-VITALS-001',
      category: 'abnormal-vitals',
      priority: 'medium',
      blocking: false,
      description: `Abnormal vital sign(s) recorded: ${abnormal.join('; ')}.`,
      suggestedAction:
        'Review the abnormal observation(s), calculate the early-warning score (NEWS2), and escalate per local policy.'
    });
  }

  // ─── Incomplete systems examination (MEDIUM) ────────────────
  const missingExam = missingCoreExam(r);
  if (missingExam.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-SYSTEMS-EXAM-001',
      category: 'incomplete-systems-exam',
      priority: 'medium',
      blocking: false,
      description: `Core examination system(s) neither examined nor explicitly deferred: ${missingExam.join(', ')}.`,
      suggestedAction:
        'Examine the outstanding system(s) or record an explicit deferral with a reason.'
    });
  }

  // ─── Incomplete history (LOW) ───────────────────────────────
  const missingHx = missingHistory(r);
  if (missingHx.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-HISTORY-001',
      category: 'incomplete-history',
      priority: 'low',
      blocking: false,
      description: `Required history section(s) missing: ${missingHx.join(', ')}.`,
      suggestedAction:
        'Complete the outstanding history section(s) to finish the clerking document.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
