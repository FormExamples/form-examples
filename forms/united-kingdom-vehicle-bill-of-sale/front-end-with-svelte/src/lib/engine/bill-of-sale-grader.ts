import type { AssessmentResult, BillOfSale, Classification } from './types';
import { missingItems, riskConditions } from './bill-of-sale-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * United Kingdom Vehicle Bill of Sale grader. Pure functions: take a
 * `BillOfSale` object, evaluate the risk conditions and the required items, and
 * assign exactly one classification. It makes NO legal judgement; it is
 * documentation support, not legal advice.
 *
 * Algorithm (spec §4), first matching class wins:
 *   any risk condition        -> 'risk-flagged'
 *   any missing required item -> 'incomplete'
 *   otherwise                 -> 'complete'
 */

/** Assign the single classification (spec §4). */
export function deriveClassification(d: BillOfSale): Classification {
  if (riskConditions(d).length > 0) return 'risk-flagged';
  if (missingItems(d).length > 0) return 'incomplete';
  return 'complete';
}

/** Compute the full classification for the supplied bill of sale. */
export function assessBillOfSale(d: BillOfSale): AssessmentResult {
  const missing = missingItems(d);
  return {
    classification: deriveClassification(d),
    missingItemCount: missing.length,
    riskFlagCount: riskConditions(d).length,
    missingItems: missing.map((m) => m.label),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
