import { missingItems, riskConditions } from './rules.js';

// United Kingdom Vehicle Bill of Sale completeness grader. Pure functions:
// take a `BillOfSale` object, evaluate the risk conditions and the required
// items, and assign exactly one classification. It makes NO legal judgement;
// it is documentation support, not legal advice.
//
// Algorithm (spec §4), first matching class wins:
//   any risk condition       -> 'risk-flagged'
//   any missing required item -> 'incomplete'
//   otherwise                -> 'complete'

/**
 * @typedef {import('./types.js').BillOfSale} BillOfSale
 * @typedef {import('./types.js').Classification} Classification
 */

/**
 * Assign the single classification (spec §4).
 * @param {BillOfSale} d
 * @returns {Classification}
 */
function deriveClassification(d) {
  if (riskConditions(d).length > 0) return 'risk-flagged';
  if (missingItems(d).length > 0) return 'incomplete';
  return 'complete';
}

/**
 * Compute the full classification for the supplied bill of sale.
 * @param {BillOfSale} d
 * @returns {{ classification: Classification,
 *             missingItemCount: number,
 *             riskFlagCount: number,
 *             missingItems: string[] }}
 */
function assessBillOfSale(d) {
  const missing = missingItems(d);
  return {
    classification: deriveClassification(d),
    missingItemCount: missing.length,
    riskFlagCount: riskConditions(d).length,
    missingItems: missing.map((m) => m.label)
  };
}

export { deriveClassification, assessBillOfSale };
