import type { DivorcePetition } from './types';

// Declarative United States divorce-petition readiness rules.
//
// This form is a DOCUMENTATION-SUPPORT and READINESS-CLASSIFICATION instrument,
// not legal advice and not a scored assessment. Divorce is governed by state
// law, so this module holds:
//
//   - STATE_RULES: a small table of verified filing-state rules (residency,
//     county residency, waiting period and what it runs from, separation
//     period for contested no-fault grounds, property regime, whether only
//     no-fault grounds exist);
//   - DEFAULT_RULE: the fallback for any state not in the table, modelled on
//     the common 90-day domicile of the Uniform Marriage and Divorce Act
//     (UMDA section 302, as adopted in Arizona and Colorado); a state not in
//     the table always raises a "verify state rule" flag;
//   - the primitive predicates the grader (`grader.js`) and flag detector
//     (`flags.js`) compose (spec section 4).
//
// Nothing here decides that a petition may be filed or that a decree may be
// entered. The issuing court decides.

export const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim() !== '';
export const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

export interface StateRule {
  name: string;
  residencyMonths: number;
  residencyMonthsShortened?: number;
  countyDays: number;
  waitMonths: number;
  waitDays: number;
  waitFrom: 'filing' | 'service' | 'later';
  separationDays: number;
  property: 'community' | 'equitable' | '';
  noFaultOnly: boolean;
  cite: string;
}

/**
 * Verified filing-state rules. Sources are in doc/index.md. A court, clerk or
 * attorney must confirm the rule currently in force for a given county.
 * @type {Record<string, StateRule>}
 */
export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    residencyMonths: 6,
    countyDays: 90,
    waitMonths: 6,
    waitDays: 1,
    waitFrom: 'service',
    separationDays: 0,
    property: 'community',
    noFaultOnly: true,
    cite: 'Cal. Fam. Code 2320 (6 months state, 3 months county), 2339 (6 months and a day from service), 2310 (irreconcilable differences)'
  },
  NY: {
    name: 'New York',
    residencyMonths: 24,
    residencyMonthsShortened: 12,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 0,
    waitFrom: 'filing',
    separationDays: 0,
    property: 'equitable',
    noFaultOnly: false,
    cite: 'N.Y. Dom. Rel. Law 230 (2 years, or 1 year if married or lived as spouses in New York), 170(7) (irretrievable breakdown for six months)'
  },
  TX: {
    name: 'Texas',
    residencyMonths: 6,
    countyDays: 90,
    waitMonths: 0,
    waitDays: 60,
    waitFrom: 'filing',
    separationDays: 0,
    property: 'community',
    noFaultOnly: false,
    cite: 'Tex. Fam. Code 6.301 (6 months state, 90 days county), 6.702 (60 days from filing)'
  },
  FL: {
    name: 'Florida',
    residencyMonths: 6,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 20,
    waitFrom: 'filing',
    separationDays: 0,
    property: 'equitable',
    noFaultOnly: true,
    cite: 'Fla. Stat. 61.021 (6 months), 61.052 (irretrievably broken), 61.19 (20 days from filing)'
  },
  IL: {
    name: 'Illinois',
    residencyMonths: 3,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 0,
    waitFrom: 'filing',
    separationDays: 180,
    property: 'equitable',
    noFaultOnly: true,
    cite: '750 ILCS 5/401 (90 days residence; six months separate and apart gives an irrebuttable presumption, waivable by agreement)'
  },
  PA: {
    name: 'Pennsylvania',
    residencyMonths: 6,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 90,
    waitFrom: 'service',
    separationDays: 365,
    property: 'equitable',
    noFaultOnly: false,
    cite: '23 Pa.C.S. 3104(b) (6 months), 3301(c) (mutual consent, 90 days after service), 3301(d) (one year separate)'
  },
  OH: {
    name: 'Ohio',
    residencyMonths: 6,
    countyDays: 90,
    waitMonths: 0,
    waitDays: 0,
    waitFrom: 'filing',
    separationDays: 365,
    property: 'equitable',
    noFaultOnly: false,
    cite: 'Ohio R.C. 3105.62 (6 months state), Civ.R. 3(C) (90 days county), 3105.01(J) (one year separate)'
  },
  WA: {
    name: 'Washington',
    residencyMonths: 0,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 90,
    waitFrom: 'later',
    separationDays: 0,
    property: 'community',
    noFaultOnly: true,
    cite: 'RCW 26.09.030 (90 days from the later of filing or service; no minimum residency), irretrievably broken'
  },
  AZ: {
    name: 'Arizona',
    residencyMonths: 3,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 60,
    waitFrom: 'service',
    separationDays: 0,
    property: 'community',
    noFaultOnly: true,
    cite: 'A.R.S. 25-312 (90 days domicile), 25-329 (60 days after service)'
  },
  NV: {
    name: 'Nevada',
    residencyMonths: 1.5,
    countyDays: 0,
    waitMonths: 0,
    waitDays: 0,
    waitFrom: 'filing',
    separationDays: 0,
    property: 'community',
    noFaultOnly: true,
    cite: 'NRS 125.020 (6 weeks residence), 125.010 (incompatibility)'
  }
};

