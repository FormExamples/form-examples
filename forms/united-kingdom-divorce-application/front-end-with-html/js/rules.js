// Declarative divorce / dissolution application rules (England and Wales).
//
// This form is a COMPLETENESS and VALIDITY instrument, not a scored assessment,
// and it is NOT legal advice. This module holds the primitive predicates the
// grader (`grader.js`) and the flag detector (`flags.js`) compose (spec section 4):
//
//   - date arithmetic on ISO dates (UTC, no wall clock),
//   - the three stage gates: the one-year rule (Matrimonial Causes Act 1973
//     s.3 / Civil Partnership Act 2004 s.41), the 20-week reflection period
//     before a conditional order and the 6 weeks and 1 day wait (43 days)
//     before a final order (Divorce, Dissolution and Separation Act 2020),
//   - the jurisdiction grounds (Domicile and Matrimonial Proceedings Act 1973
//     s.5(2)),
//   - the required-information checks for each stage.
//
// Every predicate is a pure function of the supplied state and its `asOfDate`;
// nothing reads the wall clock, so results are reproducible.

/**
 * @typedef {import('./types.js').DivorceApplication} DivorceApplication
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const isoRe = /^\d{4}-\d{2}-\d{2}$/;

/** Days from the 20-week reflection period (20 x 7). */
const REFLECTION_DAYS = 140;
/** Days from conditional order to final order: 6 weeks and 1 day. */
const FINAL_ORDER_WAIT_DAYS = 43;

/** @param {string|null|undefined} iso @returns {number|null} UTC day number */
function dayNumber(iso) {
  if (typeof iso !== 'string' || !isoRe.test(iso)) return null;
  const t = Date.parse(iso + 'T00:00:00Z');
  return Number.isNaN(t) ? null : Math.floor(t / 86400000);
}

/** @param {number} n @returns {string} ISO date for a UTC day number */
function isoFromDayNumber(n) {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}

/** @param {string|null} iso @param {number} days @returns {string} '' when iso is invalid */
function addDays(iso, days) {
  const n = dayNumber(iso);
  return n === null ? '' : isoFromDayNumber(n + days);
}

