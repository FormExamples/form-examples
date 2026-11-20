// Declarative United States marriage-license rules.
//
// This form is a DOCUMENTATION and ELIGIBILITY-CLASSIFICATION instrument, not
// legal advice. Marriage law is made state by state; there is no federal
// marriage license. This module holds the primitive predicates the grader
// (`grader.js`) and the flag detector (`flags.js`) compose (spec section 4):
//
//   - the federal and uniform default rule (DEFAULT_RULE),
//   - the per-state table (STATE_RULES), verified against clerk and statute
//     sources listed in `doc/` (waiting period, validity, minimum age, witnesses),
//   - age, prior-marriage, relationship, proxy, waiting-period, validity,
//     witness, and certificate-return predicates.
//
// Federal floor: Obergefell v. Hodges (2015) and the Respect for Marriage Act
// (2022) mean no state may refuse a license because the applicants are the same
// sex; 42 U.S.C. 666(a)(13) is why applications ask for Social Security
// numbers; 8 U.S.C. 1101(a)(35) limits proxy marriage for immigration only.
//
// Nothing in this file decides that a license will issue. The county clerk (or
// a court) decides; rules change, so every state value must be re-verified.

/**
 * @typedef {import('./types.js').MarriageApplication} MarriageApplication
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/**
 * One state's rule. Fields:
 *   name            display name
 *   minAge          age of majority for marriage
 *   minorPath       how a person under minAge may marry: 'none' (barred),
 *                   'court' (court order or emancipation), 'parental' (parental consent)
 *   minorMinAge     lowest age allowed on the minor path (null = no statutory floor)
 *   minorPathEnds   ISO date on which the minor path closes (null = open)
 *   maxGapYears     largest age gap allowed when a minor marries (null = none)
 *   waitingHours    hours between issuance and the ceremony
 *   waitingWaivers  'course' | 'military' | 'nonresident' waivers of the wait
 *   validDays       days a license stays valid from issuance
 *   witnesses       witnesses required at the ceremony (standard license)
 *   confidentialWitnesses witnesses for a confidential license (CA)
 *   bloodTest       whether a premarital blood test is required
 *   proxy           'none' or 'military' (a stationed or deployed service member)
 *   returnWithinDays days the officiant has to return the signed license
 *   typicalFeeUsd   an indicative fee; clerks set fees by county
 */
const STATE_RULES = {
  CA: { name: 'California', minAge: 18, minorPath: 'court', minorMinAge: null, minorPathEnds: '2027-01-01', maxGapYears: null, waitingHours: 0, waitingWaivers: [], validDays: 90, witnesses: 1, confidentialWitnesses: 0, bloodTest: false, proxy: 'military', returnWithinDays: 10, typicalFeeUsd: 91 },
  NY: { name: 'New York', minAge: 18, minorPath: 'none', minorMinAge: null, minorPathEnds: null, maxGapYears: null, waitingHours: 24, waitingWaivers: [], validDays: 60, witnesses: 1, confidentialWitnesses: 1, bloodTest: false, proxy: 'none', returnWithinDays: 5, typicalFeeUsd: 40 },
  TX: { name: 'Texas', minAge: 18, minorPath: 'court', minorMinAge: 16, minorPathEnds: null, maxGapYears: null, waitingHours: 72, waitingWaivers: ['course', 'military'], validDays: 90, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'military', returnWithinDays: 30, typicalFeeUsd: 81 },
  FL: { name: 'Florida', minAge: 18, minorPath: 'parental', minorMinAge: 17, minorPathEnds: null, maxGapYears: 2, waitingHours: 72, waitingWaivers: ['course', 'nonresident'], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 10, typicalFeeUsd: 86 },
  IL: { name: 'Illinois', minAge: 18, minorPath: 'parental', minorMinAge: 16, minorPathEnds: null, maxGapYears: null, waitingHours: 24, waitingWaivers: [], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 10, typicalFeeUsd: 60 },
  PA: { name: 'Pennsylvania', minAge: 18, minorPath: 'none', minorMinAge: null, minorPathEnds: null, maxGapYears: null, waitingHours: 72, waitingWaivers: [], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 10, typicalFeeUsd: 75 },
  OH: { name: 'Ohio', minAge: 18, minorPath: 'court', minorMinAge: 17, minorPathEnds: null, maxGapYears: 4, waitingHours: 0, waitingWaivers: [], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 30, typicalFeeUsd: 60 },
  WA: { name: 'Washington', minAge: 18, minorPath: 'none', minorMinAge: null, minorPathEnds: null, maxGapYears: null, waitingHours: 72, waitingWaivers: [], validDays: 60, witnesses: 2, confidentialWitnesses: 2, bloodTest: false, proxy: 'none', returnWithinDays: 30, typicalFeeUsd: 162 },
  GA: { name: 'Georgia', minAge: 18, minorPath: 'court', minorMinAge: 17, minorPathEnds: null, maxGapYears: null, waitingHours: 0, waitingWaivers: [], validDays: 365, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 30, typicalFeeUsd: 76 },
  VA: { name: 'Virginia', minAge: 18, minorPath: 'none', minorMinAge: null, minorPathEnds: null, maxGapYears: null, waitingHours: 0, waitingWaivers: [], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 30, typicalFeeUsd: 30 }
};

