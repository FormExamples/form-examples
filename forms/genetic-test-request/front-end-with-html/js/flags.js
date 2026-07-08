// Safety-flag detection for the Genetic Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// sql/07_*_grade_flag.sql: predictive-test-counselling-required,
// consent-not-obtained, prenatal-time-critical, missing-family-history,
// missing-indication, missing-clinical-details, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.GeneticTestRequest`.

(function () {
'use strict';
window.GeneticTestRequest = window.GeneticTestRequest || {};
const NS = window.GeneticTestRequest;
const { isPredictiveTest, isPrenatalRequest } = NS;

/**
 * Detect safety flags for a genetic test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ consentBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  const consent = data.consent.consentObtained === true;
  const counselling = data.consent.geneticCounsellingOffered === true;
  const predictive = isPredictiveTest(
    data.request.testType,
    data.request.primaryIndication
  );
  const prenatal = isPrenatalRequest(
    data.request.testType,
    data.request.primaryIndication,
    data.triage.specimenType
  );

  // --- Consent & counselling (mandatory-blocking for predictive) -----
  if (predictive && !counselling) {
    flags.push({
      flagId: 'F-PREDICTIVE-COUNSELLING-001',
      category: 'predictive-test-counselling-required',
      priority: 'high',
      description: 'Predictive / presymptomatic testing without documented pre-test genetic counselling.',
      suggestedAction: 'Arrange pre-test genetic counselling before proceeding; do not process the test until counselling is documented.'
    });
  }
  if (predictive && !consent) {
    flags.push({
      flagId: 'F-PREDICTIVE-CONSENT-001',
      category: 'consent-not-obtained',
      priority: 'high',
      description: 'Predictive / presymptomatic testing without documented informed consent.',
      suggestedAction: 'Obtain and document informed consent (Record of Discussion) before proceeding.'
    });
  } else if (!consent) {
    flags.push({
      flagId: 'F-CONSENT-NOT-OBTAINED-001',
      category: 'consent-not-obtained',
      priority: 'medium',
      description: 'Informed consent for genomic testing has not been documented.',
      suggestedAction: 'Confirm and record informed consent (Record of Discussion) before the test is processed.'
    });
  }

  // --- Triage urgency ------------------------------------------------
  if (prenatal) {
    flags.push({
      flagId: 'F-PRENATAL-TIME-CRITICAL-001',
      category: 'prenatal-time-critical',
      priority: 'high',
      description: 'Prenatal request is time-critical; the result is needed within the prenatal decision window.',
      suggestedAction: 'Expedite specimen receipt and analysis; confirm the gestational decision deadline with the referrer.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication and map it to a Test Directory clinical indication before vetting.'
    });
  }
  if (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details / phenotype recorded.',
      suggestedAction: 'Query the referrer for the clinical details and phenotype (e.g. HPO terms) needed for test selection.'
    });
  }
  if (!data.clinical.familyHistory || data.clinical.familyHistory.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-FAMILY-HISTORY-001',
      category: 'missing-family-history',
      priority: 'low',
      description: 'No family history recorded.',
      suggestedAction: 'Request a family history / pedigree summary; inheritance pattern informs eligibility and test selection.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
