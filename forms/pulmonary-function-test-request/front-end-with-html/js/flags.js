// Safety-flag detection for the Pulmonary Function Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: recent-mi-contraindication, active-respiratory-infection,
// suspected-tb-infection-control, haemoptysis, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a pulmonary function test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ contraindicationBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Forced-expiration contraindications ---------------------------
  if (data.safety.recentMiOrEyeAbdominalSurgery === true) {
    flags.push({
      flagId: 'F-RECENT-MI-001',
      category: 'recent-mi-contraindication',
      priority: 'high',
      description: 'Recent myocardial infarction or recent eye / thoracic / abdominal surgery.',
      suggestedAction: 'Defer forced-expiration testing; query referrer and confirm the safe interval since the event / surgery.'
    });
  }
  if (data.safety.haemoptysis === true) {
    flags.push({
      flagId: 'F-HAEMOPTYSIS-001',
      category: 'haemoptysis',
      priority: 'high',
      description: 'Haemoptysis of unknown origin reported.',
      suggestedAction: 'Defer forced expiration until the cause is investigated; expedite respiratory review.'
    });
  }

  // --- Infection-control concerns ------------------------------------
  if (data.safety.suspectedActiveTuberculosis === true) {
    flags.push({
      flagId: 'F-SUSPECTED-TB-001',
      category: 'suspected-tb-infection-control',
      priority: 'high',
      description: 'Suspected active tuberculosis.',
      suggestedAction: 'Apply infection-control precautions for shared equipment; defer until TB excluded or appropriate controls in place.'
    });
  }
  if (data.safety.recentRespiratoryInfection === true) {
    flags.push({
      flagId: 'F-ACTIVE-RESPIRATORY-INFECTION-001',
      category: 'active-respiratory-infection',
      priority: 'medium',
      description: 'Recent or active respiratory infection.',
      suggestedAction: 'Defer until recovered (typically 4-6 weeks) for infection control and result validity.'
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
      suggestedAction: 'Query the referrer for the specific question the test should answer.'
    });
  }

  return flags;
}

export { detectFlags };
