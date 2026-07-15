import { priorityOrder, weeksBetween } from './types.js';

// MAT B1 maternity certificate - additional flagged issues.
//
// Clinical / administrative flags raised in addition to the rule-based
// completeness checks:
//
//   - Missing certificate number               -> urgent (cannot be filed by DWP).
//   - Issued > 20 weeks before EWC             -> high (DWP will reject).
//   - Midwife with expired NMC on issue date   -> high.
//   - Duplicate not marked "DUPLICATE"         -> medium.
//   - Examination after EWC on Part A          -> medium (use Part B instead).
//   - Both Part A and Part B partially filled  -> medium.
//   - Issue date in the future                 -> low (data quality).
//
// Pure function: no mutation, no side effects.
//
// Ported from forms/united-kingdom-maternity-certificate-mat-b1/
//   front-end-form-with-svelte/src/lib/engine/flagged-issues.ts

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // --- Urgent: missing certificate number --------------------------
  if (!data.issuer.certificateNumber || data.issuer.certificateNumber.trim() === '') {
    flags.push({
      id: 'FLAG-CERT-NUMBER-URGENT-001',
      category: 'Certificate',
      message:
        'Unique certificate number is missing - the DWP cannot accept a MAT B1 without an official pre-printed certificate number.',
      priority: 'urgent'
    });
  }

  // --- High: issued > 20 weeks before EWC --------------------------
  if (data.certificateType === 'pre') {
    const weeks = weeksBetween(
      data.preConfinement.examinationDate,
      data.preConfinement.expectedDateOfConfinement
    );
    if (weeks !== null && weeks > 20) {
      flags.push({
        id: 'FLAG-EWC-WINDOW-HIGH-001',
        category: 'Timing',
        message:
          `Certificate is being issued ${weeks} weeks before the expected date of confinement. DWP guidance prohibits issuing a MAT B1 more than 20 weeks before the EWC.`,
        priority: 'high'
      });
    }
  }

  // --- High: midwife with expired NMC registration -----------------
  if (
    data.issuer.issuerType === 'midwife' &&
    data.issuer.midwife.nmcExpiryDate &&
    data.issuer.issueDate
  ) {
    const expiry = new Date(data.issuer.midwife.nmcExpiryDate);
    const issued = new Date(data.issuer.issueDate);
    if (
      !isNaN(expiry.getTime()) &&
      !isNaN(issued.getTime()) &&
      expiry.getTime() < issued.getTime()
    ) {
      flags.push({
        id: 'FLAG-NMC-EXPIRY-HIGH-001',
        category: 'Issuer',
        message:
          "Midwife's NMC registration has expired before the certificate issue date. A midwife cannot issue a MAT B1 with lapsed NMC registration.",
        priority: 'high'
      });
    }
  }

  // --- Medium: duplicate not marked "DUPLICATE" --------------------
  if (
    data.issuer.isDuplicate === 'yes' &&
    data.issuer.duplicateMarkerApplied !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-DUPLICATE-MED-001',
      category: 'Duplicate',
      message:
        'Replacement (duplicate) certificate is not marked "DUPLICATE". DWP guidance requires the marker on all replacement certificates.',
      priority: 'medium'
    });
  }

  // --- Medium: Part A examination date after EWC -------------------
  if (data.certificateType === 'pre') {
    const weeks = weeksBetween(
      data.preConfinement.examinationDate,
      data.preConfinement.expectedDateOfConfinement
    );
    if (weeks !== null && weeks < 0) {
      flags.push({
        id: 'FLAG-PART-A-AFTER-EWC-MED-001',
        category: 'Timing',
        message:
          'Part A examination date is after the expected date of confinement. If the baby has been born, switch to Part B (post-confinement).',
        priority: 'medium'
      });
    }
  }

  // --- Medium: both Part A and Part B partially populated ----------
  const partAStarted =
    (data.preConfinement.expectedDateOfConfinement || '').trim() !== '' ||
    (data.preConfinement.examinationDate || '').trim() !== '';
  const partBStarted =
    (data.postConfinement.actualDateOfBirth || '').trim() !== '' ||
    (data.postConfinement.expectedDateOfConfinement || '').trim() !== '';
  if (partAStarted && partBStarted) {
    flags.push({
      id: 'FLAG-PARTS-CONFLICT-MED-001',
      category: 'Consistency',
      message:
        'Both Part A and Part B contain data. The MAT B1 form is mutually exclusive - select only one certificate type.',
      priority: 'medium'
    });
  }

  // --- Low: issue date in the future -------------------------------
  if (data.issuer.issueDate) {
    const issued = new Date(data.issuer.issueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!isNaN(issued.getTime()) && issued.getTime() > today.getTime()) {
      flags.push({
        id: 'FLAG-FUTURE-ISSUE-LOW-001',
        category: 'Data quality',
        message:
          'Issue date is in the future. The MAT B1 should be dated the day it is signed.',
        priority: 'low'
      });
    }
  }

  flags.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
  return flags;
}

export { detectAdditionalFlags };