/** The uniform fallback for a state not in the table (flagged "verify state rule"). */
const DEFAULT_RULE = { name: 'Unlisted state', minAge: 18, minorPath: 'none', minorMinAge: null, minorPathEnds: null, maxGapYears: null, waitingHours: 0, waitingWaivers: [], validDays: 60, witnesses: 0, confidentialWitnesses: 0, bloodTest: false, proxy: 'none', returnWithinDays: 10, typicalFeeUsd: 0 };

/** @param {string} state @returns {boolean} */
function stateRuleKnown(state) {
  return Object.prototype.hasOwnProperty.call(STATE_RULES, String(state || '').toUpperCase());
}

/** The rule for the application's state (the uniform default when unknown). @param {MarriageApplication} d */
function ruleFor(d) {
  const code = String(d.jurisdiction.state || '').toUpperCase();
  return stateRuleKnown(code) ? STATE_RULES[code] : DEFAULT_RULE;
}

// ---------------------------------------------------------------- dates

const DAY_MS = 86400000;

/** Parse an ISO date (YYYY-MM-DD) to UTC milliseconds; null when absent or invalid. @param {string | null} iso */
function parseDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.parse(iso + 'T00:00:00Z');
  return Number.isNaN(t) ? null : t;
}

/** Whole days from a to b (b minus a); null if either is not a date. */
function daysBetween(a, b) {
  const x = parseDate(a);
  const y = parseDate(b);
  return x === null || y === null ? null : Math.round((y - x) / DAY_MS);
}

/** ISO date `days` after the ISO date; null if the date is not valid. */
function addDays(iso, days) {
  const t = parseDate(iso);
  return t === null ? null : new Date(t + days * DAY_MS).toISOString().slice(0, 10);
}

/** Today's ISO date (UTC); the persona runner freezes the clock. */
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Completed years between dob and onDate; null when either is missing. */
function ageOn(dob, onDate) {
  const b = parseDate(dob);
  const o = parseDate(onDate);
  if (b === null || o === null) return null;
  const bd = new Date(b);
  const od = new Date(o);
  let age = od.getUTCFullYear() - bd.getUTCFullYear();
  if (od.getUTCMonth() < bd.getUTCMonth() || (od.getUTCMonth() === bd.getUTCMonth() && od.getUTCDate() < bd.getUTCDate())) age -= 1;
  return age;
}

