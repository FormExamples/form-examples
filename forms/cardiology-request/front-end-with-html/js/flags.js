// Safety-flag detection for the Cardiology Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-acs, exertional-syncope, new-onset-heart-failure,
// red-flag-chest-pain, missing-reason, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a cardiology referral request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (unused here)
 * @returns {object[]} safety flags
 */
function detectFlags(data /*, context */) {
  const flags = [];

  // --- Acute red flags ------------------------------------------------
  if (data.redFlags.suspectedAcs === true || data.redFlags.troponinStatus === 'elevated') {
    flags.push({
      flagId: 'F-SUSPECTED-ACS-001',
      category: 'suspected-acs',
      priority: 'high',
      description: 'Suspected acute coronary syndrome (red flag or elevated troponin).',
      suggestedAction: 'Divert to the emergency ACS pathway; do not wait for a routine cardiology clinic.'
    });
  }
  if (data.redFlags.exertionalSyncope === true) {
    flags.push({
      flagId: 'F-EXERTIONAL-SYNCOPE-001',
      category: 'exertional-syncope',
      priority: 'high',
      description: 'Exertional syncope reported.',
      suggestedAction: 'Arrange urgent cardiology review for a possible structural / arrhythmic cause.'
    });
  }
  if (data.redFlags.newOnsetHeartFailure === true) {
    flags.push({
      flagId: 'F-NEW-ONSET-HEART-FAILURE-001',
      category: 'new-onset-heart-failure',
      priority: 'high',
      description: 'New-onset heart failure reported.',
      suggestedAction: 'Arrange urgent heart-failure assessment per NICE NG106 (within 2 weeks if BNP elevated).'
    });
  }
  if (data.symptoms.symptomChestPain === true && data.symptoms.chestPainCharacter === 'typical-angina') {
    flags.push({
      flagId: 'F-RED-FLAG-CHEST-PAIN-001',
      category: 'red-flag-chest-pain',
      priority: 'medium',
      description: 'Typical-angina chest pain reported.',
      suggestedAction: 'Expedite rapid-access chest-pain assessment (NICE CG95).'
    });
  }

  // --- Completeness / data-quality flags ------------------------------
  if (!data.request.referralReason) {
    flags.push({
      flagId: 'F-MISSING-REASON-001',
      category: 'missing-reason',
      priority: 'medium',
      description: 'No referral reason recorded.',
      suggestedAction: 'Query the referrer for the primary reason for referral before vetting.'
    });
  }
  if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the cardiology team should answer.'
    });
  }

  return flags;
}

export { detectFlags };
