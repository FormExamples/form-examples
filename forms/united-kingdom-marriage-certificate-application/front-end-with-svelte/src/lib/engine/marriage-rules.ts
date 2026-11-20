// Declarative United Kingdom marriage certificate application rules.
//
// This form is a COMPLETENESS and VALIDITY instrument, not a scored assessment.
// It checks that an application to give notice of marriage or civil
// partnership in England and Wales, and to order marriage certificate copies
// from the General Register Office (GRO), is eligible, complete and supported
// by the evidence a register office asks to see. This module holds the
// primitive predicates the grader (`grader.js`) and the flag detector
// (`flags.js`) compose (spec §4):
//
//   - minimum age 18 on the ceremony date (no one under 18 may marry or form
//     a civil partnership in England and Wales since 27 February 2023),
//   - a party who is already married or in a civil partnership,
//   - prohibited degrees of relationship,
//   - 7 days' residence in the registration district,
//   - the notice period (ceremony at least 29 days after notice, within 12
//     months of it),
//   - evidence that a previous marriage or civil partnership has ended,
//   - immigration evidence, and joint notice where a party is from outside
//     the UK and Ireland (and not an EU Settlement Scheme holder),
//   - two witnesses, identity, proof of address and a confirmed venue.
//
// Sources: GOV.UK "Marriages and civil partnerships" (give notice, legal
// requirements, documents you'll need to give notice, plan your ceremony) and
// the GOV.UK "Order a copy of a birth, death, marriage or civil partnership
// certificate" service. Nothing here gives legal advice; the register office
// decides each notice.

import type { Application, Party } from './types';

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

/** Minimum age to marry or form a civil partnership in England and Wales. */
export const MINIMUM_AGE = 18;
/** Nights a party must have lived in the registration district. */
export const MINIMUM_RESIDENCE_DAYS = 7;
/** Days from giving notice to the earliest ceremony date. */
export const NOTICE_PERIOD_DAYS = 29;
/** Months a notice stays valid for a ceremony. */
export const NOTICE_VALID_MONTHS = 12;
/** Witnesses required at every ceremony. */
export const MINIMUM_WITNESSES = 2;

const PRIOR_END_STATUSES: string[] = [
  'divorced',
  'widowed',
  'dissolved-civil-partnership',
  'annulled'
];

// ─── Date helpers (ISO yyyy-mm-dd, UTC arithmetic, no clock) ─────────

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse an ISO date to a UTC millisecond value, or null. */
export function parseIso(iso: unknown): number | null {
  if (typeof iso !== 'string') return null;
  const m = ISO.exec(iso);
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(t) ? null : t;
}

