// Declarative US birth certificate application rules.
//
// This form is a DOCUMENTATION-SUPPORT and ELIGIBILITY / COMPLETENESS
// instrument, not legal advice. There is no federal birth certificate: each of
// the 50 states, the District of Columbia and the territories issues its own
// (CDC/NCHS "Where to Write for Vital Records"). Access to certified copies is
// therefore state law, built on the Model State Vital Statistics Act
// (restricted to persons with a "direct and tangible interest"). This module
// holds:
//
//   - STATE_RULES: the verified rule values for eight states,
//   - DEFAULT_RULE: the conservative uniform fallback for every other state,
//   - the primitive predicates the grader (`grader.js`) and the flag detector
//     (`flags.js`) compose.
//
// Nothing here decides that a request will be accepted; the issuing vital
// records office decides. Sources are cited in `doc/index.md` and `spec/index.md`.

import type { BirthCertificateApplication, Relationship } from './types';

/** Per-state rule values (see the HTML engine's rules.js for field meanings). */
export interface StateRule {
  name: string;
  agency: string;
  access: 'restricted' | 'open';
  eligible: Relationship[];
  eligibleIfDeceased: Relationship[];
  minSelfAge: number;
  feeUsd: number | null;
  extraCopyUsd: number | null;
  feeVerified: boolean;
  mailNotary: boolean;
  informationalAvailable: boolean;
}

export const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim() !== '';

/**
 * Per-state rule values.
 *   access            'restricted' | 'open'
 *   eligible          relationships that may order a certified copy
 *   eligibleIfDeceased extra relationships allowed when the registrant is deceased
 *   minSelfAge        minimum age at which the registrant may order their own
 *   feeUsd / extraCopyUsd   state fee for the first copy / each additional copy
 *   feeVerified       false when sources disagreed or the figure is a county/CDC listing
 *   mailNotary        a mail request needs a notarized sworn statement of identity
 *   informationalAvailable  a non-certified informational copy is open to anyone
 */
