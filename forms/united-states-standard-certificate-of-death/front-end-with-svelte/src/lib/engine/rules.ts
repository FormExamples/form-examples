import type { DeathCertificate } from './types.js';

// Declarative US Standard Certificate of Death classification rules.
//
// This form is a DOCUMENTATION-SUPPORT and VALIDITY-CLASSIFICATION instrument,
// not a scored assessment. This module holds the primitive predicates the grader
// (`grader.js`) and the flag detector (`flags.js`) compose (spec section 4):
//
//   - the medical-examiner / coroner referral criteria (REFERRAL_REASONS),
//   - the unacceptable "mechanism of death" list (MECHANISMS) and its normalizer,
//   - the Part I sole-cause and downward-sequence predicates,
//   - the underlying-cause derivation (lowest completed Part I line),
//   - the required-item list for the certifier, funeral director and decedent,
//   - the per-state table of filing deadlines and certified-copy fees (STATE_RULES).
//
// Nothing in this file decides that a death must be referred or that a
// certificate will be registered; it only encodes the NCHS Physicians' Handbook
// on Medical Certification of Death and the state tables so the grader can
// classify the certificate. Documentation support, not legal advice: the
// registering state agency decides.

const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

/** Referral reasons that, when selected, require medical examiner or coroner referral. */
const REFERRAL_REASONS: string[] = [
  'violent-or-unnatural',
  'accident',
  'suicide',
  'homicide',
  'suspicious',
  'poisoning-or-overdose',
  'unattended-by-physician',
  'sudden-unexpected-infant-death',
  'work-related',
  'medical-procedure-related',
  'in-custody',
  'public-health-hazard',
  'unidentified',
  'other'
];

/** Manners of death that are not "natural": these are medical examiner or coroner cases. */
const NON_NATURAL_MANNERS: string[] = [
  'accident',
  'suicide',
  'homicide',
  'pending-investigation',
  'could-not-be-determined'
];

/** Manners that require the injury items (43 to 49). */
const INJURY_MANNERS: string[] = ['accident', 'suicide', 'homicide'];

/**
 * Terms that describe the mechanism of dying rather than a disease or injury.
 * The NCHS Handbook says a mechanism must never stand alone: the etiology
 * (the disease or injury that led to it) must be stated. Stored normalized
 * (lower-case, trimmed, whitespace-collapsed, trailing punctuation removed).
 */
const MECHANISMS: string[] = [
  'cardiac arrest',
  'cardiopulmonary arrest',
  'cardiorespiratory arrest',
  'cardio-respiratory arrest',
  'respiratory arrest',
  'asystole',
  'ventricular fibrillation',
  'ventricular tachycardia',
  'cardiac arrhythmia',
  'cardiac dysrhythmia',
  'arrhythmia',
  'dysrhythmia',
  'respiratory failure',
  'heart failure',
  'congestive heart failure',
  'renal failure',
  'kidney failure',
  'liver failure',
  'hepatic failure',
  'organ failure',
  'multiple organ failure',
  'multi-organ failure',
  'multiorgan failure',
  'shock',
  'coma',
  'brain death',
  'asphyxia',
  'exsanguination',
  'old age',
  'advanced age',
  'senescence',
  'debility',
  'frailty',
  'natural causes',
  'natural cause',
  'sudden death'
];
const MECHANISM_SET = MECHANISMS.reduce<Record<string, boolean>>((set, m) => {
  set[m] = true;
  return set;
}, {});

/**
 * Normalize a free-text condition for mechanism comparison: lower-case, trim,
 * collapse internal whitespace, and strip trailing punctuation.
 */
function normalize(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:]+$/, '')
    .trim();
}

/** The four Part I condition texts, line (a) to (d). @param {DeathCertificate} d */
function partILines(d: DeathCertificate): string[] {
  return [
    d.partI.causeIaCondition,
    d.partI.causeIbCondition,
    d.partI.causeIcCondition,
    d.partI.causeIdCondition
  ];
}

