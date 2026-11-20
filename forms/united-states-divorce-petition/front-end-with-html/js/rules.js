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

/**
 * @typedef {import('./types.js').DivorcePetition} DivorcePetition
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

/**
 * @typedef {Object} StateRule
 * @property {string} name
 * @property {number} residencyMonths        - months one spouse must live in the state before filing
 * @property {number} [residencyMonthsShortened] - shorter period when `marriedOrLivedInState` is yes (New York)
 * @property {number} countyDays             - days of county residency before filing (0 = none)
 * @property {number} waitMonths             - waiting period, whole months
 * @property {number} waitDays               - waiting period, extra days
 * @property {'filing'|'service'|'later'} waitFrom - what the waiting period runs from
 * @property {number} separationDays         - separation needed for a CONTESTED no-fault ground (0 = none)
 * @property {'community'|'equitable'} property
 * @property {boolean} noFaultOnly           - the state has no fault grounds
 * @property {string} cite
 */

/**
 * Verified filing-state rules. Sources are in doc/index.md. A court, clerk or
 * attorney must confirm the rule currently in force for a given county.
 * @type {Record<string, StateRule>}
 */
const STATE_RULES = {
  CA: { name: 'California', residencyMonths: 6, countyDays: 90, waitMonths: 6, waitDays: 1, waitFrom: 'service', separationDays: 0, property: 'community', noFaultOnly: true, cite: 'Cal. Fam. Code 2320 (6 months state, 3 months county), 2339 (6 months and a day from service), 2310 (irreconcilable differences)' },
  NY: { name: 'New York', residencyMonths: 24, residencyMonthsShortened: 12, countyDays: 0, waitMonths: 0, waitDays: 0, waitFrom: 'filing', separationDays: 0, property: 'equitable', noFaultOnly: false, cite: 'N.Y. Dom. Rel. Law 230 (2 years, or 1 year if married or lived as spouses in New York), 170(7) (irretrievable breakdown for six months)' },
  TX: { name: 'Texas', residencyMonths: 6, countyDays: 90, waitMonths: 0, waitDays: 60, waitFrom: 'filing', separationDays: 0, property: 'community', noFaultOnly: false, cite: 'Tex. Fam. Code 6.301 (6 months state, 90 days county), 6.702 (60 days from filing)' },
  FL: { name: 'Florida', residencyMonths: 6, countyDays: 0, waitMonths: 0, waitDays: 20, waitFrom: 'filing', separationDays: 0, property: 'equitable', noFaultOnly: true, cite: 'Fla. Stat. 61.021 (6 months), 61.052 (irretrievably broken), 61.19 (20 days from filing)' },
  IL: { name: 'Illinois', residencyMonths: 3, countyDays: 0, waitMonths: 0, waitDays: 0, waitFrom: 'filing', separationDays: 180, property: 'equitable', noFaultOnly: true, cite: '750 ILCS 5/401 (90 days residence; six months separate and apart gives an irrebuttable presumption, waivable by agreement)' },
  PA: { name: 'Pennsylvania', residencyMonths: 6, countyDays: 0, waitMonths: 0, waitDays: 90, waitFrom: 'service', separationDays: 365, property: 'equitable', noFaultOnly: false, cite: '23 Pa.C.S. 3104(b) (6 months), 3301(c) (mutual consent, 90 days after service), 3301(d) (one year separate)' },
  OH: { name: 'Ohio', residencyMonths: 6, countyDays: 90, waitMonths: 0, waitDays: 0, waitFrom: 'filing', separationDays: 365, property: 'equitable', noFaultOnly: false, cite: 'Ohio R.C. 3105.62 (6 months state), Civ.R. 3(C) (90 days county), 3105.01(J) (one year separate)' },
  WA: { name: 'Washington', residencyMonths: 0, countyDays: 0, waitMonths: 0, waitDays: 90, waitFrom: 'later', separationDays: 0, property: 'community', noFaultOnly: true, cite: 'RCW 26.09.030 (90 days from the later of filing or service; no minimum residency), irretrievably broken' },
  AZ: { name: 'Arizona', residencyMonths: 3, countyDays: 0, waitMonths: 0, waitDays: 60, waitFrom: 'service', separationDays: 0, property: 'community', noFaultOnly: true, cite: 'A.R.S. 25-312 (90 days domicile), 25-329 (60 days after service)' },
  NV: { name: 'Nevada', residencyMonths: 1.5, countyDays: 0, waitMonths: 0, waitDays: 0, waitFrom: 'filing', separationDays: 0, property: 'community', noFaultOnly: true, cite: 'NRS 125.020 (6 weeks residence), 125.010 (incompatibility)' }
};