/** Fallback rule for a state absent from the table (UMDA 90-day domicile). */
export const DEFAULT_RULE: StateRule = {
  name: 'Default (verify the state rule)',
  residencyMonths: 3,
  countyDays: 0,
  waitMonths: 0,
  waitDays: 0,
  waitFrom: 'filing',
  separationDays: 0,
  property: '',
  noFaultOnly: false,
  cite: 'Uniform Marriage and Divorce Act section 302 (90-day domicile); the state statute governs'
};

/**
 * Look up the filing state's rule.
 * @param {string} state two-letter USPS code
 * @returns {{ rule: StateRule, known: boolean }}
 */
export function ruleFor(state: string): { rule: StateRule; known: boolean } {
  const code = String(state || '')
    .trim()
    .toUpperCase();
  if (Object.prototype.hasOwnProperty.call(STATE_RULES, code)) {
    return { rule: STATE_RULES[code], known: true };
  }
  return { rule: DEFAULT_RULE, known: false };
}

// ─── Date helpers (UTC, ISO yyyy-mm-dd; no wall clock is ever read) ─────

/** @param {string|null} iso @returns {number|null} UTC midnight ms */
export function parseIso(iso: string | null): number | null {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.parse(iso + 'T00:00:00Z');
  return Number.isNaN(t) ? null : t;
}

/** @param {number} ms @returns {string} */
function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Add whole days to an ISO date. @returns {string|null} */
export function addDays(iso: string | null, days: number): string | null {
  const t = parseIso(iso);
  return t === null ? null : toIso(t + days * 86400000);
}

/** Add whole calendar months to an ISO date (clamped to month end). @returns {string|null} */
export function addMonths(iso: string | null, months: number): string | null {
  const t = parseIso(iso);
  if (t === null) return null;
  const d = new Date(t);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return toIso(d.getTime());
}

/** Whole days from a to b (b - a); null if either is unset. */
export function daysBetween(a: string | null, b: string | null): number | null {
  const ta = parseIso(a);
  const tb = parseIso(b);
  return ta === null || tb === null ? null : Math.round((tb - ta) / 86400000);
}

// ─── Predicates ─────────────────────────────────────────────────────────

/** Months of state residency required before filing. @param {DivorcePetition} d */
export function requiredResidencyMonths(d: DivorcePetition) {
  const { rule } = ruleFor(d.filing.state);
  if (rule.residencyMonthsShortened !== undefined && d.spouses.marriedOrLivedInState === 'yes') {
    return rule.residencyMonthsShortened;
  }
  return rule.residencyMonths;
}

/** State residency answered and below the requirement. @param {DivorcePetition} d */
export function stateResidencyShort(d: DivorcePetition) {
  const months = d.spouses.petitionerResidencyMonths;
  return isNum(months) && months < requiredResidencyMonths(d);
}

/** County residency answered and below the requirement. @param {DivorcePetition} d */
export function countyResidencyShort(d: DivorcePetition) {
  const { rule } = ruleFor(d.filing.state);
  const days = d.spouses.countyResidencyDays;
  return rule.countyDays > 0 && isNum(days) && days < rule.countyDays;
}

/**
 * The separation period applies to a CONTESTED no-fault ground in states that
 * require one; an uncontested (agreed) case waives it.
 * @param {DivorcePetition} d
 */
export function separationApplies(d: DivorcePetition) {
  const { rule } = ruleFor(d.filing.state);
  return (
    rule.separationDays > 0 &&
    d.filing.groundType === 'no-fault' &&
    d.filing.caseType === 'contested'
  );
}

/** Separation shorter than required, measured separation date to filing date. @param {DivorcePetition} d */
export function separationShort(d: DivorcePetition) {
  if (!separationApplies(d)) return false;
  const days = daysBetween(d.spouses.separationDate, d.filing.filingDate);
  const { rule } = ruleFor(d.filing.state);
  return days !== null && days < rule.separationDays;
}

/** A fault ground pleaded in a state that has only no-fault divorce. @param {DivorcePetition} d */
export function faultGroundNotAvailable(d: DivorcePetition) {
  const { rule, known } = ruleFor(d.filing.state);
  return known && rule.noFaultOnly && d.filing.groundType === 'fault';
}

/**
 * Earliest date a decree may be entered: the waiting period counted from the
 * filing date, the service date, or the later of the two. With no waiting
 * period the date is the base date itself. Null when the base date is unset.
 * @param {DivorcePetition} d
 * @returns {string|null}
 */