/** The date ages are measured on: the application date, else the ceremony date, else today. @param {MarriageApplication} d */
function referenceDate(d) {
  return d.jurisdiction.applicationDate || d.ceremony.ceremonyDate || todayIso();
}

/** @param {MarriageApplication} d @returns {Array<number | null>} */
function applicantAges(d) {
  const on = referenceDate(d);
  return [ageOn(d.applicantOne.dateOfBirth, on), ageOn(d.applicantTwo.dateOfBirth, on)];
}

// ------------------------------------------------------------- eligibility

/** The minor path open on the reference date ('none' once the path has closed). */
function minorPathFor(rule, onDate) {
  if (rule.minorPathEnds && onDate >= rule.minorPathEnds) return 'none';
  return rule.minorPath;
}

/**
 * Applicants under the state's minimum age, with whether the state bars them
 * outright (no minor path, below the path's age floor, or beyond the age-gap
 * limit) or allows them with consent or a court order.
 * @param {MarriageApplication} d
 * @returns {{ who: string, age: number, barredReason: string }[]}
 */
function minors(d) {
  const rule = ruleFor(d);
  const on = referenceDate(d);
  const ages = applicantAges(d);
  const path = minorPathFor(rule, on);
  const out = [];
  ages.forEach((age, i) => {
    if (age === null || age >= rule.minAge) return;
    const other = ages[1 - i];
    let barredReason = '';
    if (path === 'none') barredReason = `${rule.name} allows no marriage under ${rule.minAge}`;
    else if (rule.minorMinAge !== null && age < rule.minorMinAge) barredReason = `${rule.name} sets a floor of ${rule.minorMinAge} even with ${path === 'court' ? 'a court order' : 'consent'}`;
    else if (rule.maxGapYears !== null && other !== null && other - age > rule.maxGapYears) barredReason = `the age gap exceeds the ${rule.maxGapYears}-year limit ${rule.name} sets when a minor marries`;
    out.push({ who: i === 0 ? 'First applicant' : 'Second applicant', age, barredReason });
  });
  return out;
}

/** True when an applicant is barred by age. @param {MarriageApplication} d */
function underageBarred(d) {
  return minors(d).some((m) => m.barredReason !== '');
}

/** True when a minor is allowed on a consent path but the consent or court order is missing. @param {MarriageApplication} d */
function minorConsentMissing(d) {
  const allowed = minors(d).filter((m) => m.barredReason === '');
  if (allowed.length === 0) return false;
  const rule = ruleFor(d);
  const path = minorPathFor(rule, referenceDate(d));
  const c = d.eligibility.minorConsent;
  if (path === 'court') return c !== 'court-order';
  return c !== 'parental-consent' && c !== 'court-order';
}

/** Either applicant is still married to someone else. @param {MarriageApplication} d */
function currentlyMarried(d) {
  return d.applicantOne.maritalStatus === 'currently-married' || d.applicantTwo.maritalStatus === 'currently-married';
}

/** Applicants related within a prohibited degree. @param {MarriageApplication} d */
function prohibitedRelationship(d) {
  return d.eligibility.relationshipBetweenApplicants === 'related-prohibited';
}

/** A proxy marriage is requested that the state does not permit for these facts. @param {MarriageApplication} d */
function proxyNotPermitted(d) {
  if (d.eligibility.proxyRequested !== 'yes') return false;
  const rule = ruleFor(d);
  return rule.proxy === 'none' || d.eligibility.activeDutyMilitary !== 'yes';
}

/** True when an applicant's prior marriage ended but the end date is missing or implausible. @param {MarriageApplication} d @returns {string[]} */
function priorMarriageUndocumented(d) {
  const out = [];
  [['First applicant', d.applicantOne], ['Second applicant', d.applicantTwo]].forEach(([label, a]) => {
    if (a.maritalStatus === 'divorced' || a.maritalStatus === 'widowed' || a.maritalStatus === 'annulled') {
      const ended = a.priorMarriageEndedDate;
      const on = referenceDate(d);
      if (parseDate(ended) === null) out.push(`${label}: no end date recorded for the prior marriage`);
      else if (ended > on) out.push(`${label}: the prior marriage is recorded as ending after the application date`);
    }
  });
  return out;
}