/** Fallback rule for a state absent from the table (UMDA 90-day domicile). */
const DEFAULT_RULE = {
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
function ruleFor(state) {
  const code = String(state || '').trim().toUpperCase();
  if (Object.prototype.hasOwnProperty.call(STATE_RULES, code)) {
    return { rule: STATE_RULES[code], known: true };
  }
  return { rule: DEFAULT_RULE, known: false };
}

// ─── Date helpers (UTC, ISO yyyy-mm-dd; no wall clock is ever read) ─────

/** @param {string|null} iso @returns {number|null} UTC midnight ms */
function parseIso(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.parse(iso + 'T00:00:00Z');
  return Number.isNaN(t) ? null : t;
}

/** @param {number} ms @returns {string} */
function toIso(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Add whole days to an ISO date. @returns {string|null} */
function addDays(iso, days) {
  const t = parseIso(iso);
  return t === null ? null : toIso(t + days * 86400000);
}

/** Add whole calendar months to an ISO date (clamped to month end). @returns {string|null} */
function addMonths(iso, months) {
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
function daysBetween(a, b) {
  const ta = parseIso(a);
  const tb = parseIso(b);
  return ta === null || tb === null ? null : Math.round((tb - ta) / 86400000);
}

// ─── Predicates ─────────────────────────────────────────────────────────

/** Months of state residency required before filing. @param {DivorcePetition} d */
function requiredResidencyMonths(d) {
  const { rule } = ruleFor(d.filing.state);
  if (rule.residencyMonthsShortened !== undefined && d.spouses.marriedOrLivedInState === 'yes') {
    return rule.residencyMonthsShortened;
  }
  return rule.residencyMonths;
}

/** State residency answered and below the requirement. @param {DivorcePetition} d */
function stateResidencyShort(d) {
  const months = d.spouses.petitionerResidencyMonths;
  return isNum(months) && months < requiredResidencyMonths(d);
}

/** County residency answered and below the requirement. @param {DivorcePetition} d */
function countyResidencyShort(d) {
  const { rule } = ruleFor(d.filing.state);
  const days = d.spouses.countyResidencyDays;
  return rule.countyDays > 0 && isNum(days) && days < rule.countyDays;
}

/**
 * The separation period applies to a CONTESTED no-fault ground in states that
 * require one; an uncontested (agreed) case waives it.
 * @param {DivorcePetition} d
 */
function separationApplies(d) {
  const { rule } = ruleFor(d.filing.state);
  return rule.separationDays > 0 && d.filing.groundType === 'no-fault' && d.filing.caseType === 'contested';
}

/** Separation shorter than required, measured separation date to filing date. @param {DivorcePetition} d */
function separationShort(d) {
  if (!separationApplies(d)) return false;
  const days = daysBetween(d.spouses.separationDate, d.filing.filingDate);
  const { rule } = ruleFor(d.filing.state);
  return days !== null && days < rule.separationDays;
}

/** A fault ground pleaded in a state that has only no-fault divorce. @param {DivorcePetition} d */
function faultGroundNotAvailable(d) {
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
function earliestDecreeDate(d) {
  const { rule } = ruleFor(d.filing.state);
  const filed = parseIso(d.filing.filingDate) === null ? null : d.filing.filingDate;
  const served = parseIso(d.service.serviceDate) === null ? null : d.service.serviceDate;
  let base = null;
  if (rule.waitFrom === 'filing') base = filed;
  else if (rule.waitFrom === 'service') base = served;
  else if (filed !== null && served !== null) base = parseIso(filed) >= parseIso(served) ? filed : served;
  if (base === null || (!rule.waitMonths && !rule.waitDays)) return null;
  const afterMonths = rule.waitMonths ? addMonths(base, rule.waitMonths) : base;
  return rule.waitDays ? addDays(afterMonths, rule.waitDays) : afterMonths;
}

/** A decree entered before the waiting period ended. @param {DivorcePetition} d */
function decreeBeforeWaitingPeriod(d) {
  if (d.decree.decreeEntered !== 'yes') return false;
  const earliest = earliestDecreeDate(d);
  const t = parseIso(d.decree.decreeDate);
  return earliest !== null && t !== null && t < parseIso(earliest);
}

/** Core fields still missing (human labels). @param {DivorcePetition} d */
function missingCore(d) {
  const miss = [];
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
function childrenIncomplete(d) {
  if (d.children.hasMinorChildren !== 'yes') return { plan: false, worksheet: false };
  return {
    plan: d.children.custodyPlanDocumented !== 'yes',
    worksheet: d.children.childSupportWorksheetCompleted !== 'yes'
  };
}

/** UCCJEA home-state test: children lived in the state under six months. @param {DivorcePetition} d */
function homeStateShort(d) {
  return d.children.hasMinorChildren === 'yes' &&
    isNum(d.children.childrenHomeStateMonths) && d.children.childrenHomeStateMonths < 6;
}

/** Uncontested, but no signed marital settlement agreement. @param {DivorcePetition} d */
function uncontestedWithoutAgreement(d) {
  return d.filing.caseType === 'uncontested' && d.property.settlementAgreementSigned !== 'yes';
}

/** Service is complete: a method other than none, and a date. @param {DivorcePetition} d */
function serviceComplete(d) {
  const m = d.service.serviceMethod;
  return nonEmpty(m) && m !== 'none' && d.service.serviceDate !== null && d.service.serviceDate !== '';
}

/** A decree is recorded as entered but service never completed. @param {DivorcePetition} d */
function decreeWithoutService(d) {
  return d.decree.decreeEntered === 'yes' && !serviceComplete(d) && d.service.respondentResponded !== 'yes';
}

/** Name restoration requested without a name. @param {DivorcePetition} d */
function nameRestorationIncomplete(d) {
  return d.decree.nameRestorationRequested === 'yes' && !nonEmpty(d.decree.nameToRestore);
}

/** Property approach pleaded differs from the state's regime. @param {DivorcePetition} d */
function propertyApproachMismatch(d) {
  const { rule, known } = ruleFor(d.filing.state);
  return known && nonEmpty(d.property.propertyDivisionApproach) && d.property.propertyDivisionApproach !== rule.property;
}

/** Respondent is military and has not appeared (SCRA affidavit needed). @param {DivorcePetition} d */
function militaryWithoutAppearance(d) {
  return d.spouses.respondentMilitary === 'yes' && d.service.respondentResponded !== 'yes';
}

export { STATE_RULES, DEFAULT_RULE, ruleFor, nonEmpty, isNum, parseIso, addDays, addMonths, daysBetween, requiredResidencyMonths, stateResidencyShort, countyResidencyShort, separationApplies, separationShort, faultGroundNotAvailable, earliestDecreeDate, decreeBeforeWaitingPeriod, missingCore, childrenIncomplete, homeStateShort, uncontestedWithoutAgreement, serviceComplete, decreeWithoutService, nameRestorationIncomplete, propertyApproachMismatch, militaryWithoutAppearance };
