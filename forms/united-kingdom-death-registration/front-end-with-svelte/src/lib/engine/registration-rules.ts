// Declarative death-registration completeness rules (England and Wales).
//
// A COMPLETENESS and VALIDITY instrument, not a clinical score. These are the
// primitive predicates the grader and the flag detector compose: the
// qualified-informant list (section 16, Births and Deaths Registration Act
// 1953), the coroner predicates, the 5-day clock arithmetic, and the blocking
// rules. Not legal advice; the registrar's own checks remain definitive.

import type { BlockingRule, DeadlineStatus, Registration } from './types';

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

/** Days allowed between medical-examiner confirmation and registration. */
export const DEADLINE_DAYS = 5;

/** Informant categories that qualify under section 16 of the 1953 Act. */
export const QUALIFIED_RELATIONSHIPS: string[] = [
  'relative-present-at-death',
  'relative-in-attendance',
  'relative-in-district',
  'person-present-at-death',
  'occupier-of-premises',
  'person-arranging-funeral'
];

export function informantQualified(d: Registration): boolean {
  return QUALIFIED_RELATIONSHIPS.indexOf(d.informant.informantRelationship) !== -1;
}

export function coronerReferred(d: Registration): boolean {
  return d.coroner.referredToCoroner === 'yes';
}

/** The coroner has released the death for registration (certificate in hand). */
export function coronerCleared(d: Registration): boolean {
  return coronerReferred(d) && d.coroner.coronerCertificateReceived === 'yes';
}

/** A coroner referral is open: registration waits for the coroner's certificate. */
export function coronerPending(d: Registration): boolean {
  return coronerReferred(d) && d.coroner.coronerCertificateReceived !== 'yes';
}

/** True when the string is a plausible ISO date (YYYY-MM-DD). */
export function isIsoDate(s: unknown): s is string {
  return (
    typeof s === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s + 'T00:00:00Z'))
  );
}

/** Whole days from `from` to `to` (ISO dates); null when either is unusable. */
export function daysBetween(from: string | null, to: string | null): number | null {
  if (!isIsoDate(from) || !isIsoDate(to)) return null;
  return Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);
}

/** The medical-examiner confirmation date, or null. */
export function confirmationDate(d: Registration): string | null {
  const c = d.medical.medicalExaminerConfirmationDate;
  return isIsoDate(c) ? c : null;
}

export function isRegistered(d: Registration): boolean {
  return isIsoDate(d.registration.registrationDate);
}

/**
 * Days elapsed on the 5-day clock: confirmation to registration when
 * registered, else confirmation to the assessment date. Null without both ends.
 */
export function daysSinceConfirmation(d: Registration): number | null {
  const start = confirmationDate(d);
  if (start === null) return null;
  return daysBetween(
    start,
    isRegistered(d) ? d.registration.registrationDate : d.registration.asOfDate
  );
}

/** Deadline status (spec section 4). */
export function deadlineStatus(d: Registration): DeadlineStatus {
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
 */
export function blockingRules(d: Registration): BlockingRule[] {
  const rules: BlockingRule[] = [];
  const add = (ruleId: string, dimension: string, category: string, description: string) =>
    rules.push({ ruleId, dimension, category, description });

  if (!nonEmpty(d.deceased.deceasedName) || !isIsoDate(d.deceased.dateOfDeath)) {
    add(
      'R-DECEASED-001',
      'deceased',
      'identity',
      'The name of the deceased and the date of death are required.'
    );
  }
  if (d.deceased.deathJurisdiction !== 'england-wales') {
    add(
      'R-JURISDICTION-001',
      'deceased',
      'jurisdiction',
      'The death must have occurred in England or Wales; other jurisdictions register elsewhere.'
    );
  }
  if (d.coroner.referredToCoroner === '') {
    add(
      'R-CORONER-001',
      'coroner',
      'coroner-answer',
      'Whether the death was reported to a coroner has not been answered.'
    );
  }
  if (!coronerReferred(d)) {
    if (d.medical.mccdReceived !== 'yes') {
      add(
        'R-MEDICAL-001',
        'medical',
        'mccd',
        'The medical certificate of cause of death has not been received.'
      );
    }
    if (d.medical.medicalExaminerStatus !== 'confirmed' || confirmationDate(d) === null) {
      add(
        'R-MEDICAL-002',
        'medical',
        'medical-examiner',
        'The medical examiner has not confirmed that the death can be registered.'
      );
    }
  }
  if (!nonEmpty(d.informant.informantName)) {
    add(
      'R-INFORMANT-001',
      'informant',
      'informant-details',
      'The name of the person registering the death is required.'
    );
  }
  if (!informantQualified(d)) {
    add(
      'R-INFORMANT-002',
      'informant',
      'qualified-informant',
      'The informant is not a qualified informant under section 16 of the Births and Deaths Registration Act 1953.'
    );
  }
  return rules;
}
