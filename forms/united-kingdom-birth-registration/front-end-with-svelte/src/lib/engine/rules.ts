// Declarative United Kingdom Birth Registration completeness and validity rules.
//
// This form is an ADMINISTRATIVE completeness-and-validity instrument for
// registering a birth in England and Wales (GOV.UK "Register a birth") and
// ordering the birth certificate (General Register Office). It is not a scored
// assessment. This module holds the primitive predicates the grader
// (`grader.ts`) and the flag detector (`flagged-issues.ts`) compose (spec §4):
//
//   - the out-of-scope test (stillbirth, or a birth outside England and Wales),
//   - the required-items list,
//   - the 42-day period and the 12-month limit,
//   - the qualified-informant rule,
//   - the second-parent (paternity) route and evidence rules,
//   - the identity-evidence rule.
//
// Nothing in this file decides whether a birth may be registered: that is the
// registrar's statutory decision. It only encodes what GOV.UK asks an applicant
// to have ready so the grader can classify the application.

import type { BirthRegistration } from './types';

export interface MissingItem {
  id: string;
  dimension: string;
  label: string;
}

const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim() !== '';

/** The statutory period, in days, in which a birth must be registered. */
const STATUTORY_DAYS = 42;

/** Days after which GOV.UK deadline warnings begin (a week before the limit). */
const WARNING_DAYS = 35;

/** Days (365) after which registration needs the Registrar General's authority. */
const LATE_LIMIT_DAYS = 365;

/** Countries whose registers this service covers. */
const REGISTRABLE_COUNTRIES: string[] = ['england', 'wales'];

/** Identity documents acceptable singly (a real document, not 'none'). */
const PRIMARY_DOCUMENTS: string[] = [
  'passport',
  'uk-photocard-driving-licence',
  'eu-photocard-driving-licence',
  'uk-birth-or-adoption-certificate',
  'biometric-immigration-document',
  'uk-travel-document',
  'refugee-or-stateless-travel-document',
  'eu-identity-card',
  'proof-of-age-card'
];

/** The bases that need a signed form or court document in hand. */
const DOCUMENT_BASES: string[] = [
  'statutory-declaration',
  'court-order-parental-responsibility',
  'parental-order'
];

/** Valid second-parent bases for each relationship of the parents. */
const VALID_BASES: Record<string, string[]> = {
  'married-or-civil-partners': ['married-or-civil-partners'],
  'female-couple-married': ['married-or-civil-partners'],
  unmarried: ['joint-registration', 'statutory-declaration', 'court-order-parental-responsibility'],
  'female-couple-unmarried': [
    'joint-registration',
    'statutory-declaration',
    'court-order-parental-responsibility'
  ],
  'male-couple': ['parental-order'],
  'mother-only': []
};

/** Parents' relationships that carry a marriage or civil-partnership date. */
const MARRIED_RELATIONSHIPS: string[] = ['married-or-civil-partners', 'female-couple-married'];

/** Informants who may register only when the parents cannot. */
const NON_PARENT_INFORMANTS: string[] = [
  'person-present-at-birth',
  'person-responsible-for-child',
  'hospital-administrator'
];

const MS_PER_DAY = 86400000;