/** Every cause text on the certificate (Part I lines and Part II). @param {DeathCertificate} d */
function allCauseText(d: DeathCertificate) {
  return partILines(d).concat([d.partII.partIiConditions]).filter(nonEmpty).join(' ; ');
}

/** True when the certifier is the medical examiner or coroner. @param {DeathCertificate} d */
function certifierIsMedicalExaminerOrCoroner(d: DeathCertificate) {
  const t = d.certifier.certifierType;
  return t === 'medical-examiner' || t === 'coroner';
}

/** True when manner of death is anything other than natural (and answered). @param {DeathCertificate} d */
function nonNaturalManner(d: DeathCertificate) {
  return NON_NATURAL_MANNERS.indexOf(d.manner.mannerOfDeath) !== -1;
}

/** Trauma, poisoning, or procedure wording in any cause line. @param {DeathCertificate} d */
function traumaInCause(d: DeathCertificate) {
  return /(\btrauma|\binjur|\bfall\b|\bfell\b|\bfractur|\bpoison|\boverdose|\bintoxication|\btoxicity|\bhang|\bstab|\bgunshot|\bshot\b|\bburns?\b|\bdrown|\bsuffocat|\basphyxia|\bpost-?operative|\bsurgical|\bcollision|\bassault|\bblunt force|\bsharp force)/.test(
    allCauseText(d).toLowerCase()
  );
}

/**
 * True when a referral is asserted by the certifier's own entries: the referral
 * answer, or a listed reason. A death already certified by the medical examiner
 * or coroner is not "referred" again.
 */
function explicitReferral(d: DeathCertificate) {
  return (
    !certifierIsMedicalExaminerOrCoroner(d) &&
    (d.referral.referredToMedicalExaminer === 'yes' ||
      REFERRAL_REASONS.indexOf(d.referral.referralReason) !== -1)
  );
}

/**
 * True when a referral criterion is asserted or implied (spec section 4): an
 * explicit referral, a non-natural manner of death, injury wording in the cause
 * lines, or a death not attended by a physician, when a physician (not the
 * medical examiner or coroner) is certifying.
 */
function referralIndicated(d: DeathCertificate) {
  if (certifierIsMedicalExaminerOrCoroner(d)) return false;
  return (
    explicitReferral(d) ||
    nonNaturalManner(d) ||
    traumaInCause(d) ||
    d.certifier.attendedDeceased === 'no'
  );
}

/**
 * The single non-empty Part I condition when EXACTLY one Part I line is present
 * and Part II is empty; otherwise ''. This is the "sole cause" tested against
 * the mechanism list.
 */
function soleCause(d: DeathCertificate) {
  const lines = partILines(d).filter(nonEmpty);
  if (lines.length === 1 && !nonEmpty(d.partII.partIiConditions)) return lines[0];
  return '';
}

/** True when the normalized text is a recognized mechanism of death. @param {string} text */
function isMechanism(text: string): boolean {
  return MECHANISM_SET[normalize(text)] === true;
}

/** True when the only cause given is a recognized mechanism (spec section 4). @param {DeathCertificate} d */
function mechanismAsSoleCause(d: DeathCertificate) {
  const sole = soleCause(d);
  return sole !== '' && isMechanism(sole);
}

/** True when Part I line (a), the required immediate cause, is not recorded. @param {DeathCertificate} d */
function missingPartIa(d: DeathCertificate) {
  return !nonEmpty(d.partI.causeIaCondition);
}

/**
 * True when the Part I lines are not in a plausible downward causal order: a
 * completed line sits below an empty line above it.
 */
function illogicalSequence(d: DeathCertificate) {
  const ia = nonEmpty(d.partI.causeIaCondition);
  const ib = nonEmpty(d.partI.causeIbCondition);
  const ic = nonEmpty(d.partI.causeIcCondition);
  const id = nonEmpty(d.partI.causeIdCondition);
  return (ib && !ia) || (ic && !ib) || (id && !ic);
}

/**
 * The underlying cause: the lowest completed Part I line (d else c else b else a);
 * '' when Part I is empty (spec section 4).
 */
