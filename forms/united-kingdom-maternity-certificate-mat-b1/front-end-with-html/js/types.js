// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the MAT B1 maternity certificate.
// This file publishes the empty-state factory and shared helpers used across
// the wizard.

/**
 * @typedef {'pre' | 'post' | ''} CertificateType
 * @typedef {'doctor' | 'midwife' | ''} IssuerType
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} RulePriority
 * @typedef {'completeness' | 'consistency' | 'safety' | 'declaration' | 'timing'} RuleCategory
 */

/**
 * @typedef {Object} PatientIdentification
 * @property {string} patientName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 */

/**
 * @typedef {Object} PreConfinementCertificate
 * @property {string} expectedDateOfConfinement
 * @property {string} examinationDate
 */

/**
 * @typedef {Object} PostConfinementCertificate
 * @property {string} actualDateOfBirth
 * @property {string} expectedDateOfConfinement
 */

/**
 * @typedef {Object} DoctorIssuer
 * @property {string} doctorName
 * @property {string} practiceName
 * @property {string} practiceAddress
 * @property {YesNo} stampApplied
 */

/**
 * @typedef {Object} MidwifeIssuer
 * @property {string} midwifeName
 * @property {string} nmcPin
 * @property {string} nmcExpiryDate
 */

/**
 * @typedef {Object} IssuerValidation
 * @property {IssuerType} issuerType
 * @property {DoctorIssuer} doctor
 * @property {MidwifeIssuer} midwife
 * @property {string} certificateNumber
 * @property {string} issueDate
 * @property {YesNo} isDuplicate
 * @property {YesNo} duplicateMarkerApplied
 * @property {YesNo} completedInInk
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientIdentification} patientIdentification
 * @property {CertificateType} certificateType
 * @property {PreConfinementCertificate} preConfinement
 * @property {PostConfinementCertificate} postConfinement
 * @property {IssuerValidation} issuer
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {RuleCategory} category
 * @property {RulePriority} priority
 * @property {string} description
 * @property {string} message
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {RulePriority} priority
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} complete
 * @property {CertificateType} certificateType
 * @property {IssuerType} issuerType
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number | null} weeksBeforeEwc
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. Public symbols attach to a single global namespace,
// `window.MatB1Form`.
(function () {
'use strict';
window.MatB1Form = window.MatB1Form || {};

/** @returns {AssessmentData} */
function emptyAssessment() {
  return {
    patientIdentification: {
      patientName: '',
      dateOfBirth: '',
      nhsNumber: ''
    },
    certificateType: '',
    preConfinement: {
      expectedDateOfConfinement: '',
      examinationDate: ''
    },
    postConfinement: {
      actualDateOfBirth: '',
      expectedDateOfConfinement: ''
    },
    issuer: {
      issuerType: '',
      doctor: {
        doctorName: '',
        practiceName: '',
        practiceAddress: '',
        stampApplied: ''
      },
      midwife: {
        midwifeName: '',
        nmcPin: '',
        nmcExpiryDate: ''
      },
      certificateNumber: '',
      issueDate: '',
      isDuplicate: '',
      duplicateMarkerApplied: '',
      completedInInk: ''
    }
  };
}

/** True if a string is non-empty after trimming. */
function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Number of whole weeks between two YYYY-MM-DD dates (later - earlier).
 * Returns null when either input is missing or unparseable.
 * @param {string} earlier
 * @param {string} later
 * @returns {number | null}
 */
function weeksBetween(earlier, later) {
  if (!earlier || !later) return null;
  const a = new Date(earlier);
  const b = new Date(later);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

/** Numeric ordering for priority sort: urgent < high < medium < low. */
function priorityOrder(priority) {
  switch (priority) {
    case 'urgent': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 99;
  }
}

/** Human-readable label for a priority. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

Object.assign(window.MatB1Form, {
  emptyAssessment,
  isFilled,
  weeksBetween,
  priorityOrder,
  priorityLabel
});
})();
