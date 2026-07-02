// Flagged-issue detection (statutory, safety, and governance). Independent of the
// validity class (which the grader produces), this module raises certifier- and
// examiner-facing flags per spec §5:
//
//   - Coroner referral required (high)          — a referral criterion is asserted.
//   - Unacceptable sole cause (high)            — a recognised mode of death is
//                                                 the only cause given.
//   - Missing Part I(a) (high)                  — no direct cause of death recorded.
//   - Illogical sequence (medium)               — Part I lines are not in a
//                                                 plausible downward causal order.
//   - Medical-examiner scrutiny required (medium) — always raised for a
//                                                 non-referred certificate not yet
//                                                 scrutinised.
//   - Missing interval (low)                    — a completed Part I line has no
//                                                 onset-to-death interval.
//   - Incomplete certifier details (low)        — certifier identity, grade, GMC
//                                                 reference, or attendance missing.
//
// Rows here mirror the `medical_certificate_of_cause_of_death_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action). NOTHING
// here diagnoses or discharges a statutory duty; the flags support the
// certifying doctor's and medical examiner's judgement.

/**
 * @typedef {import('./types.js').DeathCertificate} DeathCertificate
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.MedicalCertificateOfCauseOfDeath.
(function () {
'use strict';
window.MedicalCertificateOfCauseOfDeath =
  window.MedicalCertificateOfCauseOfDeath || {};
const {
  nonEmpty,
  coronerReferralIndicated,
  unacceptableSoleCause,
  soleCause,
  missingPartIa,
  illogicalSequence,
  coronerReasonLabel
} = window.MedicalCertificateOfCauseOfDeath;

/**
 * @param {DeathCertificate} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Coroner referral required (HIGH) ───────────────────────
  if (coronerReferralIndicated(d)) {
    const reason = d.referral.coronerReason;
    const reasonText =
      reason && reason !== 'none' && reason !== ''
        ? ` (${coronerReasonLabel(reason)})`
        : '';
    flags.push({
      id: 'F-CORONER-REFERRAL-REQUIRED-001',
      category: 'coroner-referral-required',
      priority: 'high',
      description:
        `A coroner-referral criterion is asserted${reasonText}. The MCCD should not be issued until the coroner has considered the case.`,
      suggestedAction:
        'Refer the death to the coroner and do not issue the certificate until the coroner has determined whether an investigation is required.'
    });
  }

  // ─── Unacceptable sole cause (HIGH) ─────────────────────────
  if (unacceptableSoleCause(d)) {
    flags.push({
      id: 'F-UNACCEPTABLE-SOLE-CAUSE-001',
      category: 'unacceptable-sole-cause',
      priority: 'high',
      description:
        `The only cause given ("${soleCause(d).trim()}") is a recognised mode of death, not a disease or injury. A mode of death is unacceptable as the sole cause.`,
      suggestedAction:
        'State the underlying disease or condition that led to the mode of death on a lower Part I line.'
    });
  }

  // ─── Missing Part I(a) (HIGH) ───────────────────────────────
  if (missingPartIa(d)) {
    flags.push({
      id: 'F-MISSING-PART-I-001',
      category: 'missing-part-i',
      priority: 'high',
      description:
        'No direct cause of death is recorded on Part I(a). Every certificate must record the disease or condition directly leading to death.',
      suggestedAction:
        'Record the disease or condition directly leading to death on Part I(a).'
    });
  }

  // ─── Illogical sequence (MEDIUM) ────────────────────────────
  if (illogicalSequence(d)) {
    flags.push({
      id: 'F-ILLOGICAL-SEQUENCE-001',
      category: 'illogical-sequence',
      priority: 'medium',
      description:
        'The Part I lines are not in a plausible downward causal order: a completed line sits below an empty line above it. The sequence must read downward from the immediate cause I(a) to the underlying cause.',
      suggestedAction:
        'Reorder the Part I sequence so each line records a condition that gave rise to the line above it, with no gaps.'
    });
  }

  // ─── Medical-examiner scrutiny required (MEDIUM) ────────────
  // Always raised for a non-referred certificate not yet scrutinised: every
  // death not investigated by a coroner must be scrutinised by an NHS medical
  // examiner before registration.
  if (
    d.referral.referredToCoroner !== 'yes' &&
    d.referral.medicalExaminerStatus !== 'scrutinised'
  ) {
    flags.push({
      id: 'F-MEDICAL-EXAMINER-SCRUTINY-001',
      category: 'medical-examiner-scrutiny',
      priority: 'medium',
      description:
        'This certificate has not been referred to the coroner and has not yet been scrutinised by a medical examiner. Every non-coroner death requires medical-examiner scrutiny before registration.',
      suggestedAction:
        'Refer the certificate to the medical examiner for scrutiny before the death is registered.'
    });
  }

  // ─── Missing interval (LOW) ─────────────────────────────────
  // A completed Part I condition line with an empty onset-to-death interval.
  const intervalPairs = [
    { label: 'I(a)', condition: d.partI.causeIaCondition, interval: d.partI.causeIaInterval },
    { label: 'I(b)', condition: d.partI.causeIbCondition, interval: d.partI.causeIbInterval },
    { label: 'I(c)', condition: d.partI.causeIcCondition, interval: d.partI.causeIcInterval }
  ];
  const missingIntervalLines = intervalPairs
    .filter((p) => nonEmpty(p.condition) && !nonEmpty(p.interval))
    .map((p) => p.label);
  if (missingIntervalLines.length > 0) {
    flags.push({
      id: 'F-MISSING-INTERVAL-001',
      category: 'missing-interval',
      priority: 'low',
      description:
        `A completed cause line has no onset-to-death interval: ${missingIntervalLines.join(', ')}. Each cause line should carry an approximate interval.`,
      suggestedAction:
        'Record the approximate interval between onset and death for each completed Part I line.'
    });
  }

  // ─── Incomplete certifier details (LOW) ─────────────────────
  const missingCertifier = [];
  if (!nonEmpty(d.certification.certifyingDoctorName)) missingCertifier.push('name');
  if (!nonEmpty(d.certification.certifyingDoctorGrade)) missingCertifier.push('grade');
  if (!nonEmpty(d.certification.gmcReference)) missingCertifier.push('GMC reference');
  if (!nonEmpty(d.certification.attendedDeceased)) missingCertifier.push('attendance on the deceased');
  if (missingCertifier.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-CERTIFIER-001',
      category: 'incomplete-certifier',
      priority: 'low',
      description:
        `Certifying-doctor details are incomplete: ${missingCertifier.join(', ')} not recorded.`,
      suggestedAction:
        'Complete the certifying doctor’s identity, grade, GMC reference, and attendance on the deceased.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.MedicalCertificateOfCauseOfDeath.detectFlaggedIssues = detectFlaggedIssues;
})();
