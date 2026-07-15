// Safety-flag detection for the X-Ray Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: pregnancy, repeat-recent-imaging, unjustified-exposure,
// wrong-laterality-risk, missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.XRayTestRequest`.

// Regions where laterality (left / right) is clinically meaningful, so a
// missing or not-applicable laterality risks imaging the wrong side.
const LATERALISED_REGIONS = [
  'hip', 'knee', 'ankle-foot', 'shoulder', 'wrist-hand'
];

/**
 * Detect safety flags for a plain-radiograph (X-ray) request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ doseBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Pregnancy / radiation -----------------------------------------
  if (data.safety.pregnancyStatus === 'pregnant') {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Patient is pregnant; ionising-radiation exposure to the conceptus must be justified.',
      suggestedAction: 'Apply IR(ME)R pregnancy procedure; justify or defer; shield and minimise dose if it proceeds.'
    });
  } else if (data.safety.pregnancyStatus === 'possible' || data.safety.pregnancyStatus === 'unknown') {
    flags.push({
      flagId: 'F-PREGNANCY-002',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Pregnancy status is possible or unknown.',
      suggestedAction: 'Confirm pregnancy status (LMP / pregnancy test) before exposure.'
    });
  }

  // --- Repeat / recent imaging ---------------------------------------
  if (data.safety.recentSimilarXray === true) {
    flags.push({
      flagId: 'F-REPEAT-RECENT-IMAGING-001',
      category: 'repeat-recent-imaging',
      priority: 'medium',
      description: 'A similar X-ray of the same region was recently performed.',
      suggestedAction: 'Review prior imaging on PACS; avoid an unnecessary repeat exposure.'
    });
  }

  // --- Unjustified exposure ------------------------------------------
  if (!data.safety.irMeRJustification || data.safety.irMeRJustification.trim() === '') {
    flags.push({
      flagId: 'F-UNJUSTIFIED-EXPOSURE-001',
      category: 'unjustified-exposure',
      priority: 'high',
      description: 'No IR(ME)R justification recorded for the exposure.',
      suggestedAction: 'Obtain the referrer justification before the exposure can be authorised.'
    });
  }

  // --- Wrong-laterality risk -----------------------------------------
  if (
    LATERALISED_REGIONS.includes(data.request.bodyRegion) &&
    (!data.request.laterality || data.request.laterality === 'not-applicable')
  ) {
    flags.push({
      flagId: 'F-WRONG-LATERALITY-RISK-001',
      category: 'wrong-laterality-risk',
      priority: 'high',
      description: `Laterality is not specified for a ${data.request.bodyRegion} request, which risks imaging the wrong side.`,
      suggestedAction: 'Confirm left / right / bilateral with the referrer before booking.'
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
  if (!data.detail.clinicalQuestion || data.detail.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the X-ray should answer.'
    });
  }

  // --- Other ---------------------------------------------------------
  if (ctx.doseBand === 'high') {
    flags.push({
      flagId: 'F-HIGH-DOSE-001',
      category: 'other',
      priority: 'low',
      description: 'Requested region carries a relatively high effective dose.',
      suggestedAction: 'Confirm the examination is justified and optimise the technique (ALARP).'
    });
  }

  return flags;
}

export { detectFlags };
