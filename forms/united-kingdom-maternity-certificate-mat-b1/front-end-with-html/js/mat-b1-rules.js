// MAT B1 maternity certificate - validation rules.
//
// Each rule's `evaluate(data)` returns true when the rule *fires* (i.e. a
// problem is detected). Rules cover four concerns:
//
//   1. Completeness - required fields for the active certificate branch
//      (Part A pre-confinement vs Part B post-confinement) and the active
//      issuer branch (doctor vs midwife).
//   2. Consistency - Part A and Part B are mutually exclusive; the issuer
//      type must be one of doctor or midwife; duplicate marker required when
//      isDuplicate = yes.
//   3. Timing - DWP guidance: certificate must not be issued more than 20
//      weeks before the expected week of confinement (EWC).
//   4. Declaration - completed-in-ink confirmation; valid NMC registration
//      for midwives.
//
// Ported from forms/united-kingdom-maternity-certificate-mat-b1/
//   front-end-form-with-svelte/src/lib/engine/mat-b1-rules.ts
//
// The rules are pure: no side effects, no network calls.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {import('./types.js').RuleCategory} category
 * @property {import('./types.js').RulePriority} priority
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 * @property {string} message
 */

(function () {
'use strict';
window.MatB1Form = window.MatB1Form || {};
const { isFilled, weeksBetween } = window.MatB1Form;

/** @type {ValidationRule[]} */
const matB1Rules = [
  // --- Patient identification --------------------------------------
  {
    id: 'MATB1-PT-001',
    category: 'completeness',
    priority: 'high',
    description: 'Patient name must be provided on the front page.',
    evaluate: (d) => !isFilled(d.patientIdentification.patientName),
    message: "Patient's name is missing on the front page (above Part A)."
  },

  // --- Certificate type selection ----------------------------------
  {
    id: 'MATB1-CERT-001',
    category: 'completeness',
    priority: 'high',
    description:
      'Either Part A (pre-confinement) or Part B (post-confinement) must be selected.',
    evaluate: (d) => d.certificateType === '',
    message:
      'Certificate type is not selected. Choose Part A (pre-confinement) or Part B (post-confinement) - they are mutually exclusive.'
  },

  // --- Part A - Pre-confinement ------------------------------------
  {
    id: 'MATB1-A-001',
    category: 'completeness',
    priority: 'high',
    description: 'Part A: expected date of confinement must be provided.',
    evaluate: (d) =>
      d.certificateType === 'pre' &&
      !isFilled(d.preConfinement.expectedDateOfConfinement),
    message:
      'Part A: expected date of confinement (EWC) is missing. The EWC is required for SMP and Maternity Allowance entitlement.'
  },
  {
    id: 'MATB1-A-002',
    category: 'completeness',
    priority: 'medium',
    description: 'Part A: examination date must be provided.',
    evaluate: (d) =>
      d.certificateType === 'pre' && !isFilled(d.preConfinement.examinationDate),
    message: 'Part A: examination date is missing.'
  },
  {
    id: 'MATB1-A-003',
    category: 'timing',
    priority: 'high',
    description:
      'Part A: certificate must not be issued more than 20 weeks before the EWC.',
    evaluate: (d) => {
      if (d.certificateType !== 'pre') return false;
      const w = weeksBetween(
        d.preConfinement.examinationDate,
        d.preConfinement.expectedDateOfConfinement
      );
      return w !== null && w > 20;
    },
    message:
      'Part A: examination date is more than 20 weeks before the expected date of confinement. DWP guidance prohibits issuing a MAT B1 this early.'
  },
  {
    id: 'MATB1-A-004',
    category: 'consistency',
    priority: 'medium',
    description: 'Part A: examination date should not be after the EWC.',
    evaluate: (d) => {
      if (d.certificateType !== 'pre') return false;
      const w = weeksBetween(
        d.preConfinement.examinationDate,
        d.preConfinement.expectedDateOfConfinement
      );
      return w !== null && w < 0;
    },
    message:
      'Part A: examination date is after the expected date of confinement. Use Part B (post-confinement) once the baby has been born.'
  },

  // --- Part B - Post-confinement -----------------------------------
  {
    id: 'MATB1-B-001',
    category: 'completeness',
    priority: 'high',
    description: "Part B: baby's actual date of birth must be provided.",
    evaluate: (d) =>
      d.certificateType === 'post' && !isFilled(d.postConfinement.actualDateOfBirth),
    message: "Part B: baby's actual date of birth is missing."
  },
  {
    id: 'MATB1-B-002',
    category: 'completeness',
    priority: 'high',
    description: 'Part B: expected date of confinement must be provided.',
    evaluate: (d) =>
      d.certificateType === 'post' &&
      !isFilled(d.postConfinement.expectedDateOfConfinement),
    message:
      'Part B: expected date of confinement is missing. Entitlement still depends on the EWC even when the certificate is issued post-birth.'
  },
  {
    id: 'MATB1-B-003',
    category: 'consistency',
    priority: 'medium',
    description:
      'Part B: actual date of birth should not be earlier than 16 weeks before the EWC (extreme prematurity sanity check).',
    evaluate: (d) => {
      if (d.certificateType !== 'post') return false;
      const w = weeksBetween(
        d.postConfinement.actualDateOfBirth,
        d.postConfinement.expectedDateOfConfinement
      );
      return w !== null && w > 16;
    },
    message:
      "Part B: actual date of birth is more than 16 weeks before the expected date of confinement - please double-check both dates."
  },

  // --- Issuer type selection ---------------------------------------
  {
    id: 'MATB1-ISS-001',
    category: 'completeness',
    priority: 'high',
    description: 'Issuer type (doctor or registered midwife) must be selected.',
    evaluate: (d) => d.issuer.issuerType === '',
    message:
      'Issuer type is not selected. The MAT B1 must be signed by either a doctor or a registered midwife.'
  },

  // --- Doctor issuer -----------------------------------------------
  {
    id: 'MATB1-DR-001',
    category: 'completeness',
    priority: 'high',
    description: "Doctor: doctor's name must be provided.",
    evaluate: (d) =>
      d.issuer.issuerType === 'doctor' && !isFilled(d.issuer.doctor.doctorName),
    message: "Doctor: doctor's name is missing on the issuer details."
  },
  {
    id: 'MATB1-DR-002',
    category: 'completeness',
    priority: 'medium',
    description: 'Doctor: practice name must be provided.',
    evaluate: (d) =>
      d.issuer.issuerType === 'doctor' && !isFilled(d.issuer.doctor.practiceName),
    message: 'Doctor: practice name is missing.'
  },
  {
    id: 'MATB1-DR-003',
    category: 'completeness',
    priority: 'medium',
    description: 'Doctor: practice address must be provided.',
    evaluate: (d) =>
      d.issuer.issuerType === 'doctor' && !isFilled(d.issuer.doctor.practiceAddress),
    message: 'Doctor: practice address is missing.'
  },
  {
    id: 'MATB1-DR-004',
    category: 'declaration',
    priority: 'high',
    description: 'Doctor: name-and-address stamp must be applied.',
    evaluate: (d) =>
      d.issuer.issuerType === 'doctor' && d.issuer.doctor.stampApplied !== 'yes',
    message:
      'Doctor: name-and-address stamp has not been confirmed as applied. DWP guidance requires the official stamp on every MAT B1.'
  },

  // --- Midwife issuer ----------------------------------------------
  {
    id: 'MATB1-MW-001',
    category: 'completeness',
    priority: 'high',
    description: "Midwife: midwife's name must be provided.",
    evaluate: (d) =>
      d.issuer.issuerType === 'midwife' && !isFilled(d.issuer.midwife.midwifeName),
    message: "Midwife: midwife's name is missing."
  },
  {
    id: 'MATB1-MW-002',
    category: 'completeness',
    priority: 'high',
    description:
      'Midwife: NMC personal identification number (PIN) must be provided.',
    evaluate: (d) =>
      d.issuer.issuerType === 'midwife' && !isFilled(d.issuer.midwife.nmcPin),
    message:
      'Midwife: NMC personal identification number (PIN) is missing. Required by DWP for all midwife-issued MAT B1 forms.'
  },
  {
    id: 'MATB1-MW-003',
    category: 'completeness',
    priority: 'high',
    description: 'Midwife: NMC registration expiry date must be provided.',
    evaluate: (d) =>
      d.issuer.issuerType === 'midwife' && !isFilled(d.issuer.midwife.nmcExpiryDate),
    message: 'Midwife: NMC registration expiry date is missing.'
  },
  {
    id: 'MATB1-MW-004',
    category: 'declaration',
    priority: 'high',
    description: 'Midwife: NMC registration must not have expired on the issue date.',
    evaluate: (d) => {
      if (d.issuer.issuerType !== 'midwife') return false;
      if (!isFilled(d.issuer.midwife.nmcExpiryDate) || !isFilled(d.issuer.issueDate)) {
        return false;
      }
      const expiry = new Date(d.issuer.midwife.nmcExpiryDate);
      const issued = new Date(d.issuer.issueDate);
      if (isNaN(expiry.getTime()) || isNaN(issued.getTime())) return false;
      return expiry.getTime() < issued.getTime();
    },
    message:
      'Midwife: NMC registration expired before the issue date. A MAT B1 cannot be signed by a midwife with lapsed NMC registration.'
  },

  // --- Certificate-level rules -------------------------------------
  {
    id: 'MATB1-DOC-001',
    category: 'completeness',
    priority: 'urgent',
    description: 'Unique certificate number must be recorded.',
    evaluate: (d) => !isFilled(d.issuer.certificateNumber),
    message:
      'Unique certificate number is missing. Every MAT B1 must use an officially supplied form bearing a unique certificate number.'
  },
  {
    id: 'MATB1-DOC-002',
    category: 'completeness',
    priority: 'high',
    description: 'Issue date must be recorded.',
    evaluate: (d) => !isFilled(d.issuer.issueDate),
    message: 'Issue date (the date the certificate is signed) is missing.'
  },
  {
    id: 'MATB1-DOC-003',
    category: 'declaration',
    priority: 'medium',
    description: 'Certificate must be confirmed completed in ink.',
    evaluate: (d) => d.issuer.completedInInk !== 'yes',
    message:
      'Confirmation that the certificate has been completed in ink is missing. DWP guidance requires ink (not pencil).'
  },
  {
    id: 'MATB1-DUP-001',
    category: 'consistency',
    priority: 'medium',
    description:
      'Duplicate marker must be applied when the certificate is a duplicate.',
    evaluate: (d) =>
      d.issuer.isDuplicate === 'yes' && d.issuer.duplicateMarkerApplied !== 'yes',
    message:
      'Duplicate certificate is not marked "DUPLICATE". Replacements for lost or incomplete originals must carry the DUPLICATE marker.'
  }
];

window.MatB1Form.matB1Rules = matB1Rules;
})();
