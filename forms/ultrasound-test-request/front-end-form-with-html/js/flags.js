// Safety-flag detection for the (general, non-obstetric) Ultrasound Test
// Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-dvt-urgent, suspected-testicular-torsion,
// suspected-aaa, prep-not-met, missing-indication, missing-clinical-question,
// other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.UltrasoundTestRequest`.

(function () {
'use strict';
window.UltrasoundTestRequest =
  window.UltrasoundTestRequest || {};
const NS = window.UltrasoundTestRequest;

/**
 * Detect safety flags for a general ultrasound request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ suitabilityBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Red-flag symptom categories -----------------------------------
  if (data.symptoms.suspectedTesticularTorsion === true) {
    flags.push({
      flagId: 'F-SUSPECTED-TESTICULAR-TORSION-001',
      category: 'suspected-testicular-torsion',
      priority: 'high',
      description: 'Testicular torsion is suspected.',
      suggestedAction: 'Arrange immediate surgical / urology assessment; torsion is a surgical emergency — do not delay scanning for triage.'
    });
  }
  if (data.symptoms.suspectedAaa === true) {
    flags.push({
      flagId: 'F-SUSPECTED-AAA-001',
      category: 'suspected-aaa',
      priority: 'high',
      description: 'Abdominal aortic aneurysm is suspected.',
      suggestedAction: 'Arrange same-day emergency aortic ultrasound; exclude rupture / leak and involve the vascular team.'
    });
  }
  if (data.symptoms.suspectedDvt === true) {
    flags.push({
      flagId: 'F-SUSPECTED-DVT-URGENT-001',
      category: 'suspected-dvt-urgent',
      priority: 'high',
      description: 'Deep-vein thrombosis is suspected.',
      suggestedAction: 'Arrange urgent leg-vein Doppler within the local DVT pathway; consider interim anticoagulation per protocol.'
    });
  }

  // --- Preparation / technical-suitability flags ---------------------
  if (ctx.suitabilityBand === 'caution' || ctx.suitabilityBand === 'limited') {
    flags.push({
      flagId: 'F-PREP-NOT-MET-001',
      category: 'prep-not-met',
      priority: ctx.suitabilityBand === 'limited' ? 'medium' : 'low',
      description: 'Preparation or technical suitability is not fully met for this examination.',
      suggestedAction: ctx.prepRequirements
        ? `Confirm preparation with the patient: ${ctx.prepRequirements}`
        : 'Confirm the required preparation (fasting / full bladder) with the patient before booking.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the scan should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