function underlyingCause(d: DeathCertificate) {
  const p = d.partI;
  if (nonEmpty(p.causeIdCondition)) return p.causeIdCondition.trim();
  if (nonEmpty(p.causeIcCondition)) return p.causeIcCondition.trim();
  if (nonEmpty(p.causeIbCondition)) return p.causeIbCondition.trim();
  if (nonEmpty(p.causeIaCondition)) return p.causeIaCondition.trim();
  return '';
}

/**
 * Abbreviations the Handbook says to write out in full. HIV and AIDS are
 * accepted. Matched case-sensitively as whole words.
 */
const ABBREVIATIONS: string[] = [
  'MI',
  'CHF',
  'COPD',
  'CVA',
  'CAD',
  'ASHD',
  'ASCVD',
  'ESRD',
  'CKD',
  'DM',
  'HTN',
  'UTI',
  'DVT',
  'PE',
  'TIA',
  'AF',
  'AFib',
  'CA',
  'ARDS',
  'AKI',
  'MVC',
  'MVA',
  'GSW',
  'ETOH',
  'SAH',
  'ICH',
  'CP',
  'SOB',
  'GI',
  'CNS',
  'RA',
  'MS',
  'PNA',
  'CRF',
  'DKA',
  'OD'
];

/** @param {DeathCertificate} d @returns {string[]} */
function abbreviationsUsed(d: DeathCertificate) {
  const text = allCauseText(d);
  const found: string[] = [];
  ABBREVIATIONS.forEach((a) => {
    const re = new RegExp('(^|[^A-Za-z0-9-])' + a + '(?![A-Za-z0-9-])');
    if (re.test(text) && found.indexOf(a) === -1) found.push(a);
  });
  return found;
}

/** Diabetes named without type 1 / type 2 (or secondary / gestational). @param {DeathCertificate} d */
function unspecifiedDiabetes(d: DeathCertificate) {
  const text = allCauseText(d).toLowerCase();
  return (
    /diabet/.test(text) &&
    !/(type\s*(1|2|i|ii|one|two)\b|type-\s*(1|2)|secondary|gestational|pancreatic|steroid)/.test(
      text
    )
  );
}

/** Cancer named without a histologic type (the primary site is also required). @param {DeathCertificate} d */
function unspecifiedMalignancy(d: DeathCertificate) {
  const text = allCauseText(d).toLowerCase();
  if (!/(cancer|malignan|neoplasm|tumor|metasta)/.test(text)) return false;
  return !/(carcinoma|sarcoma|lymphoma|leukemia|melanoma|glioma|glioblastoma|myeloma|mesothelioma|blastoma|seminoma|adenoma)/.test(
    text
  );
}

// ----------------------------------------------------------------------
// Dates
// ----------------------------------------------------------------------

/** Parse an ISO date (YYYY-MM-DD) to a UTC day number; null when unset or invalid. */
function dayNumber(iso: string | null | undefined): number | null {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  return Number.isNaN(t) ? null : Math.round(t / 86400000);
}

/**
 * Whole days from one ISO date to another (negative when `to` precedes `from`).
 * With `business` true, counts Monday to Friday days only (no holiday calendar).
 * @param {boolean} [business]
 */
function daysBetween(from: string | null, to: string | null, business?: boolean): number | null {
  const a = dayNumber(from);
  const b = dayNumber(to);
  if (a === null || b === null) return null;
  if (!business) return b - a;
  if (b < a) return -(daysBetween(to, from, true) as number);
  let n = 0;
  for (let day = a + 1; day <= b; day++) {
    const dow = (day + 4) % 7; // 1970-01-01 (day 0) was a Thursday (4)
    if (dow !== 0 && dow !== 6) n++;
  }
  return n;
}

/** Age in whole years at the date of death, from DOB; null when either is unset. @param {DeathCertificate} d */
function ageFromDates(d: DeathCertificate): number | null {
  const dob = d.decedent.dateOfBirth;
  const dod = d.death.dateOfDeath;
  if (dayNumber(dob) === null || dayNumber(dod) === null) return null;
  let age = +(dod as string).slice(0, 4) - +(dob as string).slice(0, 4);
  if ((dod as string).slice(5) < (dob as string).slice(5)) age--;
  return age;
}

