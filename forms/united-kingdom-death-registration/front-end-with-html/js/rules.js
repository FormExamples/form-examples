// Declarative death-registration completeness rules (England and Wales).
//
// This form is a COMPLETENESS and VALIDITY instrument, not a scored clinical
// assessment. This module holds the primitive predicates the grader
// (`grader.js`) and the flag detector (`flags.js`) compose (spec section 4):
//
//   - the qualified-informant list (section 16, Births and Deaths Registration
//     Act 1953),
//   - the coroner-pending and coroner-cleared predicates,
//   - the 5-day registration-clock arithmetic,
//   - the blocking rules whose firing makes a registration incomplete.
//
// Nothing here is legal advice; the registrar's own checks remain definitive.

/**
 * @typedef {import('./types.js').Registration} Registration
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/** Days allowed between medical-examiner confirmation and registration. */
const DEADLINE_DAYS = 5;

/** Informant categories that qualify under section 16 of the 1953 Act. */
const QUALIFIED_RELATIONSHIPS = [
  'relative-present-at-death',
  'relative-in-attendance',
  'relative-in-district',
  'person-present-at-death',
  'occupier-of-premises',
  'person-arranging-funeral'
];

/** @param {Registration} d */
function informantQualified(d) {
  return QUALIFIED_RELATIONSHIPS.indexOf(d.informant.informantRelationship) !== -1;
}

/** @param {Registration} d */
function coronerReferred(d) {
  return d.coroner.referredToCoroner === 'yes';
}

/** The coroner has released the death for registration (certificate in hand). */
function coronerCleared(d) {
  return coronerReferred(d) && d.coroner.coronerCertificateReceived === 'yes';
}

/** A coroner referral is open: registration waits for the coroner's certificate. */
function coronerPending(d) {
  return coronerReferred(d) && d.coroner.coronerCertificateReceived !== 'yes';
}

/** True when the string is a plausible ISO date (YYYY-MM-DD). */
function isIsoDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));
}

/**
 * Whole days from `from` to `to` (ISO dates); null when either is unusable.
 * @param {string | null} from
 * @param {string | null} to
 * @returns {number | null}
 */
function daysBetween(from, to) {
  if (!isIsoDate(from) || !isIsoDate(to)) return null;
  return Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);
}

/** The medical-examiner confirmation date, or null. @param {Registration} d */
function confirmationDate(d) {
  return isIsoDate(d.medical.medicalExaminerConfirmationDate) ? d.medical.medicalExaminerConfirmationDate : null;
}

/** @param {Registration} d */
function isRegistered(d) {
  return isIsoDate(d.registration.registrationDate);
}

/**
 * Days elapsed on the 5-day clock: confirmation to registration when
 * registered, else confirmation to the assessment date. Null without both ends.
 * @param {Registration} d
 * @returns {number | null}
 */
function daysSinceConfirmation(d) {
  const start = confirmationDate(d);
  if (start === null) return null;
  return daysBetween(start, isRegistered(d) ? d.registration.registrationDate : d.registration.asOfDate);
}

/**
 * Deadline status (spec section 4).
 * @param {Registration} d
 * @returns {import('./types.js').DeadlineStatus}
 */
function deadlineStatus(d) {
  const days = daysSinceConfirmation(d);
  if (isRegistered(d)) {
    return days !== null && days > DEADLINE_DAYS ? 'registered-late' : 'registered';
  }
  if (coronerPending(d)) return 'paused-coroner';
  if (days === null) return 'not-started';
  if (days > DEADLINE_DAYS) return 'overdue';
  if (days >= DEADLINE_DAYS - 1) return 'due-soon';
  return 'on-track';
}

/**
 * The blocking rules that fire for this registration. Any one makes the
 * registration `incomplete` (unless a coroner referral is pending, which takes
 * precedence). Rows mirror `united_kingdom_death_registration_grade_rule`.
 * @param {Registration} d
 * @returns {{ ruleId: string, dimension: string, category: string, description: string }[]}
 */
function blockingRules(d) {
  const rules = [];
  const add = (ruleId, dimension, category, description) =>
    rules.push({ ruleId, dimension, category, description });

  if (!nonEmpty(d.deceased.deceasedName) || !isIsoDate(d.deceased.dateOfDeath)) {
    add('R-DECEASED-001', 'deceased', 'identity', 'The name of the deceased and the date of death are required.');
  }
  if (d.deceased.deathJurisdiction !== 'england-wales') {
    add('R-JURISDICTION-001', 'deceased', 'jurisdiction', 'The death must have occurred in England or Wales; other jurisdictions register elsewhere.');
  }
  if (d.coroner.referredToCoroner === '') {
    add('R-CORONER-001', 'coroner', 'coroner-answer', 'Whether the death was reported to a coroner has not been answered.');
  }
  if (!coronerReferred(d) || coronerCleared(d)) {
    if (!coronerCleared(d)) {
      if (d.medical.mccdReceived !== 'yes') {
        add('R-MEDICAL-001', 'medical', 'mccd', 'The medical certificate of cause of death has not been received.');
      }
      if (d.medical.medicalExaminerStatus !== 'confirmed' || confirmationDate(d) === null) {
        add('R-MEDICAL-002', 'medical', 'medical-examiner', 'The medical examiner has not confirmed that the death can be registered.');
      }
    }
  }
  if (!nonEmpty(d.informant.informantName)) {
    add('R-INFORMANT-001', 'informant', 'informant-details', 'The name of the person registering the death is required.');
  }
  if (!informantQualified(d)) {
    add('R-INFORMANT-002', 'informant', 'qualified-informant', 'The informant is not a qualified informant under section 16 of the Births and Deaths Registration Act 1953.');
  }
  return rules;
}

export {
  nonEmpty, DEADLINE_DAYS, QUALIFIED_RELATIONSHIPS, informantQualified, coronerReferred, coronerCleared,
  coronerPending, isIsoDate, daysBetween, confirmationDate, isRegistered, daysSinceConfirmation,
  deadlineStatus, blockingRules
};
