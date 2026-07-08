// Safety-flag detection for the Allergy Skin Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: previous-anaphylaxis-resus-ready,
// antihistamines-invalidate-test, beta-blocker-caution, active-skin-disease,
// missing-indication, missing-clinical-details, no-allergen-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.AllergySkinTestRequest`.

(function () {
'use strict';
window.AllergySkinTestRequest =
  window.AllergySkinTestRequest || {};
const NS = window.AllergySkinTestRequest;
const { countSelectedPanels } = NS;

// Test types whose validity is suppressed by antihistamines / skin disease.
const SKIN_TEST_TYPES = ['skin-prick-test', 'intradermal-test'];

/**
 * Detect safety flags for an allergy test request.
 *
 * @param {object} data - the request data model
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];
  const test = data.test;
  const safety = data.safety;
  const isSkinTest = SKIN_TEST_TYPES.includes(test.testType);

  // --- Safety-critical history ---------------------------------------
  if (safety.previousAnaphylaxis === true) {
    flags.push({
      flagId: 'F-PREVIOUS-ANAPHYLAXIS-001',
      category: 'previous-anaphylaxis-resus-ready',
      priority: 'high',
      description: 'Patient has a history of anaphylaxis.',
      suggestedAction: 'Perform testing in a resuscitation-ready setting with adrenaline and trained staff immediately available.'
    });
  }

  // --- Validity / safety medication flags ----------------------------
  if (safety.onAntihistamines === true && isSkinTest) {
    flags.push({
      flagId: 'F-ANTIHISTAMINES-INVALIDATE-001',
      category: 'antihistamines-invalidate-test',
      priority: 'high',
      description: 'Patient is on antihistamines — skin-prick / intradermal testing will be invalid.',
      suggestedAction: 'Stop antihistamines for an appropriate washout (typically five half-lives) before testing, or use specific-IgE blood testing instead.'
    });
  } else if (safety.onAntihistamines === true) {
    flags.push({
      flagId: 'F-ANTIHISTAMINES-NOTE-001',
      category: 'antihistamines-invalidate-test',
      priority: 'low',
      description: 'Patient is on antihistamines.',
      suggestedAction: 'Antihistamines do not affect specific-IgE blood testing, but would invalidate a skin test — confirm the requested modality.'
    });
  }

  if (safety.onBetaBlocker === true) {
    flags.push({
      flagId: 'F-BETA-BLOCKER-CAUTION-001',
      category: 'beta-blocker-caution',
      priority: safety.previousAnaphylaxis === true ? 'high' : 'medium',
      description: safety.previousAnaphylaxis === true
        ? 'Beta-blocker with a history of anaphylaxis — adrenaline may be less effective.'
        : 'Patient is on a beta-blocker.',
      suggestedAction: 'Review whether the beta-blocker can be safely withheld; ensure resuscitation readiness before any provocation or skin testing.'
    });
  }

  if (safety.currentSkinDisease === true && isSkinTest) {
    flags.push({
      flagId: 'F-ACTIVE-SKIN-DISEASE-001',
      category: 'active-skin-disease',
      priority: 'medium',
      description: 'Active skin disease at the proposed test site (e.g. eczema, dermographism).',
      suggestedAction: 'Identify a clear test site or defer skin testing until the skin settles; consider specific-IgE blood testing.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (countSelectedPanels(test) === 0) {
    flags.push({
      flagId: 'F-NO-ALLERGEN-SELECTED-001',
      category: 'no-allergen-selected',
      priority: 'medium',
      description: 'No allergen panel has been selected.',
      suggestedAction: 'Select at least one allergen panel before vetting; the test cannot be performed as requested.'
    });
  }
  if (!data.indication.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.indication.clinicalDetails || data.indication.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'low',
      description: 'No relevant clinical details / history recorded.',
      suggestedAction: 'Query the referrer for the reaction history, timing, and suspected triggers.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