/** Best-known age: stated age, else computed from the dates. @param {DeathCertificate} d */
function knownAge(d: DeathCertificate): number | null {
  if (typeof d.decedent.ageYears === 'number') return d.decedent.ageYears;
  return ageFromDates(d);
}

/**
 * True when the pregnancy item (36) applies: a female aged 10 to 54 (the NCHS
 * pregnancy-check band). An unknown age for a female counts as applicable.
 */
function pregnancyItemApplies(d: DeathCertificate) {
  if (d.decedent.sex !== 'female') return false;
  const age = knownAge(d);
  return age === null || (age >= 10 && age <= 54);
}

// ----------------------------------------------------------------------
// State rules
// ----------------------------------------------------------------------

/**
 * Per-state filing deadlines and certified-copy fees. `fileDays` is the time
 * allowed to file the death certificate after death; `certifyDays` the time for
 * the medical certifier to complete the cause of death after being notified or
 * after death; `business` makes both count business days. Fees are the state
 * vital-records office price in US dollars for the first certified copy
 * (`copyFee`) and each additional copy ordered at the same time
 * (`additionalCopyFee`, null when the same as the first).
 * `verified` records which values were confirmed against a primary source on
 * 2026-11-20 (see doc/index.md); the others are recorded from the statutes as
 * understood and the engine adds a "verify the state rule" note.
 */
export interface StateRule {
  name: string;
  fileDays: number | null;
  certifyDays: number | null;
  business: boolean;
  copyFee: number | null;
  additionalCopyFee: number | null;
  verified: { fee: boolean; fileDays: boolean; certifyDays: boolean };
}

const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    fileDays: 8,
    certifyDays: 1,
    business: false,
    copyFee: 24,
    additionalCopyFee: null,
    verified: { fee: true, fileDays: false, certifyDays: false }
  },
  NY: {
    name: 'New York',
    fileDays: 3,
    certifyDays: null,
    business: false,
    copyFee: 30,
    additionalCopyFee: null,
    verified: { fee: true, fileDays: true, certifyDays: false }
  },
  TX: {
    name: 'Texas',
    fileDays: 10,
    certifyDays: 5,
    business: false,
    copyFee: 20,
    additionalCopyFee: 3,
    verified: { fee: true, fileDays: false, certifyDays: true }
  },
  FL: {
    name: 'Florida',
    fileDays: 5,
    certifyDays: 3,
    business: false,
    copyFee: 5,
    additionalCopyFee: 4,
    verified: { fee: true, fileDays: true, certifyDays: false }
  },
  IL: {
    name: 'Illinois',
    fileDays: 7,
    certifyDays: 2,
    business: false,
    copyFee: 19,
    additionalCopyFee: 4,
    verified: { fee: true, fileDays: false, certifyDays: false }
  },
  PA: {
    name: 'Pennsylvania',
    fileDays: 4,
    certifyDays: 2,
    business: false,
    copyFee: 20,
    additionalCopyFee: null,
    verified: { fee: true, fileDays: false, certifyDays: false }
  },
  OH: {
    name: 'Ohio',
    fileDays: 3,
    certifyDays: 2,
    business: false,
    copyFee: 21,
    additionalCopyFee: null,
    verified: { fee: true, fileDays: false, certifyDays: true }
  },
  WA: {
    name: 'Washington',
    fileDays: 3,
    certifyDays: 2,
    business: true,
    copyFee: 25,
    additionalCopyFee: null,
    verified: { fee: true, fileDays: false, certifyDays: false }
  }
};

/** The uniform default used when a state is not in STATE_RULES (Model State Vital Statistics Act style). */
const DEFAULT_STATE_RULE: StateRule = {
  name: 'Default (uniform)',
  fileDays: 5,
  certifyDays: 3,
  business: false,
  copyFee: null,
  additionalCopyFee: null,
  verified: { fee: false, fileDays: false, certifyDays: false }
};