export function earliestDecreeDate(d: DivorcePetition) {
  const { rule } = ruleFor(d.filing.state);
  const filed = parseIso(d.filing.filingDate) === null ? null : d.filing.filingDate;
  const served = parseIso(d.service.serviceDate) === null ? null : d.service.serviceDate;
  let base: string | null = null;
  if (rule.waitFrom === 'filing') base = filed;
  else if (rule.waitFrom === 'service') base = served;
  else if (filed !== null && served !== null)
    base = (parseIso(filed) as number) >= (parseIso(served) as number) ? filed : served;
  if (base === null || (!rule.waitMonths && !rule.waitDays)) return null;
  const afterMonths = rule.waitMonths ? addMonths(base, rule.waitMonths) : base;
  return rule.waitDays ? addDays(afterMonths, rule.waitDays) : afterMonths;
}

/** A decree entered before the waiting period ended. @param {DivorcePetition} d */
export function decreeBeforeWaitingPeriod(d: DivorcePetition) {
  if (d.decree.decreeEntered !== 'yes') return false;
  const earliest = earliestDecreeDate(d);
  const t = parseIso(d.decree.decreeDate);
  return earliest !== null && t !== null && t < (parseIso(earliest) as number);
}

/** Core fields still missing (human labels). @param {DivorcePetition} d */
export function missingCore(d: DivorcePetition): string[] {
  const miss: string[] = [];
  if (!nonEmpty(d.filing.state)) miss.push('filing state');
  if (!nonEmpty(d.filing.county)) miss.push('county');
  if (!d.filing.filingDate) miss.push('filing date');
  if (!nonEmpty(d.filing.caseType)) miss.push('uncontested or contested');
  if (!nonEmpty(d.filing.groundType)) miss.push('ground type');
  if (d.filing.groundType === 'fault' && !nonEmpty(d.filing.faultGround)) miss.push('fault ground');
  if (!nonEmpty(d.spouses.petitionerName)) miss.push('petitioner name');
  if (!nonEmpty(d.spouses.respondentName)) miss.push('respondent name');
  if (!d.spouses.marriageDate) miss.push('marriage date');
  if (!isNum(d.spouses.petitionerResidencyMonths)) miss.push('petitioner residency');
  if (!nonEmpty(d.children.hasMinorChildren)) miss.push('minor children answer');
  if (separationApplies(d) && !d.spouses.separationDate) miss.push('separation date');
  return miss;
}

/** Minor children but no custody plan or support worksheet. @param {DivorcePetition} d */
export function childrenIncomplete(d: DivorcePetition): { plan: boolean; worksheet: boolean } {
  if (d.children.hasMinorChildren !== 'yes') return { plan: false, worksheet: false };
  return {
    plan: d.children.custodyPlanDocumented !== 'yes',
    worksheet: d.children.childSupportWorksheetCompleted !== 'yes'
  };
}

/** UCCJEA home-state test: children lived in the state under six months. @param {DivorcePetition} d */
export function homeStateShort(d: DivorcePetition) {
  return (
    d.children.hasMinorChildren === 'yes' &&
    isNum(d.children.childrenHomeStateMonths) &&
    d.children.childrenHomeStateMonths < 6
  );
}

/** Uncontested, but no signed marital settlement agreement. @param {DivorcePetition} d */
export function uncontestedWithoutAgreement(d: DivorcePetition) {
  return d.filing.caseType === 'uncontested' && d.property.settlementAgreementSigned !== 'yes';
}

/** Service is complete: a method other than none, and a date. @param {DivorcePetition} d */
export function serviceComplete(d: DivorcePetition) {
  const m = d.service.serviceMethod;
  return (
    nonEmpty(m) && m !== 'none' && d.service.serviceDate !== null && d.service.serviceDate !== ''
  );
}

/** A decree is recorded as entered but service never completed. @param {DivorcePetition} d */
export function decreeWithoutService(d: DivorcePetition) {
  return (
    d.decree.decreeEntered === 'yes' &&
    !serviceComplete(d) &&
    d.service.respondentResponded !== 'yes'
  );
}

/** Name restoration requested without a name. @param {DivorcePetition} d */
export function nameRestorationIncomplete(d: DivorcePetition) {
  return d.decree.nameRestorationRequested === 'yes' && !nonEmpty(d.decree.nameToRestore);
}

/** Property approach pleaded differs from the state's regime. @param {DivorcePetition} d */
export function propertyApproachMismatch(d: DivorcePetition) {
  const { rule, known } = ruleFor(d.filing.state);
  return (
    known &&
    nonEmpty(d.property.propertyDivisionApproach) &&
    d.property.propertyDivisionApproach !== rule.property
  );
}

/** Respondent is military and has not appeared (SCRA affidavit needed). @param {DivorcePetition} d */
export function militaryWithoutAppearance(d: DivorcePetition) {
  return d.spouses.respondentMilitary === 'yes' && d.service.respondentResponded !== 'yes';
}
