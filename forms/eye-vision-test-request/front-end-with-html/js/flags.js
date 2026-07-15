// Safety-flag detection for the Eye Vision Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: sudden-visual-loss-emergency, retinal-detachment-symptoms,
// acute-painful-red-eye, suspected-giant-cell-arteritis, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.EyeVisionTestRequest`.

/**
 * Detect safety flags for an eye vision test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (unused; kept for parity)
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Red-flag symptom categories -----------------------------------
  if (
    data.symptoms.suddenLoss === true ||
    data.request.primaryIndication === 'sudden-visual-loss'
  ) {
    flags.push({
      flagId: 'F-SUDDEN-VISUAL-LOSS-001',
      category: 'sudden-visual-loss-emergency',
      priority: 'high',
      description: 'Sudden visual loss reported.',
      suggestedAction: 'Arrange same-day emergency eye assessment; do not delay for routine booking.'
    });
  }
  if (
    data.symptoms.flashesFloaters === true ||
    data.request.primaryIndication === 'flashes-floaters'
  ) {
    flags.push({
      flagId: 'F-RETINAL-DETACHMENT-001',
      category: 'retinal-detachment-symptoms',
      priority: 'high',
      description: 'Flashes and/or floaters reported — possible retinal detachment.',
      suggestedAction: 'Urgent dilated fundus examination to exclude retinal tear / detachment.'
    });
  }
  if (data.symptoms.eyePain === true && data.symptoms.redEye === true) {
    flags.push({
      flagId: 'F-ACUTE-PAINFUL-RED-EYE-001',
      category: 'acute-painful-red-eye',
      priority: 'high',
      description: 'Acute painful red eye reported.',
      suggestedAction: 'Emergency slit-lamp assessment; exclude acute angle-closure glaucoma, keratitis, and uveitis.'
    });
  }
  if (
    data.request.primaryIndication === 'headache-visual-symptoms' &&
    data.symptoms.suddenLoss === true
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-GCA-001',
      category: 'suspected-giant-cell-arteritis',
      priority: 'high',
      description: 'Headache with visual symptoms and sudden visual loss — suspected giant cell arteritis.',
      suggestedAction: 'Emergency assessment; urgent ESR / CRP and consider high-dose corticosteroids per local pathway.'
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
      suggestedAction: 'Query the referrer for the specific question the examination should answer.'
    });
  }

  return flags;
}

export { detectFlags };
