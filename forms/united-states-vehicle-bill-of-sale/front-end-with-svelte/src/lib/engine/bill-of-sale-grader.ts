import type { BillOfSale, CompletenessClass, ValidationResult } from './types';
import {
  incompleteIndicated,
  odometerExemption,
  riskIndicated,
  stateRule
} from './bill-of-sale-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * United States vehicle bill-of-sale completeness grader. Pure functions: take a
 * `BillOfSale` object, evaluate the risk conditions and the completeness of the
 * required items, and assign exactly one completeness class. It makes NO legal
 * judgement; the state motor vehicle agency decides.
 *
 * Algorithm (spec §4), first matching class wins:
 *   riskIndicated       -> 'risk-flagged'
 *   incompleteIndicated -> 'incomplete'
 *   otherwise           -> 'complete'
 *
 * `risk-flagged` takes precedence over completeness: an odometer discrepancy, an
 * invalid VIN, an outstanding lien, no title in hand, or a branded title needs
 * attention however complete the paperwork is. A `complete` bill of sale still
 * leaves the post-sale filings (see `flagged-issues.ts`).
 */

/** Assign the single completeness class (spec §4). */
export function deriveCompletenessClass(d: BillOfSale): CompletenessClass {
  if (riskIndicated(d)) return 'risk-flagged';
  if (incompleteIndicated(d)) return 'incomplete';
  return 'complete';
}

/**
 * Compute the full classification for the supplied bill of sale. This
 * classifies completeness and consistency only: it is not legal advice.
 */
export function validateBillOfSale(d: BillOfSale): ValidationResult {
  return {
    completenessClass: deriveCompletenessClass(d),
    odometerExempt: odometerExemption(d).exempt,
    stateRuleKnown: stateRule(d.transaction.state).known,
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
