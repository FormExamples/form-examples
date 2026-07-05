// Compliance-and-wellbeing flag detection for the Neurodiversity Adjustment
// Request engine.
//
// Pure function returning flags using the grade_flag categories from SQL
// migration 07: disability-duty-engaged, burnout-risk, no-consent-to-share,
// missing-adjustments, missing-difficulties, access-to-work-recommended,
// occupational-health-recommended, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Some flags depend on the computed eligibility / impact bands, supplied via
// the `context` argument. Wrapped in an IIFE; published via
// `window.NeurodiversityAdjustmentRequest`.

(function () {
'use strict';
window.NeurodiversityAdjustmentRequest =
  window.NeurodiversityAdjustmentRequest || {};
const NS = window.NeurodiversityAdjustmentRequest;
const { anyAdjustment, anyDifficulty } = NS;

/**
 * Detect compliance-and-wellbeing flags for a reasonable-adjustments request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - engine context: { eligibilityBand, impactBand }
 * @returns {object[]} flags
 */
function detectFlags(data, context) {
  const ctx = context || {};
  const flags = [];
  const p = data.profile;
  const impact = data.impact;
  const adj = data.adjustments;
  const evidence = data.evidence;

  // --- Equality Act duty engaged --------------------------------------
  if (ctx.eligibilityBand === 'likely-covered') {
    flags.push({
      flagId: 'F-DISABILITY-DUTY-001',
      category: 'disability-duty-engaged',
      priority: 'high',
      description: 'The Equality Act 2010 duty to make reasonable adjustments is likely engaged.',
      suggestedAction: 'Treat as a formal request; arrange a meeting and respond without unreasonable delay.'
    });
  }

  // --- Burnout / absence risk -----------------------------------------
  if (impact.atRiskOfAbsence === true) {
    flags.push({
      flagId: 'F-BURNOUT-RISK-001',
      category: 'burnout-risk',
      priority: 'high',
      description: 'Worker at risk of sickness absence or burnout.',
      suggestedAction: 'Prioritise; consider interim adjustments now.'
    });
  } else if (impact.currentImpact === 'severe' || data.difficulties.difficultyBurnoutWellbeing === true) {
    flags.push({
      flagId: 'F-BURNOUT-RISK-001',
      category: 'burnout-risk',
      priority: 'medium',
      description: 'Fatigue / burnout or severe impact reported.',
      suggestedAction: 'Monitor wellbeing; consider adjustments promptly.'
    });
  }

  // --- No consent to share --------------------------------------------
  if (p.disclosureConsent === false) {
    flags.push({
      flagId: 'F-NO-CONSENT-001',
      category: 'no-consent-to-share',
      priority: 'medium',
      description: 'Worker has not consented to share details with HR / occupational health.',
      suggestedAction: 'Handle sensitively; seek explicit consent before sharing.'
    });
  }

  // --- Missing requested adjustments ----------------------------------
  if (!anyAdjustment(data) && (!adj.adjustmentsRequestedDetail || adj.adjustmentsRequestedDetail.trim() === '')) {
    flags.push({
      flagId: 'F-MISSING-ADJUSTMENTS-001',
      category: 'missing-adjustments',
      priority: 'medium',
      description: 'No specific adjustments requested.',
      suggestedAction: 'Ask the worker what adjustments would help, or explore options together.'
    });
  }

  // --- Missing functional difficulties --------------------------------
  if (!anyDifficulty(data)) {
    flags.push({
      flagId: 'F-MISSING-DIFFICULTIES-001',
      category: 'missing-difficulties',
      priority: 'medium',
      description: 'No functional difficulties identified.',
      suggestedAction: 'Clarify the tasks and situations where the worker is disadvantaged.'
    });
  }

  // --- Access to Work recommended -------------------------------------
  if (adj.adjustmentEquipmentTechnology === true && evidence.accessToWorkInvolved === false) {
    flags.push({
      flagId: 'F-ACCESS-TO-WORK-001',
      category: 'access-to-work-recommended',
      priority: 'low',
      description: 'Equipment / technology adjustment requested without Access to Work involvement.',
      suggestedAction: 'Signpost the government Access to Work scheme for funding and assessment.'
    });
  }

  // --- Occupational health recommended --------------------------------
  if (ctx.impactBand === 'high-risk' && evidence.occupationalHealthInvolved === false) {
    flags.push({
      flagId: 'F-OCC-HEALTH-001',
      category: 'occupational-health-recommended',
      priority: 'medium',
      description: 'High wellbeing risk without occupational-health input.',
      suggestedAction: 'Consider an occupational-health referral to identify and confirm adjustments.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