/** @param {string|null} iso @param {number} years @returns {string} '' when iso is invalid */
function addYears(iso, years) {
  const n = dayNumber(iso);
  if (n === null) return '';
  const d = new Date(n * 86400000);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

/**
 * First day an application may be made: the first anniversary of the marriage.
 * @param {DivorceApplication} s
 * @returns {string} ISO date, '' when the marriage date is unknown
 */
function oneYearDate(s) {
  return addYears(s.marriage.marriageDate, 1);
}

/** True when the one-year rule is satisfied, or cannot yet be tested. @param {DivorceApplication} s */
function oneYearRuleMet(s) {
  const first = oneYearDate(s);
  const asOf = dayNumber(s.application.asOfDate);
  if (first === '' || asOf === null) return true;
  return asOf >= dayNumber(first);
}

/** Earliest conditional-order date: 20 weeks after issue. '' when not issued. @param {DivorceApplication} s */
function conditionalOrderDate(s) {
  return addDays(s.progress.applicationIssuedDate, REFLECTION_DAYS);
}

/** True when 20 weeks have passed since issue, or cannot yet be tested. @param {DivorceApplication} s */
function reflectionPeriodMet(s) {
  const first = conditionalOrderDate(s);
  const asOf = dayNumber(s.application.asOfDate);
  if (first === '' || asOf === null) return true;
  return asOf >= dayNumber(first);
}

/** Earliest final-order date: 6 weeks and 1 day (43 days) after the conditional order. @param {DivorceApplication} s */
function finalOrderDate(s) {
  return addDays(s.progress.conditionalOrderGrantedDate, FINAL_ORDER_WAIT_DAYS);
}

/** True when 6 weeks and 1 day have passed since the conditional order, or cannot be tested. @param {DivorceApplication} s */
function finalOrderWaitMet(s) {
  const first = finalOrderDate(s);
  const asOf = dayNumber(s.application.asOfDate);
  if (first === '' || asOf === null) return true;
  return asOf >= dayNumber(first);
}

/** Last day to apply for the final order without explaining a delay: 12 months after the conditional order. @param {DivorceApplication} s */
function finalOrderDeadline(s) {
  return addYears(s.progress.conditionalOrderGrantedDate, 1);
}

/** True when more than 12 months have passed since the conditional order. @param {DivorceApplication} s */
function finalOrderOverdue(s) {
  const last = finalOrderDeadline(s);
  const asOf = dayNumber(s.application.asOfDate);
  if (last === '' || asOf === null) return false;
  return asOf > dayNumber(last);
}

/**
 * The earliest date the stage being checked can be applied for; '' when no gate
 * applies or the needed date is unknown.
 * @param {DivorceApplication} s
 * @returns {string}
 */
function earliestEligibleDate(s) {
  switch (s.application.stage) {
    case 'application': return oneYearDate(s);
    case 'conditional-order': return conditionalOrderDate(s);
    case 'final-order': return finalOrderDate(s);
    default: return '';
  }
}

/**
 * True when the gate for the stage being checked is not yet met (the application
 * would be premature).
 * @param {DivorceApplication} s
 */
function stageGateNotMet(s) {
  switch (s.application.stage) {
    case 'application': return !oneYearRuleMet(s);
    case 'conditional-order': return !reflectionPeriodMet(s);
    case 'final-order': return !finalOrderWaitMet(s);
    default: return false;
  }
}

/**
 * Jurisdiction grounds met under Domicile and Matrimonial Proceedings Act 1973
 * s.5(2) (as substituted for England and Wales). Returns the list of ground
 * identifiers satisfied by the answers given.
 * @param {DivorceApplication} s
 * @returns {string[]}
 */
function jurisdictionGrounds(s) {
  const j = s.jurisdiction;
  const sole = s.application.applicationMode === 'sole';
  const grounds = [];
  if (j.applicantHabitualResident === 'yes' && j.respondentHabitualResident === 'yes') grounds.push('both-habitually-resident');
  if (j.lastHabituallyResidentTogether === 'yes') grounds.push('last-habitually-resident-one-continues');
  if (sole && j.respondentHabitualResident === 'yes') grounds.push('respondent-habitually-resident');
  const months = typeof j.applicantResidenceMonths === 'number' ? j.applicantResidenceMonths : 0;
  if (j.applicantHabitualResident === 'yes' && months >= 12) grounds.push('applicant-habitually-resident-12-months');
  if (j.applicantHabitualResident === 'yes' && j.applicantDomiciled === 'yes' && months >= 6) grounds.push('applicant-domiciled-resident-6-months');
  if (j.applicantDomiciled === 'yes' && j.respondentDomiciled === 'yes') grounds.push('both-domiciled');
  if (j.applicantDomiciled === 'yes' || j.respondentDomiciled === 'yes') grounds.push('one-domiciled');
  return grounds;
}

/** True when at least one jurisdiction ground is met. @param {DivorceApplication} s */
function jurisdictionMet(s) {
  return jurisdictionGrounds(s).length > 0;
}

/** True when no jurisdiction question has been answered yet. @param {DivorceApplication} s */
function jurisdictionUnanswered(s) {
  const j = s.jurisdiction;
  return (
    j.applicantHabitualResident === '' && j.applicantDomiciled === '' &&
    j.respondentHabitualResident === '' && j.respondentDomiciled === '' &&
    j.lastHabituallyResidentTogether === '' && j.applicantResidenceMonths === null
  );
}

/** The marriage certificate is held (original or certified copy). @param {DivorceApplication} s */
function certificateHeld(s) {
  const t = s.marriage.marriageCertificateType;
  return t === 'original' || t === 'certified-copy';
}

/** A certified translation is needed and not held. @param {DivorceApplication} s */
function translationMissing(s) {
  return s.marriage.certificateInEnglish === 'no' && s.marriage.certifiedTranslation !== 'yes';
}

/** The name-change proof is missing. @param {DivorceApplication} s */
function nameProofMissing(s) {
  const m = s.marriage;
  return m.nameChanged === 'yes' && (m.nameChangeProof === '' || m.nameChangeProof === 'none');
}

/** A sole application whose service address cannot be used. @param {DivorceApplication} s */
function serviceAddressProblem(s) {
  if (s.application.applicationMode !== 'sole') return false;
  const p = s.parties;
  if (p.respondentAddressKnown === 'no') return true;
  if (p.respondentAddressKnown === 'yes' && !nonEmpty(p.respondentAddress)) return true;
  if (p.serviceMethod === 'email' && !nonEmpty(p.respondentEmail)) return true;
  return false;
}

/** Children under 18 whose arrangements are not agreed. @param {DivorceApplication} s */
function childrenArrangementsOpen(s) {
  const c = s.children;
  return c.childrenUnder18 === 'yes' && c.childrenArrangements !== 'agreed';
}

/** A financial order is wanted (or undecided) and has not been applied for. @param {DivorceApplication} s */
function financialOrderOutstanding(s) {
  const f = s.finances;
  return (f.financialOrderIntended === 'yes' || f.financialOrderIntended === 'undecided') && f.financialOrderApplied !== 'yes';
}

/** Fee relevant only to the application stage; unpaid means not ready. @param {DivorceApplication} s */
function feeOutstanding(s) {
  return s.application.stage === 'application' && s.finances.feeStatus === 'unpaid';
}

/** A joint application where a domestic-abuse risk is declared. @param {DivorceApplication} s */
function jointDespiteAbuse(s) {
  return s.application.applicationMode === 'joint' && s.application.domesticAbuseRisk === 'yes';
}

export { nonEmpty, REFLECTION_DAYS, FINAL_ORDER_WAIT_DAYS, dayNumber, addDays, addYears, oneYearDate, oneYearRuleMet, conditionalOrderDate, reflectionPeriodMet, finalOrderDate, finalOrderWaitMet, finalOrderDeadline, finalOrderOverdue, earliestEligibleDate, stageGateNotMet, jurisdictionGrounds, jurisdictionMet, jurisdictionUnanswered, certificateHeld, translationMissing, nameProofMissing, serviceAddressProblem, childrenArrangementsOpen, financialOrderOutstanding, feeOutstanding, jointDespiteAbuse };
