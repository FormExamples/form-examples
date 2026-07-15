// Declarative SMR scoring rules and banding functions.
//
// The Structured Medication Review is a documentation form with *partial
// scoring*: rather than one numeric score, the engine derives a review status,
// an anticholinergic burden sum + band, a polypharmacy band, a composite burden
// band, and per-medicine STOPP/START flags. The pure banding functions below
// implement the boundaries from spec §4; `grader.js` calls them and records the
// firings in an audit trail that mirrors the
// `structured_medication_review_grade_rule` SQL table (rule_id, category,
// description).
//
// Boundaries (spec §4):
//   polypharmacyBand    = regular >= 10 ? 'hyperpolypharmacy'
//                       : regular >= 5  ? 'polypharmacy' : 'none'
//   anticholinergicBand = acbScore >= 3 ? 'significant' : 'low'
//   burdenBand          = (regular >= 10 || acbScore >= 3) ? 'high'
//                       : (regular >= 5)                   ? 'moderate' : 'low'

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 * @typedef {import('./types.js').PolypharmacyBand} PolypharmacyBand
 * @typedef {import('./types.js').AnticholinergicBand} AnticholinergicBand
 * @typedef {import('./types.js').BurdenBand} BurdenBand
 */

/** Polypharmacy boundary thresholds (regular-medicine count). */
const POLYPHARMACY_THRESHOLD = 5;
const HYPERPOLYPHARMACY_THRESHOLD = 10;

/** Anticholinergic burden significance threshold (ACB sum). */
const ACB_SIGNIFICANT_THRESHOLD = 3;

/**
 * Band the regular-medicine count into a polypharmacy band.
 * @param {number} regularCount
 * @returns {PolypharmacyBand}
 */
function polypharmacyBandFor(regularCount) {
  if (regularCount >= HYPERPOLYPHARMACY_THRESHOLD) return 'hyperpolypharmacy';
  if (regularCount >= POLYPHARMACY_THRESHOLD) return 'polypharmacy';
  return 'none';
}

/**
 * Band the anticholinergic burden sum. Significant at 3 or more.
 * @param {number} acbScore
 * @returns {AnticholinergicBand}
 */
function anticholinergicBandFor(acbScore) {
  return acbScore >= ACB_SIGNIFICANT_THRESHOLD ? 'significant' : 'low';
}

/**
 * Composite burden band — the worse of the polypharmacy and anticholinergic
 * bands (max-band algorithm).
 * @param {number} regularCount
 * @param {number} acbScore
 * @returns {BurdenBand}
 */
function burdenBandFor(regularCount, acbScore) {
  if (regularCount >= HYPERPOLYPHARMACY_THRESHOLD ||
      acbScore >= ACB_SIGNIFICANT_THRESHOLD) {
    return 'high';
  }
  if (regularCount >= POLYPHARMACY_THRESHOLD) return 'moderate';
  return 'low';
}

/**
 * Determine whether the required sections are complete (spec §4). The review is
 * `complete` only when: the problems section is filled; every medicine has a
 * non-empty indication and an adherence other than unknown; the monitoring
 * section is reviewed; whatMattersToPatient and sharedDecisions are recorded;
 * and reviewCompleted == 'yes'.
 *
 * @param {ReviewData} data
 * @returns {boolean}
 */
function requiredSectionsComplete(data) {
  const problemsFilled = (data.problems.presentingProblems || '').trim() !== '';
  const medicines = data.medicines || [];
  const everyMedicineDocumented =
    medicines.length > 0 &&
    medicines.every((m) =>
      (m.indication || '').trim() !== '' &&
      m.adherence !== '' &&
      m.adherence !== 'unknown'
    );
  const monitoringReviewed = (data.monitoring.monitoringDue || '').trim() !== '';
  const whatMattersRecorded =
    (data.problems.whatMattersToPatient || '').trim() !== '';
  const sharedDecisionsRecorded =
    (data.goals.sharedDecisions || '').trim() !== '';
  const reviewMarkedDone = data.plan.reviewCompleted === 'yes';

  return (
    problemsFilled &&
    everyMedicineDocumented &&
    monitoringReviewed &&
    whatMattersRecorded &&
    sharedDecisionsRecorded &&
    reviewMarkedDone
  );
}

export { POLYPHARMACY_THRESHOLD, HYPERPOLYPHARMACY_THRESHOLD, ACB_SIGNIFICANT_THRESHOLD, polypharmacyBandFor, anticholinergicBandFor, burdenBandFor, requiredSectionsComplete };