// ------------------------------------------------------------- completeness

/** The required application fields that are still empty. @param {MarriageApplication} d @returns {string[]} */
function missingRequired(d) {
  const j = d.jurisdiction;
  const checks = [
    ['State', nonEmpty(j.state)],
    ['County', nonEmpty(j.county)],
    ['Application date', parseDate(j.applicationDate) !== null],
    ['First applicant name', nonEmpty(d.applicantOne.name)],
    ['First applicant date of birth', parseDate(d.applicantOne.dateOfBirth) !== null],
    ['First applicant marital status', nonEmpty(d.applicantOne.maritalStatus)],
    ['Second applicant name', nonEmpty(d.applicantTwo.name)],
    ['Second applicant date of birth', parseDate(d.applicantTwo.dateOfBirth) !== null],
    ['Second applicant marital status', nonEmpty(d.applicantTwo.maritalStatus)],
    ['Relationship between the applicants', nonEmpty(d.eligibility.relationshipBetweenApplicants)],
    ['Appearance in person', nonEmpty(d.eligibility.appearInPerson)]
  ];
  return checks.filter((c) => !c[1]).map((c) => c[0]);
}

/** Applicants who have not presented photo ID. @param {MarriageApplication} d @returns {string[]} */
function idNotPresented(d) {
  const out = [];
  if (d.applicantOne.idPresented !== 'yes') out.push('First applicant');
  if (d.applicantTwo.idPresented !== 'yes') out.push('Second applicant');
  return out;
}

/** Both applicants will not appear in person and no proxy marriage is requested. @param {MarriageApplication} d */
function notAppearing(d) {
  return d.eligibility.appearInPerson === 'no' && d.eligibility.proxyRequested !== 'yes';
}

// ------------------------------------------------------------------ timing

/**
 * The waiting period in whole days after applying any waiver the state offers.
 * @param {MarriageApplication} d
 * @returns {{ days: number, waivedBy: string }}
 */
function waitingDays(d) {
  const rule = ruleFor(d);
  const base = Math.ceil(rule.waitingHours / 24);
  if (base === 0) return { days: 0, waivedBy: '' };
  const e = d.eligibility;
  const code = String(d.jurisdiction.state || '').toUpperCase();
  if (rule.waitingWaivers.indexOf('course') !== -1 && e.premaritalCourseCompleted === 'yes') return { days: 0, waivedBy: 'premarital course' };
  if (rule.waitingWaivers.indexOf('military') !== -1 && e.activeDutyMilitary === 'yes') return { days: 0, waivedBy: 'active-duty military service' };
  const resident = [d.applicantOne.residenceState, d.applicantTwo.residenceState].map((s) => String(s || '').toUpperCase());
  if (rule.waitingWaivers.indexOf('nonresident') !== -1 && resident.every((s) => s !== '') && resident.every((s) => s !== code)) return { days: 0, waivedBy: 'both applicants living outside the state' };
  return { days: base, waivedBy: '' };
}

/** The date the license was (or is taken to be) issued: the issue date, else the application date. @param {MarriageApplication} d */
function issueDate(d) {
  return parseDate(d.issuance.licenseIssuedDate) !== null ? d.issuance.licenseIssuedDate : d.jurisdiction.applicationDate;
}

/** Earliest permitted ceremony date, or null when the issue date is unknown. @param {MarriageApplication} d */
function earliestCeremonyDate(d) {
  const issued = issueDate(d);
  return parseDate(issued) === null ? null : addDays(issued, waitingDays(d).days);
}