export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    agency: 'California Department of Public Health, Vital Records',
    access: 'restricted',
    eligible: [
      'self',
      'parent',
      'legal-guardian',
      'legal-representative',
      'spouse',
      'child',
      'sibling',
      'grandparent',
      'grandchild',
      'government-agency'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 18,
    feeUsd: 31,
    extraCopyUsd: 31,
    feeVerified: true,
    mailNotary: true,
    informationalAvailable: true
  },
  NY: {
    name: 'New York (outside New York City)',
    agency: 'New York State Department of Health, Vital Records',
    access: 'restricted',
    eligible: [
      'self',
      'parent',
      'spouse',
      'child',
      'legal-guardian',
      'legal-representative',
      'government-agency'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 18,
    feeUsd: 30,
    extraCopyUsd: 30,
    feeVerified: true,
    mailNotary: false,
    informationalAvailable: false
  },
  TX: {
    name: 'Texas',
    agency: 'Texas Department of State Health Services, Vital Statistics',
    access: 'restricted',
    eligible: [
      'self',
      'parent',
      'spouse',
      'child',
      'sibling',
      'grandparent',
      'grandchild',
      'legal-guardian',
      'legal-representative'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 18,
    feeUsd: 22,
    extraCopyUsd: 3,
    feeVerified: true,
    mailNotary: false,
    informationalAvailable: false
  },
  FL: {
    name: 'Florida',
    agency: 'Florida Department of Health, Bureau of Vital Statistics',
    access: 'restricted',
    eligible: ['self', 'parent', 'legal-guardian', 'legal-representative'],
    eligibleIfDeceased: ['spouse', 'child', 'grandchild', 'sibling'],
    minSelfAge: 18,
    feeUsd: 15,
    extraCopyUsd: 10,
    feeVerified: false,
    mailNotary: false,
    informationalAvailable: false
  },
  IL: {
    name: 'Illinois',
    agency: 'Illinois Department of Public Health, Division of Vital Records',
    access: 'restricted',
    eligible: ['self', 'parent', 'legal-guardian', 'legal-representative', 'government-agency'],
    eligibleIfDeceased: [],
    minSelfAge: 18,
    feeUsd: 15,
    extraCopyUsd: 2,
    feeVerified: false,
    mailNotary: false,
    informationalAvailable: false
  },
  PA: {
    name: 'Pennsylvania',
    agency: 'Pennsylvania Department of Health, Division of Vital Records',
    access: 'restricted',
    eligible: [
      'self',
      'spouse',
      'parent',
      'sibling',
      'child',
      'legal-guardian',
      'legal-representative'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 16,
    feeUsd: 20,
    extraCopyUsd: 20,
    feeVerified: true,
    mailNotary: false,
    informationalAvailable: false
  },
  OH: {
    name: 'Ohio',
    agency: 'Ohio Department of Health, Office of Vital Statistics',
    access: 'open',
    eligible: [
      'self',
      'parent',
      'legal-guardian',
      'legal-representative',
      'spouse',
      'child',
      'sibling',
      'grandparent',
      'grandchild',
      'government-agency',
      'other'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 0,
    feeUsd: 21.5,
    extraCopyUsd: 21.5,
    feeVerified: false,
    mailNotary: false,
    informationalAvailable: false
  },
  WA: {
    name: 'Washington',
    agency: 'Washington State Department of Health, Center for Health Statistics',
    access: 'restricted',
    eligible: [
      'self',
      'parent',
      'spouse',
      'child',
      'sibling',
      'grandparent',
      'grandchild',
      'legal-guardian',
      'legal-representative',
      'government-agency'
    ],
    eligibleIfDeceased: [],
    minSelfAge: 18,
    feeUsd: 25,
    extraCopyUsd: 25,
    feeVerified: true,
    mailNotary: false,
    informationalAvailable: true
  }
};

/** Conservative uniform fallback (Model State Vital Statistics Act "tangible interest"). */
export const DEFAULT_RULE: StateRule = {
  name: 'Other state or territory',
  agency: 'the state or territory vital records office',
  access: 'restricted',
  eligible: [
    'self',
    'parent',
    'legal-guardian',
    'legal-representative',
    'spouse',
    'child',
    'government-agency'
  ],
  eligibleIfDeceased: [],
  minSelfAge: 18,
  feeUsd: null,
  extraCopyUsd: null,
  feeVerified: false,
  mailNotary: false,
  informationalAvailable: false
};

/** Purposes that need a certified copy rather than an informational one. */
const IDENTITY_PURPOSES: string[] = [
  'passport',
  'real-id',
  'school',
  'employment',
  'benefits',
  'foreign-use'
];
/** Purposes for which a short-form abstract is not accepted. */
const LONG_FORM_PURPOSES: string[] = ['passport', 'foreign-use'];

export function stateCode(d: BirthCertificateApplication): string {
  return String(d.registrant.state || '')
    .trim()
    .toUpperCase();
}

/** True when `state` has a verified row in STATE_RULES. */
export function hasStateRule(d: BirthCertificateApplication) {
  return Object.prototype.hasOwnProperty.call(STATE_RULES, stateCode(d));
}

/** The rule in force for the application's state (the default for unknown states). */
export function ruleFor(d: BirthCertificateApplication) {
  return hasStateRule(d) ? STATE_RULES[stateCode(d)] : DEFAULT_RULE;
}

/** True for a validly-shaped two-letter state code. */
export function validStateShape(d: BirthCertificateApplication) {
  return /^[A-Z]{2}$/.test(stateCode(d));
}

/** Whole years between an ISO date and the (possibly frozen) current date. */
export function ageInYears(iso: string | null, now: Date = new Date()): number | null {
  if (!nonEmpty(iso)) return null;
  const b = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(b.getTime())) return null;
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

/** True when an informational copy is requested in a state that offers one. */
export function informationalExempt(d: BirthCertificateApplication) {
  return d.order.certificateType === 'informational' && ruleFor(d).informationalAvailable;
}

/** True when the requester's stated relationship permits a certified copy here. */
export function relationshipEligible(d: BirthCertificateApplication) {
  const rel = d.purpose.relationship;
  const rule = ruleFor(d);
  if (rule.access === 'open') return true;
  if (rule.eligible.includes(rel)) return true;
  return d.registrant.deceased === 'yes' && rule.eligibleIfDeceased.includes(rel);
}

/** Self-requester younger than the state's minimum age. */
export function underageSelf(d: BirthCertificateApplication, now: Date = new Date()) {
  if (d.purpose.relationship !== 'self' || informationalExempt(d)) return false;
  const min = ruleFor(d).minSelfAge;
  const age = ageInYears(d.applicant.dateOfBirth, now);
  if (age === null) return false;
  return age < min;
}

/** The requester may not obtain a certified copy under the applicable rule. */
export function ineligibleRequester(d: BirthCertificateApplication, now: Date = new Date()) {
  if (!nonEmpty(d.purpose.relationship) || informationalExempt(d)) return false;
  return !relationshipEligible(d) || underageSelf(d, now);
}

/** Registrant or applicant identifiers needed to locate the record are missing or invalid. */
export function missingRegistrantData(d: BirthCertificateApplication, now: Date = new Date()) {
  const r = d.registrant;
  const dobAge = ageInYears(r.dateOfBirth, now);
  return (
    !nonEmpty(r.registrantName) ||
    !nonEmpty(r.dateOfBirth) ||
    dobAge === null ||
    dobAge < 0 ||
    !nonEmpty(r.placeOfBirth) ||
    !validStateShape(d) ||
    !nonEmpty(r.motherNameBeforeFirstMarriage) ||
    !nonEmpty(d.applicant.applicantName) ||
    !nonEmpty(d.purpose.relationship) ||
    !nonEmpty(d.purpose.purpose) ||
    !nonEmpty(d.order.certificateType) ||
    d.order.copies === null ||
    d.order.copies < 1 ||
    !nonEmpty(d.order.deliveryMethod)
  );
}

/** Photo identification is required for certified copies and is absent or expired. */
export function missingId(d: BirthCertificateApplication) {
  if (informationalExempt(d)) return false;
  const e = d.evidence;
  return !nonEmpty(e.idType) || e.idType === 'none' || e.idUnexpired !== 'yes';
}

/** The requester is not the registrant, a parent, or an agency, and sent no proof of relationship. */
export function missingProof(d: BirthCertificateApplication) {
  if (informationalExempt(d) || !nonEmpty(d.purpose.relationship)) return false;
  const rel = d.purpose.relationship;
  const needs =
    ['spouse', 'child', 'sibling', 'grandparent', 'grandchild', 'other'].indexOf(rel) !== -1 ||
    (d.registrant.deceased === 'yes' && rel !== 'government-agency');
  return needs && d.evidence.proofOfRelationship !== 'yes';
}

/** Guardian, representative, or agency request without the authorizing document. */
export function missingAuthority(d: BirthCertificateApplication) {
  if (informationalExempt(d)) return false;
  const rel = d.purpose.relationship;
  return (
    (rel === 'legal-guardian' || rel === 'legal-representative' || rel === 'government-agency') &&
    d.evidence.authorityDocument !== 'yes'
  );
}

/** Mail request in a state that demands a notarized sworn statement, without one. */
export function missingNotarization(d: BirthCertificateApplication) {
  return (
    d.order.deliveryMethod === 'mail' &&
    ruleFor(d).mailNotary &&
    !informationalExempt(d) &&
    d.evidence.notarizedSwornStatement !== 'yes'
  );
}

/** The chosen copy type cannot serve the stated purpose. */
export function certificateTypeUnacceptable(d: BirthCertificateApplication) {
  const t = d.order.certificateType;
  const p = d.purpose.purpose;
  if (!nonEmpty(t)) return false;
  if (t === 'informational' && IDENTITY_PURPOSES.indexOf(p) !== -1) return true;
  if (d.purpose.needsApostille === 'yes' && t !== 'certified-long-form') return true;
  if (t === 'certified-short-form' && LONG_FORM_PURPOSES.indexOf(p) !== -1) return true;
  return false;
}

/** The expected total fee under the applied rule; null when the fee is unknown. */
export function expectedFee(d: BirthCertificateApplication) {
  const rule = ruleFor(d);
  if (
    rule.feeUsd === null ||
    rule.extraCopyUsd === null ||
    d.order.copies === null ||
    d.order.copies < 1
  )
    return null;
  return Math.round((rule.feeUsd + (d.order.copies - 1) * rule.extraCopyUsd) * 100) / 100;
}

/** Fee enclosed is missing or below the expected total (online orders pay at checkout). */
export function feeShortfall(d: BirthCertificateApplication) {
  const fee = expectedFee(d);
  if (fee === null || d.order.deliveryMethod === 'online') return false;
  return d.order.feeEnclosedUsd === null || d.order.feeEnclosedUsd < fee;
}

/** Apostille wanted but no destination country named. */
export function missingApostilleCountry(d: BirthCertificateApplication) {
  return d.purpose.needsApostille === 'yes' && !nonEmpty(d.purpose.apostilleCountry);
}

/** The declaration under penalty of perjury is unsigned. */
export function missingDeclaration(d: BirthCertificateApplication) {
  return d.declaration.declarationSigned !== 'yes';
}

/** Any blocking gap that makes the request incomplete. */
export function anyGap(d: BirthCertificateApplication, now: Date = new Date()) {
  return (
    missingRegistrantData(d, now) ||
    missingId(d) ||
    missingProof(d) ||
    missingAuthority(d) ||
    missingNotarization(d) ||
    certificateTypeUnacceptable(d) ||
    feeShortfall(d) ||
    missingApostilleCountry(d) ||
    missingDeclaration(d)
  );
}
