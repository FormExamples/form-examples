import { classificationRules } from './rules.js';

// Cervical-screening grader. Pure functions: take a `ScreeningData` object,
// apply the gated first-match classification cascade in `classificationRules`,
// and return the result class, the recommended management action, a
// completeness status, and the audit trail of the winning rule.
//
// Classification algorithm (spec §4), applied top-to-bottom, first match wins:
//   not eligible (age < 25 / age > 64, or ceased) -> cease-not-eligible / cease-screening
//   sampleAdequacy == 'inadequate'                -> inadequate / repeat-sample-3-months
//   hpvResult == 'negative'                       -> hpv-negative / routine-recall
//   hpvResult == 'positive':
//     cytologyGrade 'negative'                    -> hpv-positive-cytology-normal / early-repeat-12-months
//     cytologyGrade 'borderline' | 'low-grade'    -> hpv-positive-cytology-abnormal-low / colposcopy-referral
//     cytologyGrade 'high-grade'                  -> hpv-positive-cytology-abnormal-high / urgent-colposcopy-referral
//     else                                        -> hpv-positive-cytology-pending / awaiting-cytology
//   otherwise (hrHPV missing / not-tested)        -> pending / awaiting-result
//
// This is a result-classification outcome, not a numeric score.

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').ResultClass} ResultClass
 * @typedef {import('./types.js').ManagementAction} ManagementAction
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Completeness: the reached branch has its determining inputs present. A
 * result classification is `complete` when eligibility (age), consent, sample
 * adequacy, and the required result fields for the reached branch are all
 * recorded; otherwise `incomplete`.
 * @param {ScreeningData} d
 * @param {ResultClass} resultClass
 * @returns {Status}
 */
function computeStatus(d, resultClass) {
  const ageKnown = d.identification.age !== null;
  const ceased = d.eligibility.previouslyCeased === 'yes';
  const consentPresent = d.consent.consentGiven !== '';
  const adequacyPresent = d.adequacy.sampleAdequacy !== '';

  switch (resultClass) {
    case 'cease-not-eligible':
      // Determined once age is known or the person is recorded as ceased.
      return ageKnown || ceased ? 'complete' : 'incomplete';
    case 'inadequate':
    case 'hpv-negative':
    case 'hpv-positive-cytology-normal':
    case 'hpv-positive-cytology-abnormal-low':
    case 'hpv-positive-cytology-abnormal-high':
      return ageKnown && consentPresent && adequacyPresent
        ? 'complete'
        : 'incomplete';
    default:
      // pending / awaiting-cytology branches are inherently incomplete.
      return 'incomplete';
  }
}

/**
 * Compute the full classification for the supplied screening data.
 * @param {ScreeningData} data
 * @returns {{ resultClass: ResultClass, managementAction: ManagementAction,
 *             status: Status, firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  /** @type {import('./rules.js').ClassificationRule} */
  let winner = classificationRules[classificationRules.length - 1];
  for (const rule of classificationRules) {
    try {
      if (rule.evaluate(data)) {
        winner = rule;
        break;
      }
    } catch (e) {
      console.warn(`Cervical-screening rule ${rule.id} evaluation failed:`, e);
    }
  }

  const resultClass = winner.resultClass;
  const managementAction = winner.managementAction;
  const status = computeStatus(data, resultClass);

  /** @type {FiredRule[]} */
  const firedRules = [
    {
      id: winner.id,
      category: winner.category,
      resultClass: winner.resultClass,
      managementAction: winner.managementAction,
      description: winner.description
    }
  ];

  return { resultClass, managementAction, status, firedRules };
}

export { calculateGrade, computeStatus };
