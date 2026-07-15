// Safety-flag detection for the Ultrasound Test Request engine
// (general, non-obstetric diagnostic ultrasound).
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-dvt-urgent, suspected-testicular-torsion,
// suspected-aaa, prep-not-met, missing-indication, missing-clinical-question,
// other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

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

  // --- Red-flag clinical categories ----------------------------------
  if (data.redFlags.suspectedTesticularTorsion === true) {
    flags.push({
      flagId: 'F-SUSPECTED-TESTICULAR-TORSION-001',
      category: 'suspected-testicular-torsion',
      priority: 'high',
      description: 'Suspected testicular torsion.',
      suggestedAction: 'Arrange emergency scrotal Doppler now and alert urology / surgery; do not delay for routine booking — the salvage window is short.'
    });
  }
  if (data.redFlags.suspectedAaa === true) {
    flags.push({
      flagId: 'F-SUSPECTED-AAA-001',
      category: 'suspected-aaa',
      priority: 'high',
      description: 'Suspected abdominal aortic aneurysm.',
      suggestedAction: 'Arrange emergency abdominal aortic ultrasound; if haemodynamically unstable or tender, treat as a surgical emergency.'
    });
  }
  if (data.redFlags.suspectedDvt === true) {
    flags.push({
      flagId: 'F-SUSPECTED-DVT-URGENT-001',
      category: 'suspected-dvt-urgent',
      priority: 'high',
      description: 'Suspected deep vein thrombosis.',
      suggestedAction: 'Arrange urgent leg-vein Doppler within the local DVT pathway; consider interim anticoagulation if the scan is delayed.'
    });
  }

  // --- Preparation / technical-suitability flags ---------------------
  if (ctx.suitabilityBand === 'caution' || ctx.suitabilityBand === 'limited') {
    flags.push({
      flagId: 'F-PREP-NOT-MET-001',
      category: 'prep-not-met',
      priority: 'medium',
      description: ctx.suitabilityBand === 'limited'
        ? 'Examination may be technically limited (preparation or body habitus).'
        : 'Required preparation has not been flagged on the request.',
      suggestedAction: ctx.prepRequirements
        ? `Confirm preparation before booking: ${ctx.prepRequirements}`
        : 'Confirm the preparation requirements with the referrer before booking.'
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

export { detectFlags };
