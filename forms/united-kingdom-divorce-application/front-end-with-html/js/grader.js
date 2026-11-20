import { certificateHeld, earliestEligibleDate, feeOutstanding, finalOrderOverdue, jointDespiteAbuse, jurisdictionMet, nameProofMissing, nonEmpty, serviceAddressProblem, stageGateNotMet, translationMissing } from './rules.js';

// United Kingdom divorce / dissolution application readiness grader (England and
// Wales, Divorce, Dissolution and Separation Act 2020). Pure functions: take a
// `DivorceApplication` object, test the stage gate and the required information,
// and assign exactly one application class. It gives NO legal advice.
//
// Algorithm (spec section 4), first matching class wins:
//   stage gate not yet met (one year of marriage; 20 weeks since issue;
//   6 weeks and 1 day since the conditional order)  -> 'not-eligible-yet'
//   any readiness rule fires                         -> 'incomplete'
//   otherwise                                        -> 'ready-to-apply'
//
// `not-eligible-yet` takes precedence over completeness: an application made
// before its gate opens will be refused however complete it is. Blockers such as
// a jurisdiction ground that is not met, a marriage that is not recognised or an
// unusable service address are reported as `incomplete` with a high-priority flag.

/**
 * @typedef {import('./types.js').DivorceApplication} DivorceApplication
 * @typedef {import('./types.js').ApplicationClass} ApplicationClass
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} dimension
 * @property {string} category
 * @property {string} description
 */

/**
 * Every readiness rule that fires for the supplied application, in a stable
 * order. This is the audit trail stored in the `_grade_rule` table.
 * @param {DivorceApplication} s
 * @returns {FiredRule[]}
 */