/** The STATE_RULES row for the certificate's state, or the default. @param {DeathCertificate} d */
function stateRule(d: DeathCertificate): StateRule {
  const key = String(d.jurisdiction.state || '').toUpperCase();
  return STATE_RULES[key] || DEFAULT_STATE_RULE;
}

/** True when the certificate's state is in STATE_RULES. @param {DeathCertificate} d */
function stateKnown(d: DeathCertificate) {
  return Object.prototype.hasOwnProperty.call(
    STATE_RULES,
    String(d.jurisdiction.state || '').toUpperCase()
  );
}

/**
 * Expected total fee for the requested copies under the state's fee table; null
 * when the fee is unknown or no copies were requested.
 */
function expectedFee(d: DeathCertificate): number | null {
  const rule = stateRule(d);
  const n = d.copies.certifiedCopiesRequested;
  if (rule.copyFee === null || typeof n !== 'number' || n < 1) return null;
  const extra = rule.additionalCopyFee === null ? rule.copyFee : rule.additionalCopyFee;
  return Math.round((rule.copyFee + (n - 1) * extra) * 100) / 100;
}

// ----------------------------------------------------------------------
// Required items
// ----------------------------------------------------------------------

/**
 * The required items still blank, grouped by who completes them. Each entry
 * names the flag category the item belongs to.
 */
function missingRequired(d: DeathCertificate): { category: string; label: string }[] {
  const out: { category: string; label: string }[] = [];
  const need = (ok: boolean, category: string, label: string) => {
    if (!ok) out.push({ category, label });
  };
  need(nonEmpty(d.jurisdiction.state), 'incomplete-decedent', 'State of registration');
  need(nonEmpty(d.decedent.decedentName), 'incomplete-decedent', 'Decedent name');
  need(nonEmpty(d.decedent.sex), 'incomplete-decedent', 'Sex');
  need(nonEmpty(d.decedent.dateOfBirth || ''), 'incomplete-decedent', 'Date of birth');
  need(nonEmpty(d.death.dateOfDeath || ''), 'incomplete-decedent', 'Date of death');
  need(nonEmpty(d.death.placeOfDeathType), 'incomplete-decedent', 'Place of death');
  need(nonEmpty(d.certifier.certifierName), 'incomplete-certifier', 'Certifier name');
  need(nonEmpty(d.certifier.certifierType), 'incomplete-certifier', 'Certifier type');
  need(
    nonEmpty(d.certifier.certifierLicenseNumber),
    'incomplete-certifier',
    'Certifier license number'
  );
  need(nonEmpty(d.certifier.certificationDate || ''), 'incomplete-certifier', 'Date certified');
  need(
    nonEmpty(d.manner.tobaccoUseContributed),
    'tobacco-item',
    'Tobacco use contributed to death'
  );
  need(
    !pregnancyItemApplies(d) || nonEmpty(d.manner.pregnancyStatus),
    'pregnancy-item',
    'Pregnancy status'
  );
  need(
    nonEmpty(d.funeral.funeralDirectorName),
    'incomplete-funeral-director',
    'Funeral director name'
  );
  need(
    nonEmpty(d.funeral.dispositionMethod),
    'incomplete-funeral-director',
    'Method of disposition'
  );
  return out;
}

export {
  nonEmpty,
  normalize,
  partILines,
  allCauseText,
  REFERRAL_REASONS,
  NON_NATURAL_MANNERS,
  INJURY_MANNERS,
  MECHANISMS,
  certifierIsMedicalExaminerOrCoroner,
  nonNaturalManner,
  traumaInCause,
  explicitReferral,
  referralIndicated,
  soleCause,
  isMechanism,
  mechanismAsSoleCause,
  missingPartIa,
  illogicalSequence,
  underlyingCause,
  ABBREVIATIONS,
  abbreviationsUsed,
  unspecifiedDiabetes,
  unspecifiedMalignancy,
  dayNumber,
  daysBetween,
  ageFromDates,
  knownAge,
  pregnancyItemApplies,
  STATE_RULES,
  DEFAULT_STATE_RULE,
  stateRule,
  stateKnown,
  expectedFee,
  missingRequired
};