/** Last day the license is valid, or null when the issue date is unknown. @param {MarriageApplication} d */
function licenseExpiryDate(d) {
  const issued = issueDate(d);
  return parseDate(issued) === null ? null : addDays(issued, ruleFor(d).validDays);
}

/** The ceremony is set before the license was issued. @param {MarriageApplication} d */
function ceremonyBeforeIssue(d) {
  const diff = daysBetween(issueDate(d), d.ceremony.ceremonyDate);
  return diff !== null && diff < 0;
}

/** The ceremony is set inside the waiting period. @param {MarriageApplication} d */
function waitingNotElapsed(d) {
  const diff = daysBetween(issueDate(d), d.ceremony.ceremonyDate);
  return diff !== null && diff >= 0 && diff < waitingDays(d).days;
}

/** The ceremony is set after the license expired. @param {MarriageApplication} d */
function licenseExpired(d) {
  const diff = daysBetween(issueDate(d), d.ceremony.ceremonyDate);
  return diff !== null && diff > ruleFor(d).validDays;
}

/** Witnesses the ceremony needs. @param {MarriageApplication} d */
function witnessesRequired(d) {
  const rule = ruleFor(d);
  return d.jurisdiction.licenseType === 'confidential' ? rule.confidentialWitnesses : rule.witnesses;
}

/** The ceremony is set and fewer witnesses were present than required. @param {MarriageApplication} d */
function witnessShortfall(d) {
  if (parseDate(d.ceremony.ceremonyDate) === null) return false;
  const n = d.ceremony.witnessCount === null ? 0 : d.ceremony.witnessCount;
  return n < witnessesRequired(d);
}

/** The ceremony is set but the officiant is not authorized or not identified. @param {MarriageApplication} d */
function officiantProblem(d) {
  if (parseDate(d.ceremony.ceremonyDate) === null) return '';
  const c = d.ceremony;
  if (c.officiantAuthorized === 'no') return 'unauthorized';
  if (!nonEmpty(c.officiantName) || !nonEmpty(c.officiantType) || c.officiantAuthorized === '') return 'missing';
  return '';
}

/** The signed license is overdue, or was returned late. @param {MarriageApplication} d @returns {'' | 'overdue' | 'late' | 'before-ceremony'} */
function certificateReturnProblem(d) {
  const c = d.ceremony;
  if (parseDate(c.ceremonyDate) === null) return '';
  const limit = ruleFor(d).returnWithinDays;
  if (parseDate(c.licenseReturnedDate) === null) {
    const since = daysBetween(c.ceremonyDate, todayIso());
    return since !== null && since > limit ? 'overdue' : '';
  }
  const diff = daysBetween(c.ceremonyDate, c.licenseReturnedDate);
  if (diff < 0) return 'before-ceremony';
  return diff > limit ? 'late' : '';
}

/** Blood-test evidence missing where the rule requires it. @param {MarriageApplication} d */
function bloodTestMissing(d) {
  return ruleFor(d).bloodTest === true && d.eligibility.bloodTestEvidence !== 'provided';
}

/** Both applicants recorded as the same sex (Obergefell notice). @param {MarriageApplication} d */
function sameSexCouple(d) {
  const a = d.applicantOne.sex;
  const b = d.applicantTwo.sex;
  return (a === 'female' || a === 'male') && a === b;
}

export { STATE_RULES, DEFAULT_RULE, stateRuleKnown, ruleFor, parseDate, daysBetween, addDays, todayIso, ageOn, applicantAges, minorPathFor, minors, underageBarred, minorConsentMissing, currentlyMarried, prohibitedRelationship, proxyNotPermitted, priorMarriageUndocumented, missingRequired, idNotPresented, notAppearing, waitingDays, issueDate, earliestCeremonyDate, licenseExpiryDate, ceremonyBeforeIssue, waitingNotElapsed, licenseExpired, witnessesRequired, witnessShortfall, officiantProblem, certificateReturnProblem, bloodTestMissing, sameSexCouple, nonEmpty };