function firedRules(s) {
  /** @type {FiredRule[]} */
  const out = [];
  const a = s.application;
  const m = s.marriage;
  const p = s.parties;
  const c = s.children;
  const f = s.finances;
  const g = s.progress;
  const add = (id, dimension, category, description) => out.push({ id, dimension, category, description });

  if (stageGateNotMet(s)) {
    const first = earliestEligibleDate(s);
    add('R-TIME-GATE-NOT-MET-01', 'timing', 'stage-gate',
      `The ${a.stage} stage cannot be applied for before ${first}.`);
  }
  if (a.applicationType === '' || a.applicationMode === '' || a.stage === '' || a.asOfDate === null) {
    add('R-SETUP-MISSING-01', 'eligibility', 'required-field',
      'The application type, sole or joint mode, stage and date of the check are all required.');
  }
  if (m.marriageDate === null) {
    add('R-MARRIAGE-DATE-MISSING-01', 'eligibility', 'required-field', 'The date of the marriage or civil partnership is required.');
  }
  if (m.legallyRecognised !== 'yes') {
    add('R-RECOGNITION-NOT-CONFIRMED-01', 'eligibility', 'legal-recognition',
      'The marriage or civil partnership must be legally recognised in the United Kingdom.');
  }
  if (m.breakdownConfirmed !== 'yes') {
    add('R-BREAKDOWN-NOT-CONFIRMED-01', 'eligibility', 'irretrievable-breakdown',
      'The applicant must state that the relationship has broken down irretrievably.');
  }
  if (a.domesticAbuseRisk === '') {
    add('R-DOMESTIC-ABUSE-UNANSWERED-01', 'eligibility', 'required-field', 'Whether there is a risk of domestic abuse must be answered.');
  }
  if (jointDespiteAbuse(s)) {
    add('R-JOINT-DESPITE-ABUSE-01', 'eligibility', 'application-mode',
      'A joint application is not suitable where there is a risk of domestic abuse; apply as a sole applicant.');
  }
  if (!jurisdictionMet(s)) {
    add('R-JURISDICTION-NOT-MET-01', 'jurisdiction', 'jurisdiction-ground',
      'No England and Wales jurisdiction ground is met by the residence and domicile answers given.');
  }
  if (!certificateHeld(s)) {
    add('R-CERTIFICATE-MISSING-01', 'documents', 'marriage-certificate',
      'The original marriage certificate or a certified copy is required.');
  } else if (m.certificateInEnglish === '') {
    add('R-CERTIFICATE-LANGUAGE-UNANSWERED-01', 'documents', 'translation', 'Whether the marriage certificate is in English must be answered.');
  }
  if (translationMissing(s)) {
    add('R-TRANSLATION-MISSING-01', 'documents', 'translation', 'A certified translation is required for a marriage certificate that is not in English.');
  }
  if (nameProofMissing(s)) {
    add('R-NAME-PROOF-MISSING-01', 'documents', 'name-change', 'Proof of the name change (marriage certificate or deed poll) is required.');
  }
  if (!nonEmpty(p.applicantName) || !nonEmpty(p.respondentName)) {
    add('R-PARTY-NAMES-MISSING-01', 'service', 'required-field', 'The full names of both spouses or civil partners are required.');
  }
  if (a.applicationMode === 'sole' && (p.respondentAddressKnown === '' || p.serviceMethod === '')) {
    add('R-SERVICE-UNANSWERED-01', 'service', 'service-address', 'For a sole application, whether the other spouse\'s address is known and how the papers are served must be answered.');
  } else if (serviceAddressProblem(s)) {
    add('R-SERVICE-ADDRESS-UNUSABLE-01', 'service', 'service-address', 'The court needs a current address (or an email address for online service) for the other spouse.');
  }
  if (c.childrenUnder18 === '') {
    add('R-CHILDREN-UNANSWERED-01', 'children', 'required-field', 'Whether there are children under 18 must be answered.');
  } else if (c.childrenUnder18 === 'yes' && c.childrenArrangements === '') {
    add('R-CHILDREN-ARRANGEMENTS-UNANSWERED-01', 'children', 'children-arrangements', 'The state of the arrangements for the children must be answered.');
  }
  if (f.financialOrderIntended === '') {
    add('R-FINANCIAL-INTENT-UNANSWERED-01', 'finances', 'required-field', 'Whether a financial order is intended must be answered.');
  }
  if (a.stage === 'application' && (f.feeStatus === '' || feeOutstanding(s))) {
    add('R-FEE-OUTSTANDING-01', 'finances', 'fee', 'The court fee must be paid or help with fees approved or applied for.');
  }
  if (a.stage === 'conditional-order' && g.applicationIssuedDate === null) {
    add('R-ISSUE-DATE-MISSING-01', 'timing', 'required-field', 'The date the court issued the application is required for a conditional order.');
  }
  if (a.stage === 'final-order') {
    if (g.conditionalOrderGrantedDate === null) {
      add('R-CONDITIONAL-ORDER-DATE-MISSING-01', 'timing', 'required-field', 'The date the conditional order was made is required for a final order.');
    }
    if (finalOrderOverdue(s) && g.finalOrderDelayExplained !== 'yes') {
      add('R-FINAL-ORDER-DELAY-UNEXPLAINED-01', 'timing', 'final-order-delay', 'More than 12 months have passed since the conditional order; the reason for the delay must be explained to the court.');
    }
    if ((f.financialOrderIntended === 'yes' || f.financialOrderIntended === 'undecided') && f.financialOrderApplied === '') {
      add('R-FINANCIAL-ORDER-STATUS-01', 'finances', 'financial-order', 'Whether a financial order has been applied for must be answered before a final order.');
    }
  }
  return out;
}

/**
 * Assign the single application class (spec section 4).
 * @param {DivorceApplication} s
 * @returns {ApplicationClass}
 */
function deriveApplicationClass(s) {
  if (stageGateNotMet(s)) return 'not-eligible-yet';
  if (firedRules(s).length > 0) return 'incomplete';
  return 'ready-to-apply';
}

/**
 * Compute the full readiness classification for the supplied application. This
 * classifies completeness and the stage gate only; it gives NO legal advice and
 * the court decides every application.
 * @param {DivorceApplication} s
 * @returns {{ applicationClass: ApplicationClass,
 *             earliestEligibleDate: string,
 *             jurisdictionMet: boolean,
 *             rules: FiredRule[] }}
 */
function validateApplication(s) {
  return {
    applicationClass: deriveApplicationClass(s),
    earliestEligibleDate: earliestEligibleDate(s),
    jurisdictionMet: jurisdictionMet(s),
    rules: firedRules(s)
  };
}

export { firedRules, deriveApplicationClass, validateApplication };
