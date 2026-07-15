import { mandatoryFor } from './rules.js';

// General Practitioner Referral Letter grader. Pure functions: take a
// `Referral` object, evaluate the mandatory-field set for the selected urgency
// (`mandatoryFor`), and derive the completeness status, completeness percentage,
// and echoed urgency classification.
//
// Grading algorithm (spec §4):
//   mandatory  = mandatoryFor(referral)           // urgency-dependent field set
//   present    = mandatory.filter(isPresent)
//   completenessPercent = round(100 * present.length / mandatory.length)
//   status     = present.length == mandatory.length ? 'Complete' : 'Incomplete'
//   urgency    = referral.urgencyInfo.urgency      // echoed classification
//   firedRules = each mandatory field with { satisfied: boolean }
//
// There is NO numeric clinical score. The engine reports; it never blocks
// sending — the referrer decides. Urgency is always echoed, even when the
// referral is `Incomplete`, so the pathway is never hidden by an unfinished
// form.

/**
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').Urgency} Urgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.GeneralPractitionerReferralLetter.

/**
 * Evaluate the mandatory-field set against the referral, returning one
 * FiredRule per applicable mandatory field with its satisfied state.
 * @param {Referral} referral
 * @returns {FiredRule[]}
 */
function evaluateRules(referral) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const field of mandatoryFor(referral)) {
    let satisfied = false;
    try {
      satisfied = field.present(referral) === true;
    } catch (e) {
      console.warn(`Referral rule ${field.id} evaluation failed:`, e);
    }
    fired.push({
      id: field.id,
      rule: field.rule,
      satisfied,
      category: field.category,
      description: field.description
    });
  }
  return fired;
}

/**
 * Count present mandatory fields over the mandatory fields that apply for the
 * selected urgency.
 * @param {Referral} referral
 * @returns {{ presentCount: number, mandatoryCount: number,
 *             completenessPercent: number, allPresent: boolean }}
 */
function completeness(referral) {
  const mandatory = mandatoryFor(referral);
  let present = 0;
  for (const field of mandatory) {
    if (field.present(referral) === true) present++;
  }
  const mandatoryCount = mandatory.length;
  const completenessPercent =
    mandatoryCount === 0 ? 0 : Math.round((100 * present) / mandatoryCount);
  return {
    presentCount: present,
    mandatoryCount,
    completenessPercent,
    allPresent: mandatoryCount > 0 && present === mandatoryCount
  };
}

/**
 * Echo the selected urgency as the classification. The four values map directly
 * to the pathways in index.md; '' when not yet selected.
 * @param {Referral} referral
 * @returns {Urgency}
 */
function classifyUrgency(referral) {
  return referral.urgencyInfo.urgency;
}

/**
 * Compute the full completeness grade and echoed urgency for the referral.
 * @param {Referral} referral
 * @returns {{ status: Status, urgency: Urgency, completenessPercent: number,
 *             presentCount: number, mandatoryCount: number,
 *             firedRules: FiredRule[] }}
 */
function gradeReferral(referral) {
  const firedRules = evaluateRules(referral);
  const c = completeness(referral);

  /** @type {Status} */
  const status = c.allPresent ? 'Complete' : 'Incomplete';

  return {
    status,
    urgency: classifyUrgency(referral),
    completenessPercent: c.completenessPercent,
    presentCount: c.presentCount,
    mandatoryCount: c.mandatoryCount,
    firedRules
  };
}

export { evaluateRules, completeness, classifyUrgency, gradeReferral };
