import { has, safetyNettingRequired as safetyNettingRequired$imported } from './rules.js';

// Flagged-issue detection (safety flags). Independent of the completeness
// status (which the grader produces), this module raises clinician-facing
// safety flags per spec §5, each with a priority. A high-priority flag also
// prevents a note from grading Complete (see grader.js).
//
//   - Missing assessment (high)              — no diagnosis, problem, or differential
//   - Missing plan (high)                    — no plan item recorded
//   - Red-flag symptoms without a plan (high)— red flags documented but Plan empty
//   - No safety-netting (medium)             — safety-netting required but absent
//   - Abnormal vitals not addressed (medium) — abnormal vital flagged, not referenced
//                                              in the Assessment or Plan
//   - Incomplete documentation (low)         — completenessPercent < 100
//
// Categories mirror the `soap_note_grade_flag` SQL CHECK constraint
// (missing-assessment, missing-plan, red-flag-no-plan, no-safety-netting,
// abnormal-vitals-unaddressed, incomplete-documentation, other).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.SoapNote.

/**
 * Detect the safety flags raised by the note.
 *
 * @param {AssessmentData} data
 * @param {{ presence: {subjectivePresent: boolean, objectivePresent: boolean,
 *           assessmentPresent: boolean, planPresent: boolean},
 *           completenessPercent: number }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const presence = grade.presence;
  const completenessPercent = grade.completenessPercent;

  const redFlags = data.subjective.redFlagSymptoms === 'yes';
  const abnormalVitals = data.objective.abnormalVitalsPresent === 'yes';
  const safetyNettingRequired = safetyNettingRequired$imported(data);
  const safetyNettingRecorded = has(data.plan.safetyNetting);

  // ─── Missing assessment (HIGH) ─────────────────────────────
  if (!presence.assessmentPresent) {
    flags.push({
      id: 'F-MISSING-ASSESSMENT-001',
      category: 'missing-assessment',
      priority: 'high',
      description: 'No diagnosis, problem, or differential recorded in the Assessment section',
      suggestedAction: 'Record the primary diagnosis or problem so another clinician can safely continue care.'
    });
  }

  // ─── Missing plan (HIGH) ───────────────────────────────────
  if (!presence.planPresent) {
    flags.push({
      id: 'F-MISSING-PLAN-001',
      category: 'missing-plan',
      priority: 'high',
      description: 'No plan item (investigation, treatment, referral, or follow-up) recorded in the Plan section',
      suggestedAction: 'Record what happens next so the note can safely stand alone.'
    });
  }

  // ─── Red-flag symptoms without a plan (HIGH) ───────────────
  if (redFlags && !presence.planPresent) {
    flags.push({
      id: 'F-RED-FLAG-NO-PLAN-001',
      category: 'red-flag-no-plan',
      priority: 'high',
      description: 'Red-flag symptoms are documented but the Plan section is empty',
      suggestedAction: 'Document the management and escalation plan for the red-flag symptoms recorded.'
    });
  }

  // ─── No safety-netting (MEDIUM) ────────────────────────────
  if (safetyNettingRequired && !safetyNettingRecorded) {
    flags.push({
      id: 'F-NO-SAFETY-NETTING-001',
      category: 'no-safety-netting',
      priority: 'medium',
      description: data.subjective.redFlagSymptoms === 'yes'
        ? 'Red-flag symptoms are recorded but no safety-netting advice is documented'
        : 'The patient is managed at home but no safety-netting advice is documented',
      suggestedAction: 'Document safety-netting advice: what to look out for and when and how to seek further help.'
    });
  }

  // ─── Abnormal vitals not addressed (MEDIUM) ────────────────
  if (abnormalVitals && !presence.assessmentPresent && !presence.planPresent) {
    flags.push({
      id: 'F-ABNORMAL-VITALS-UNADDRESSED-001',
      category: 'abnormal-vitals-unaddressed',
      priority: 'medium',
      description: 'Abnormal vital signs are flagged but are not referenced in the Assessment or Plan',
      suggestedAction: 'Address the abnormal vital signs in the Assessment or Plan, or explain why no action is needed.'
    });
  }

  // ─── Incomplete documentation (LOW) ────────────────────────
  if (completenessPercent < 100) {
    flags.push({
      id: 'F-INCOMPLETE-DOCUMENTATION-001',
      category: 'incomplete-documentation',
      priority: 'low',
      description: 'One or more required components are missing — the note is not fully documented',
      suggestedAction: 'Complete the outstanding required components so the SOAP note is whole.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

  return flags;
}

export { detectFlaggedIssues };