/** Parse an ISO date (YYYY-MM-DD) to a UTC timestamp, or null. */
function parseDate(s: string | null | undefined): number | null {
  if (!nonEmpty(s)) return null;
  const t = Date.parse(`${s.trim()}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
}

/**
 * Whole days from the date of birth to the registration date; null when either
 * date is missing or unparseable.
 */
function daysSinceBirth(d: BirthRegistration): number | null {
  const born = parseDate(d.child.dateOfBirth);
  const reg = parseDate(d.informant.registrationDate);
  if (born === null || reg === null) return null;
  return Math.round((reg - born) / MS_PER_DAY);
}

/** True when registration falls after the 42-day period. */
function lateRegistration(d: BirthRegistration): boolean {
  const days = daysSinceBirth(d);
  return days !== null && days > STATUTORY_DAYS;
}

/** True when registration falls more than 12 months after the birth. */
function overTwelveMonths(d: BirthRegistration): boolean {
  const days = daysSinceBirth(d);
  return days !== null && days > LATE_LIMIT_DAYS;
}

/** True when the deadline is near but not yet passed (35 to 42 days). */
function deadlineApproaching(d: BirthRegistration): boolean {
  const days = daysSinceBirth(d);
  return days !== null && days >= WARNING_DAYS && days <= STATUTORY_DAYS;
}

/**
 * Why the application is out of scope, or '' when it is in scope. A stillbirth
 * and a birth outside England and Wales are registered under different rules.
 */
function outOfScopeReason(d: BirthRegistration): '' | 'stillbirth' | 'other-country' {
  if (d.child.stillbirth === 'yes') return 'stillbirth';
  const c = d.child.birthCountry;
  if (nonEmpty(c) && !REGISTRABLE_COUNTRIES.includes(c)) return 'other-country';
  return '';
}

/** Whether a second parent is to be recorded. */
function secondParentIncluded(d: BirthRegistration): boolean {
  return d.parentage.secondParentIncluded === 'yes';
}

/**
 * The required items still missing, as `{ id, dimension, label }`. Conditional
 * items (the second parent, a non-parent informant, a certificate order) are
 * required only when they apply.
 */
function missingItems(d: BirthRegistration): MissingItem[] {
  const out: MissingItem[] = [];
  const need = (ok: boolean, id: string, dimension: string, label: string) => {
    if (!ok) out.push({ id, dimension, label });
  };
  const { child, mother, parentage: p, informant: i, certificate: c } = d;

  need(nonEmpty(child.childForenames), 'child-forenames', 'child', "Child's forename(s)");
  need(nonEmpty(child.childSurname), 'child-surname', 'child', "Child's surname");
  need(nonEmpty(child.sex), 'child-sex', 'child', "Child's sex");
  need(nonEmpty(child.dateOfBirth), 'child-date-of-birth', 'child', 'Date of birth');
  need(nonEmpty(child.placeOfBirthType), 'place-of-birth-type', 'child', 'Type of place of birth');
  need(nonEmpty(child.placeOfBirth), 'place-of-birth', 'child', 'Place of birth');
  need(nonEmpty(child.birthCountry), 'birth-country', 'child', 'Country of birth');
  need(nonEmpty(child.stillbirth), 'stillbirth', 'child', 'Whether the child was born alive');

  need(nonEmpty(mother.motherName), 'mother-name', 'mother', "Mother's full name");
  need(
    nonEmpty(mother.motherMaidenSurname),
    'mother-maiden-surname',
    'mother',
    "Mother's maiden surname"
  );
  need(
    nonEmpty(mother.motherDateOfBirth),
    'mother-date-of-birth',
    'mother',
    "Mother's date of birth"
  );
  need(
    nonEmpty(mother.motherPlaceOfBirth),
    'mother-place-of-birth',
    'mother',
    "Mother's place of birth"
  );
  need(nonEmpty(mother.motherAddress), 'mother-address', 'mother', "Mother's address");

  need(
    nonEmpty(p.parentsRelationship),
    'parents-relationship',
    'parentage',
    "Parents' relationship"
  );
  need(
    nonEmpty(p.secondParentIncluded),
    'second-parent-included',
    'parentage',
    'Whether a second parent is recorded'
  );
  if (MARRIED_RELATIONSHIPS.includes(p.parentsRelationship)) {
    need(
      nonEmpty(p.marriageDate),
      'marriage-date',
      'parentage',
      'Date of marriage or civil partnership'
    );
  }
  if (secondParentIncluded(d)) {
    need(
      nonEmpty(p.secondParentName),
      'second-parent-name',
      'parentage',
      "Second parent's full name"
    );
    need(
      nonEmpty(p.secondParentDateOfBirth),
      'second-parent-date-of-birth',
      'parentage',
      "Second parent's date of birth"
    );
    need(
      nonEmpty(p.secondParentPlaceOfBirth),
      'second-parent-place-of-birth',
      'parentage',
      "Second parent's place of birth"
    );
    need(
      nonEmpty(p.paternityBasis),
      'paternity-basis',
      'parentage',
      'Basis for recording the second parent'
    );
  }

  need(
    nonEmpty(i.informantRelationship),
    'informant-relationship',
    'informant',
    "Informant's relationship to the child"
  );
  need(nonEmpty(i.informantName), 'informant-name', 'informant', "Informant's full name");
  if (
    NON_PARENT_INFORMANTS.includes(i.informantRelationship) ||
    i.informantRelationship === 'other'
  ) {
    need(
      nonEmpty(i.parentsUnableToRegister),
      'parents-unable-to-register',
      'informant',
      'Whether the parents are unable to register'
    );
  }
  need(
    nonEmpty(i.registrationRoute),
    'registration-route',
    'informant',
    'Where the birth will be registered'
  );
  need(nonEmpty(i.registrationDate), 'registration-date', 'informant', 'Registration date');

  need(
    c.certificatesRequested !== null && c.certificatesRequested !== undefined,
    'certificates-requested',
    'certificate',
    'Number of certificates (0 if none)'
  );
  if (c.certificatesRequested !== null && c.certificatesRequested > 0) {
    need(nonEmpty(c.serviceLevel), 'service-level', 'certificate', 'Certificate service level');
    need(
      nonEmpty(c.deliveryAddress),
      'delivery-address',
      'certificate',
      'Certificate delivery address'
    );
    need(
      nonEmpty(c.paymentConfirmed),
      'payment-confirmed',
      'certificate',
      'Whether payment is confirmed'
    );
  }
  return out;
}

/**
 * Date inconsistencies: registration before the birth, or a mother born on or
 * after the child.
 */
function dateInconsistencies(d: BirthRegistration): string[] {
  const out: string[] = [];
  const born = parseDate(d.child.dateOfBirth);
  const reg = parseDate(d.informant.registrationDate);
  const mum = parseDate(d.mother.motherDateOfBirth);
  if (born !== null && reg !== null && reg < born) out.push('registration-before-birth');
  if (born !== null && mum !== null && mum >= born) out.push('mother-born-after-child');
  return out;
}

/**
 * Why the informant is not a qualified informant, or '' when qualified (or not
 * yet answered).
 */
function informantProblem(
  d: BirthRegistration
): '' | 'not-qualified' | 'parents-able-to-register' | 'second-parent-not-recorded' {
  const rel = d.informant.informantRelationship;
  if (!nonEmpty(rel)) return '';
  if (rel === 'other') return 'not-qualified';
  if (NON_PARENT_INFORMANTS.includes(rel)) {
    return d.informant.parentsUnableToRegister === 'yes' ? '' : 'parents-able-to-register';
  }
  if (['father', 'second-parent', 'both-parents'].includes(rel) && !secondParentIncluded(d)) {
    return 'second-parent-not-recorded';
  }
  return '';
}

/**
 * Why the stated basis cannot record the second parent, or ''. Applies only
 * when a second parent is included and a basis has been chosen.
 */
function paternityRouteProblem(
  d: BirthRegistration
): '' | 'basis-not-valid' | 'joint-needs-both' | 'clinic-treatment-needed' | 'mother-only' {
  const p = d.parentage;
  if (!secondParentIncluded(d)) return '';
  if (p.parentsRelationship === 'mother-only') return 'mother-only';
  if (!nonEmpty(p.paternityBasis) || !nonEmpty(p.parentsRelationship)) return '';
  const valid = VALID_BASES[p.parentsRelationship] || [];
  if (!valid.includes(p.paternityBasis)) return 'basis-not-valid';
  if (
    p.paternityBasis === 'joint-registration' &&
    d.informant.informantRelationship !== 'both-parents'
  ) {
    return 'joint-needs-both';
  }
  if (p.parentsRelationship === 'female-couple-unmarried' && p.licensedClinicTreatment !== 'yes') {
    return 'clinic-treatment-needed';
  }
  return '';
}

/** True when the basis needs a document that is not yet in hand. */
function paternityEvidenceMissing(d: BirthRegistration): boolean {
  const p = d.parentage;
  return (
    secondParentIncluded(d) &&
    DOCUMENT_BASES.includes(p.paternityBasis) &&
    p.paternityEvidenceHeld !== 'yes'
  );
}

/** True when the mother is recorded alone although the parents are unmarried and no second parent is included. */
function unmarriedFatherLeftOff(d: BirthRegistration): boolean {
  return (
    d.parentage.parentsRelationship === 'unmarried' && d.parentage.secondParentIncluded === 'no'
  );
}

/** True when neither one primary document nor two secondary documents are held. */
function identityInsufficient(d: BirthRegistration): boolean {
  const i = d.informant;
  if (PRIMARY_DOCUMENTS.includes(i.identityPrimaryDocument)) return false;
  return !(typeof i.identitySecondaryCount === 'number' && i.identitySecondaryCount >= 2);
}

/** True when the identity documents are stated not to be originals. */
function identityNotOriginal(d: BirthRegistration): boolean {
  return d.informant.identityOriginals === 'no';
}

/** All evidence gaps that move an otherwise complete application to needs-additional-evidence. */
function evidenceGaps(d: BirthRegistration): string[] {
  const gaps: string[] = [];
  if (informantProblem(d)) gaps.push('informant');
  if (paternityRouteProblem(d)) gaps.push('paternity-route');
  if (paternityEvidenceMissing(d)) gaps.push('paternity-evidence');
  if (identityInsufficient(d)) gaps.push('identity');
  if (identityNotOriginal(d)) gaps.push('identity-originals');
  if (overTwelveMonths(d)) gaps.push('over-twelve-months');
  return gaps;
}

export {
  STATUTORY_DAYS,
  WARNING_DAYS,
  LATE_LIMIT_DAYS,
  REGISTRABLE_COUNTRIES,
  PRIMARY_DOCUMENTS,
  DOCUMENT_BASES,
  VALID_BASES,
  nonEmpty,
  daysSinceBirth,
  lateRegistration,
  overTwelveMonths,
  deadlineApproaching,
  outOfScopeReason,
  secondParentIncluded,
  missingItems,
  dateInconsistencies,
  informantProblem,
  paternityRouteProblem,
  paternityEvidenceMissing,
  unmarriedFatherLeftOff,
  identityInsufficient,
  identityNotOriginal,
  evidenceGaps
};
