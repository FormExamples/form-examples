import { incompleteIndicated, odometerExemption, riskIndicated, stateRule } from './rules.js';

// United States vehicle bill-of-sale completeness grader. Pure functions: take a
// `BillOfSale` object, evaluate the risk conditions and the completeness of the
// required items, and assign exactly one completeness class. It makes NO legal
// judgement; the state motor vehicle agency decides.
//
// Algorithm (spec §4), first matching class wins:
//   riskIndicated      -> 'risk-flagged'
//   incompleteIndicated -> 'incomplete'
//   otherwise          -> 'complete'
//
// `risk-flagged` takes precedence over completeness: an odometer discrepancy, an
// invalid VIN, an outstanding lien, no title in hand, or a branded title needs
// attention however complete the paperwork is. A `complete` bill of sale still
// leaves the post-sale filings (see `flags.js`).

/**
 * @typedef {import('./types.js').BillOfSale} BillOfSale
 * @typedef {import('./types.js').CompletenessClass} CompletenessClass
 */

/**
 * Assign the single completeness class (spec §4).
 * @param {BillOfSale} d
 * @returns {CompletenessClass}
 */
function deriveCompletenessClass(d) {
  if (riskIndicated(d)) return 'risk-flagged';
  if (incompleteIndicated(d)) return 'incomplete';
  return 'complete';
}

/**
 * Compute the full classification for the supplied bill of sale. This
 * classifies completeness and consistency only: it is not legal advice.
 * @param {BillOfSale} d
 * @returns {{ completenessClass: CompletenessClass,
 *             odometerExempt: boolean,
 *             stateRuleKnown: boolean }}
 */
function validateBillOfSale(d) {
  return {
    completenessClass: deriveCompletenessClass(d),
    odometerExempt: odometerExemption(d).exempt,
    stateRuleKnown: stateRule(d.transaction.state).known
  };
}

export { deriveCompletenessClass, validateBillOfSale };
