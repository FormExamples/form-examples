// Declarative reconciliation rules and derivation helpers (pure functions).
//
// Medication reconciliation is a documentation-and-completeness form: rather
// than one numeric score, the engine derives per-record COUNTS, classifies each
// discrepancy as intentional vs unintentional, and derives a STATUS class
// (complete / discrepancies-outstanding / incomplete) per spec §4. The pure
// helpers below implement those boundaries; `grader.js` calls them and records
// an audit trail mirroring the `medication_reconciliation_grade_rule` SQL table.
//
// Status (spec §4, first match wins):
//   sourceCount < 2                          -> 'incomplete'
//   allergyStatus not documented / nkda      -> 'incomplete'
//   any line item not yet reviewed           -> 'incomplete'
//   unintentionalCount > 0                    -> 'discrepancies-outstanding'
//   any discrepancy missing action/rationale  -> 'discrepancies-outstanding'
//   otherwise                                 -> 'complete'

/**
 * @typedef {import('./types.js').ReconciliationData} ReconciliationData
 * @typedef {import('./types.js').Discrepancy} Discrepancy
 * @typedef {import('./types.js').LineItem} LineItem
 * @typedef {import('./types.js').ReconciliationStatus} ReconciliationStatus
 */

// Wrapped in an IIFE; published via window.MedicationReconciliation.

/** The two-independent-source minimum for an adequate BPMH. */
const MINIMUM_SOURCES = 2;

/** High-risk medicine classes for the high-priority discrepancy branch. */
const HIGH_RISK_CLASSES = ['anticoagulant', 'insulin', 'opioid'];

/**
 * A discrepancy is a documented (intentional) decision only when it is marked
 * intentional AND carries both an intended action and a rationale.
 * @param {Discrepancy} d
 * @returns {boolean}
 */
function isIntentional(d) {
  return (
    d.intentional === 'yes' &&
    (d.intendedAction || '').trim() !== '' &&
    (d.rationale || '').trim() !== ''
  );
}

/**
 * A discrepancy is unintentional (an outstanding error) when it is not a fully
 * documented intentional decision — i.e. explicitly `intentional !== 'yes'`.
 * @param {Discrepancy} d
 * @returns {boolean}
 */
function isUnintentional(d) {
  return d.intentional !== 'yes';
}

/**
 * Whether any discrepancy is missing its intended action or rationale.
 * @param {Discrepancy[]} discrepancies
 * @returns {boolean}
 */
function anyMissingActionOrRationale(discrepancies) {
  return discrepancies.some(
    (d) => (d.intendedAction || '').trim() === '' || (d.rationale || '').trim() === ''
  );
}

/**
 * Whether a line item still needs review. A row counts as reviewed once it
 * carries a drug name; a row with no drug name is an unreviewed placeholder.
 * @param {LineItem} li
 * @returns {boolean}
 */
function lineItemNeedsReview(li) {
  return (li.drugName || '').trim() === '';
}

/**
 * Whether the recorded allergy status counts as documented (either explicit
 * allergies or a positive "no known drug allergies").
 * @param {string} allergyStatus
 * @returns {boolean}
 */
function allergyStatusDocumented(allergyStatus) {
  return allergyStatus === 'documented' || allergyStatus === 'no-known-drug-allergies';
}

/**
 * Does an unintentional discrepancy touch a high-risk medicine? A discrepancy
 * references line items by free-text ref (bpmhItemRef / inpatientItemRef); a
 * high-risk line item whose drug name is named by either ref makes the
 * discrepancy high-risk.
 * @param {Discrepancy} d
 * @param {LineItem[]} lineItems
 * @returns {boolean}
 */
function discrepancyTouchesHighRisk(d, lineItems) {
  const refs = `${d.bpmhItemRef || ''} ${d.inpatientItemRef || ''}`.toLowerCase();
  return lineItems.some((li) => {
    if (!HIGH_RISK_CLASSES.includes(li.highRiskClass)) return false;
    const name = (li.drugName || '').trim().toLowerCase();
    return name !== '' && refs.includes(name);
  });
}

/**
 * Derive the reconciliation status (spec §4, first match wins).
 * @param {ReconciliationData} data
 * @param {{ sourceCount: number, unintentionalCount: number }} counts
 * @returns {ReconciliationStatus}
 */
function deriveStatus(data, counts) {
  if (counts.sourceCount < MINIMUM_SOURCES) return 'incomplete';
  if (!allergyStatusDocumented(data.allergyReview.allergyStatus)) return 'incomplete';
  if ((data.lineItems || []).some(lineItemNeedsReview)) return 'incomplete';
  if (counts.unintentionalCount > 0) return 'discrepancies-outstanding';
  if (anyMissingActionOrRationale(data.discrepancies || [])) return 'discrepancies-outstanding';
  return 'complete';
}

export { MINIMUM_SOURCES, HIGH_RISK_CLASSES, isIntentional, isUnintentional, anyMissingActionOrRationale, lineItemNeedsReview, allergyStatusDocumented, discrepancyTouchesHighRisk, deriveStatus };
