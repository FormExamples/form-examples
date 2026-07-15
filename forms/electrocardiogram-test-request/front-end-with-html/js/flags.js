// Safety-flag detection for the Electrocardiogram (ECG) Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-acs, active-chest-pain, syncope-red-flag,
// suspected-vt, missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.ElectrocardiogramTestRequest`.

/**
 * Detect safety flags for an ECG test request.
 *
 * @param {object} data - the request data model
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];

  // --- Red-flag clinical categories ----------------------------------
  if (
    data.symptoms.suspectedAcs === true ||
    data.request.primaryIndication === 'suspected-mi-acs'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-ACS-001',
      category: 'suspected-acs',
      priority: 'high',
      description: 'Acute coronary syndrome is suspected.',
      suggestedAction: 'Arrange same-hour emergency 12-lead ECG and senior review; follow the ACS pathway (NICE NG185).'
    });
  }
  if (
    data.symptoms.symptomChestPain === true &&
    data.symptoms.currentlySymptomatic === true
  ) {
    flags.push({
      flagId: 'F-ACTIVE-CHEST-PAIN-001',
      category: 'active-chest-pain',
      priority: 'high',
      description: 'Patient has active chest pain at the time of request.',
      suggestedAction: 'Do not delay for routine booking; perform an emergency same-hour 12-lead ECG (NICE CG95).'
    });
  }
  if (data.symptoms.symptomSyncope === true) {
    flags.push({
      flagId: 'F-SYNCOPE-RED-FLAG-001',
      category: 'syncope-red-flag',
      priority: 'high',
      description: 'Syncope or collapse reported.',
      suggestedAction: 'Urgent 12-lead ECG to exclude an arrhythmic / structural cause; consider ambulatory monitoring.'
    });
  }
  if (data.symptoms.knownArrhythmia === 'vt') {
    flags.push({
      flagId: 'F-SUSPECTED-VT-001',
      category: 'suspected-vt',
      priority: 'high',
      description: 'Known or suspected ventricular tachycardia.',
      suggestedAction: 'Urgent cardiology review; capture a 12-lead ECG during symptoms and consider continuous monitoring.'
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
      suggestedAction: 'Query the referrer for the specific question the ECG should answer.'
    });
  }

  return flags;
}

export { detectFlags };
