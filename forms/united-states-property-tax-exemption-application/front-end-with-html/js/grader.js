import {
  baseFails, baseUnanswered, claimedExemptions, declarationComplete, duplicateHomestead, exemptionStatus,
  filedLate, filingDeadline, missingDocuments, missingRequired, occupancyFails, ownershipFails,
  qualifyingExemptions, stateKnown
} from './rules.js';

// United States Property Tax Exemption Application eligibility grader. Pure
// functions: take a `PropertyTaxApplication`, evaluate base eligibility (owner
// and occupant on the assessment date, no second homestead), the state filing
// deadline, each claimed exemption against the state's age / income / rating
// test, the proof documents and the signed declaration, and assign exactly one
// class. Documentation support, not legal advice; the county assessor decides.
//
// Algorithm (spec section 4), first matching class wins:
//   baseFails || (filedLate && applicationType !== 'late')
//     || (claims exist and every claim fails)            -> 'likely-ineligible'
//   missing identification / answers / claims / proofs / signature,
//     or any claim still 'unknown'                        -> 'incomplete'
//   otherwise                                             -> 'likely-eligible'

/**
 * @typedef {import('./types.js').PropertyTaxApplication} PropertyTaxApplication
 * @typedef {import('./types.js').EligibilityClass} EligibilityClass
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** @param {PropertyTaxApplication} d */
function isIneligible(d) {
  if (baseFails(d)) return true;
  if (filedLate(d) && d.filing.applicationType !== 'late') return true;
  const claimed = claimedExemptions(d);
  return claimed.length > 0 && claimed.every((id) => exemptionStatus(d, id).status === 'fail');
}

/** @param {PropertyTaxApplication} d */
function isIncomplete(d) {
  const claimed = claimedExemptions(d);
  return (
    missingRequired(d).length > 0 ||
    baseUnanswered(d) ||
    claimed.length === 0 ||
    claimed.some((id) => exemptionStatus(d, id).status === 'unknown') ||
    missingDocuments(d).length > 0 ||
    !declarationComplete(d)
  );
}

/**
 * Assign the single eligibility class (spec section 4).
 * @param {PropertyTaxApplication} d
 * @returns {EligibilityClass}
 */
function deriveEligibilityClass(d) {
  if (isIneligible(d)) return 'likely-ineligible';
  if (isIncomplete(d)) return 'incomplete';
  return 'likely-eligible';
}

/**
 * Rules that fired, for the audit trail (`..._grade_rule` rows).
 * @param {PropertyTaxApplication} d
 * @returns {FiredRule[]}
 */
function firedRules(d) {
  /** @type {FiredRule[]} */
  const rules = [];
  const add = (id, dimension, category, description) => rules.push({ id, dimension, category, description });
  if (ownershipFails(d)) add('R-OWNERSHIP-01', 'ownership', 'base-eligibility', 'The applicant did not hold title on the assessment date.');
  if (occupancyFails(d)) add('R-OCCUPANCY-01', 'occupancy', 'base-eligibility', 'The property was not the primary residence on the assessment date.');
  if (duplicateHomestead(d)) add('R-DUPLICATE-01', 'exemption', 'base-eligibility', 'A homestead exemption is already claimed on another property.');
  if (filedLate(d)) add('R-FILING-01', 'filing', 'state-rule', 'The filing date is after the state filing deadline.');
  for (const id of claimedExemptions(d)) {
    const st = exemptionStatus(d, id);
    if (st.status === 'fail') add(`R-EXEMPTION-${id.toUpperCase()}-01`, st.reason === 'income' ? 'income' : 'exemption', 'state-rule', `The ${id} claim fails the state test (${st.reason}).`);
  }
  if (missingDocuments(d).length > 0) add('R-DOCUMENTS-01', 'documents', 'required-component', `Missing proof: ${missingDocuments(d).join(', ')}.`);
  if (!declarationComplete(d)) add('R-DECLARATION-01', 'declaration', 'required-component', 'The declaration is unsigned or the false-statement penalty is not acknowledged.');
  if (!stateKnown(d)) add('R-STATE-01', 'classification', 'state-rule', 'State not in the encoded table; the default rule was used.');
  return rules;
}

/**
 * Compute the full eligibility classification for the supplied application.
 * @param {PropertyTaxApplication} d
 * @returns {{ eligibilityClass: EligibilityClass, filingDeadline: string | null,
 *             filedLate: boolean, qualifyingExemptions: string[], rules: FiredRule[] }}
 */
function gradeApplication(d) {
  return {
    eligibilityClass: deriveEligibilityClass(d),
    filingDeadline: filingDeadline(d),
    filedLate: filedLate(d),
    qualifyingExemptions: qualifyingExemptions(d),
    rules: firedRules(d)
  };
}

export { deriveEligibilityClass, firedRules, gradeApplication };