export function formatIso(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

/** Add whole days to an ISO date; null when the input is not a date. */
export function addDays(iso: unknown, days: number): string | null {
  const t = parseIso(iso);
  return t === null ? null : formatIso(t + days * 86400000);
}

/** Add whole months to an ISO date, clamping to the month end; null when invalid. */
export function addMonths(iso: unknown, months: number): string | null {
  const t = parseIso(iso);
  if (t === null) return null;
  const d = new Date(t);
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return formatIso(target.getTime());
}

/** Whole years between a date of birth and a reference date; null when either is unset. */
export function ageOn(dobIso: unknown, refIso: unknown): number | null {
  const b = parseIso(dobIso);
  const r = parseIso(refIso);
  if (b === null || r === null) return null;
  const bd = new Date(b);
  const rd = new Date(r);
  let age = rd.getUTCFullYear() - bd.getUTCFullYear();
  const beforeBirthday =
    rd.getUTCMonth() < bd.getUTCMonth() ||
    (rd.getUTCMonth() === bd.getUTCMonth() && rd.getUTCDate() < bd.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/** The date a party's age is judged on: the ceremony date, else the notice date. */
export function referenceDate(a: Application): string | null {
  return a.ceremony.ceremonyDate || a.notice.noticeDate || null;
}

export function parties(a: Application): { key: string; label: string; party: Party }[] {
  return [
    { key: 'partyOne', label: 'First party', party: a.partyOne },
    { key: 'partyTwo', label: 'Second party', party: a.partyTwo }
  ];
}

// ─── Eligibility ─────────────────────────────────────────────────────

export function partyUnder18(p: Party, a: Application): boolean {
  const age = ageOn(p.dateOfBirth, referenceDate(a));
  return age !== null && age < MINIMUM_AGE;
}

export function partyAlreadyMarried(p: Party): boolean {
  return p.maritalStatus === 'currently-married-or-civil-partnered';
}

export function closelyRelated(a: Application): boolean {
  return a.relationship.closelyRelated === 'yes';
}

// ─── Evidence ────────────────────────────────────────────────────────

/** A previous marriage or civil partnership has ended and must be evidenced. */
export function needsPriorEvidence(p: Party): boolean {
  return PRIOR_END_STATUSES.includes(p.maritalStatus);
}

export function priorEvidenceMissing(p: Party): boolean {
  return needsPriorEvidence(p) && p.priorEndEvidenceProvided !== 'yes';
}

/** Immigration status must be shown unless the party is British or Irish. */
export function needsImmigrationEvidence(p: Party): boolean {
  return p.nationalityStatus === 'other' || p.nationalityStatus === 'eu-settlement-scheme';
}

export function immigrationEvidenceMissing(p: Party): boolean {
  return needsImmigrationEvidence(p) && p.immigrationEvidenceProvided !== 'yes';
}

/** A party from outside the UK and Ireland (and not on the EU Settlement Scheme). */
export function fromOutsideUkIreland(p: Party): boolean {
  return p.nationalityStatus === 'other';
}

/** Both parties must give notice together at a designated register office. */
export function jointNoticeRequired(a: Application): boolean {
  return parties(a).some((x) => fromOutsideUkIreland(x.party));
}

/** An immigration referral to the Home Office is indicated. */
export function immigrationReferralIndicated(a: Application): boolean {
  return parties(a).some((x) => immigrationEvidenceMissing(x.party));
}

export function residenceShort(p: Party): boolean {
  return (
    typeof p.daysResidentInDistrict === 'number' &&
    p.daysResidentInDistrict < MINIMUM_RESIDENCE_DAYS
  );
}

// ─── Timing ──────────────────────────────────────────────────────────

/** Earliest permitted ceremony date, or null without a notice date. */
export function earliestCeremonyDate(a: Application): string | null {
  return addDays(a.notice.noticeDate, NOTICE_PERIOD_DAYS);
}

/** Last day the notice remains valid for a ceremony, or null without a notice date. */
export function latestCeremonyDate(a: Application): string | null {
  return addMonths(a.notice.noticeDate, NOTICE_VALID_MONTHS);
}

export function noticePeriodTooShort(a: Application): boolean {
  const e = earliestCeremonyDate(a);
  const c = a.ceremony.ceremonyDate;
  return e !== null && c !== null && c < e;
}

export function ceremonyAfterNoticeExpiry(a: Application): boolean {
  const l = latestCeremonyDate(a);
  const c = a.ceremony.ceremonyDate;
  return l !== null && c !== null && c > l;
}

export function witnessesInsufficient(a: Application): boolean {
  const n = a.ceremony.witnessCount;
  return typeof n === 'number' && n < MINIMUM_WITNESSES;
}

// ─── Completeness ────────────────────────────────────────────────────

/**
 * Required fields still unanswered, as human labels. These stop the
 * application being assessed as ready; they are not themselves an
 * eligibility finding.
 */
export function missingRequired(a: Application): string[] {
  const out: string[] = [];
  const need = (ok: boolean, label: string): void => {
    if (!ok) out.push(label);
  };
  need(nonEmpty(a.notice.noticeType), 'Marriage or civil partnership');
  need(nonEmpty(a.notice.noticeDate), 'Date notice is given');
  need(nonEmpty(a.notice.registrationDistrict), 'Registration district');
  need(nonEmpty(a.ceremony.ceremonyType), 'Type of ceremony');
  need(nonEmpty(a.ceremony.ceremonyDate), 'Ceremony date');
  need(nonEmpty(a.ceremony.venueName), 'Ceremony venue');
  need(typeof a.ceremony.witnessCount === 'number', 'Number of witnesses');
  for (const { label, party } of parties(a)) {
    need(nonEmpty(party.name), `${label}: name`);
    need(nonEmpty(party.dateOfBirth), `${label}: date of birth`);
    need(
      typeof party.daysResidentInDistrict === 'number',
      `${label}: days resident in the district`
    );
    need(nonEmpty(party.nationalityStatus), `${label}: nationality or immigration route`);
    need(nonEmpty(party.maritalStatus), `${label}: marital status`);
  }
  need(nonEmpty(a.relationship.closelyRelated), 'Whether the parties are closely related');
  return out;
}

/** Certificate order is half-specified: copies requested without a service. */
export function certificateOrderIncomplete(a: Application): boolean {
  const n = a.certificate.certificateCopies;
  return typeof n === 'number' && n >= 1 && !nonEmpty(a.certificate.certificateService);
}

export function certificateCopiesInvalid(a: Application): boolean {
  const n = a.certificate.certificateCopies;
  return typeof n === 'number' && (n < 1 || !Number.isInteger(n));
}
