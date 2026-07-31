// Safety flags for the inpatient clinical note (spec §6).
//
// Flags fire independently of BOTH grades: a note can be Complete and still
// raise a high-priority flag, and an Incomplete note is not automatically
// unsafe. Each flag carries a stable id, a category, a priority, a description
// of what fired it, and a suggested action.
//
// Flags are never suppressed — a low-priority flag is still rendered. The form
// does not decide whether a clinical action was appropriate; it records whether
// an action the guidance implies was DOCUMENTED.

import { atLeast } from './acuity.js';
import { has } from './rules.js';

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 * @typedef {import('./types.js').AcuityBand} AcuityBand
 */

/** Length of stay in whole days, or null when either timestamp is missing. */
function lengthOfStayDays(data) {
  const admission = data.admission.admissionAt;
  const note = data.header.noteAt;
  if (!has(admission) || !has(note)) return null;
  const a = new Date(admission).getTime();
  const n = new Date(note).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(n) || n < a) return null;
  return Math.floor((n - a) / (1000 * 60 * 60 * 24));
}

/**
 * Detect every safety flag for a note.
 *
 * @param {AssessmentData} data
 * @param {{acuityBand: AcuityBand, documentedRequired: number, totalRequired: number}} context
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, context) {
  const { acuityBand, documentedRequired, totalRequired } = context;
  const a = data.assessment;
  const med = data.medications;
  const pl = data.planning;
  const so = data.signOff;
  const risks = data.risks;

  /** @type {FlaggedIssue[]} */
  const flags = [];

  if (atLeast(acuityBand, 'escalate') && !has(pl.escalationAction)) {
    flags.push({
      id: 'F-DETERIORATING-NO-ESCALATION-001',
      category: 'deteriorating-news2-no-escalation',
      priority: 'high',
      description:
        `The acuity band is ${acuityBand}, but no escalation action is recorded on this note.`,
      suggestedAction:
        'Escalate to the senior on call or the critical-care outreach team, and record the action taken.'
    });
  }

  if (a.sepsisScreen === 'positive') {
    const antimicrobialStarted = med.rows.some(
      (r) => r.isAntimicrobial === 'yes' && (r.action === 'started' || r.action === 'switched')
    );
    if (!antimicrobialStarted && !has(pl.escalationAction)) {
      flags.push({
        id: 'F-SEPSIS-NO-ACTION-001',
        category: 'sepsis-screen-positive-no-action',
        priority: 'high',
        description:
          'The sepsis screen is positive, but neither an antimicrobial change nor an escalation action is recorded.',
        suggestedAction:
          'Start the sepsis pathway: senior review, cultures, antimicrobials, fluids, and lactate. Record what was done.'
      });
    }
  }

  if (risks.vteStatus === 'not-done') {
    flags.push({
      id: 'F-VTE-NOT-ASSESSED-001',
      category: 'vte-not-assessed',
      priority: 'high',
      description:
        'The VTE risk assessment has not been done. NICE NG89 requires one for every inpatient.',
      suggestedAction:
        'Complete the VTE risk assessment and prescribe or document prophylaxis.'
    });
  }

  const unactioned = data.investigations.rows.filter(
    (r) => r.abnormal === 'yes' && r.actioned !== 'yes'
  );
  if (unactioned.length > 0) {
    const names = unactioned
      .map((r) => r.testName)
      .filter((n) => has(n))
      .join(', ');
    flags.push({
      id: 'F-ABNORMAL-NOT-ACTIONED-001',
      category: 'abnormal-result-not-actioned',
      priority: 'high',
      description: names
        ? `${unactioned.length} abnormal result(s) not actioned: ${names}.`
        : `${unactioned.length} abnormal result(s) recorded without an action.`,
      suggestedAction:
        'Review each abnormal result, act on it, and record the action taken.'
    });
  }

  if (!has(pl.plan) && pl.jobs.length === 0) {
    flags.push({
      id: 'F-NO-PLAN-001',
      category: 'no-plan-documented',
      priority: 'high',
      description: 'No plan and no jobs are recorded on this note.',
      suggestedAction:
        'Record the management plan and the outstanding jobs, so the next clinician can safely continue care.'
    });
  }

  if (med.rows.length > 0 && med.allergyChecked !== 'yes') {
    flags.push({
      id: 'F-ALLERGY-NOT-CHECKED-001',
      category: 'allergy-not-checked',
      priority: 'high',
      description:
        'Medication changes are recorded, but the allergy status was not confirmed as checked.',
      suggestedAction:
        'Check and record the allergy status before prescribing.'
    });
  }

  if ((atLeast(acuityBand, 'escalate') || has(pl.ceilingOfCare)) && !has(pl.seniorReviewBy)) {
    flags.push({
      id: 'F-NO-SENIOR-REVIEW-001',
      category: 'no-senior-review',
      priority: 'medium',
      description: atLeast(acuityBand, 'escalate')
        ? `The acuity band is ${acuityBand}, but no senior reviewer is named.`
        : 'A ceiling-of-care decision is recorded, but no senior reviewer is named.',
      suggestedAction:
        'Name the senior who reviewed the patient, or arrange a senior review and record it.'
    });
  }

  if (has(pl.escalationStatus) && !has(pl.ceilingOfCare)) {
    flags.push({
      id: 'F-CEILING-UNDOCUMENTED-001',
      category: 'ceiling-of-care-undocumented',
      priority: 'medium',
      description:
        'An escalation status is recorded without a corresponding ceiling of care.',
      suggestedAction:
        'Record the agreed ceiling of care, so the out-of-hours team knows the limits of treatment.'
    });
  }

  if (med.antimicrobialReviewStatus === 'overdue') {
    flags.push({
      id: 'F-ANTIMICROBIAL-OVERDUE-001',
      category: 'antimicrobial-review-overdue',
      priority: 'medium',
      description:
        'An antimicrobial is in use past its review date (NICE NG15 antimicrobial stewardship).',
      suggestedAction:
        'Review the antimicrobial: stop, switch to oral, or document the reason for continuing and a new review date.'
    });
  }

  const capacityDependent =
    so.consentStatus === 'lacks-capacity' || so.consentStatus === 'best-interests';
  if (capacityDependent && so.capacityAssessed !== 'yes') {
    flags.push({
      id: 'F-NO-CAPACITY-ASSESSMENT-001',
      category: 'no-capacity-assessment',
      priority: 'medium',
      description:
        'A capacity-dependent decision is recorded without a documented capacity assessment.',
      suggestedAction:
        'Carry out and record a mental-capacity assessment under the Mental Capacity Act 2005.'
    });
  }

  const los = lengthOfStayDays(data);
  if (los !== null && los > 7 && !has(pl.estimatedDischargeDate)) {
    flags.push({
      id: 'F-LONG-STAY-NO-EDD-001',
      category: 'long-stay-no-discharge-plan',
      priority: 'low',
      description: `Length of stay is ${los} days with no estimated discharge date recorded.`,
      suggestedAction:
        'Set an estimated date of discharge and record the outstanding blockers to it.'
    });
  }

  if (documentedRequired < totalRequired) {
    const missing = totalRequired - documentedRequired;
    flags.push({
      id: 'F-INCOMPLETE-ENTRY-001',
      category: 'incomplete-entry',
      priority: 'low',
      description: `${missing} of ${totalRequired} required components for this note type are not documented.`,
      suggestedAction:
        'Complete the missing components before signing the entry.'
    });
  }

  return flags;
}

export { lengthOfStayDays, detectFlaggedIssues };
