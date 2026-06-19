// Safety-flag detection for the Electrocardiogram (ECG) Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-acs, active-chest-pain, syncope-red-flag,
// suspected-vt, missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.ElectrocardiogramTestRequest`.

(function () {
'use strict';
window.ElectrocardiogramTestRequest =
  window.ElectrocardiogramTestRequest || {};
const NS = window.ElectrocardiogramTestRequest;
const { activeChestPain } = NS;

/**
 * Detect safety flags for an ECG test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (unused; for parity)
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Red-flag symptom categories -----------------------------------
  if (data.symptoms.suspectedAcs === true) {
    flags.push({
      flagId: 'F-SUSPECTED-ACS-001',
      category: 'suspected-acs',
      priority: 'high',
      description: 'Acute coronary syndrome is suspected.',
      suggestedAction: 'Arrange a same-hour emergency 12-lead ECG and senior review; do not delay for routine booking.'
    });
  }
  if (activeChestPain(data)) {
    flags.push({
      flagId: 'F-ACTIVE-CHEST-PAIN-001',
      category: 'active-chest-pain',
      priority: 'high',
      description: 'Patient has active chest pain at the time of request.',
      suggestedAction: 'Same-hour 12-lead ECG; assess for ACS per NICE CG95 / NG185 and escalate if abnormal.'
    });
  }
  if (data.symptoms.symptomSyncope === true || data.request.primaryIndication === 'syncope') {
    flags.push({
      flagId: 'F-SYNCOPE-RED-FLAG-001',
      category: 'syncope-red-flag',
      priority: 'high',
      description: 'Syncope or collapse reported.',
      suggestedAction: 'Urgent ECG to exclude an arrhythmic cause; consider ambulatory or event monitoring if recurrent.'
    });
  }
  if (data.symptoms.knownArrhythmia === 'vt') {
    flags.push({
      flagId: 'F-SUSPECTED-VT-001',
      category: 'suspected-vt',
      priority: 'high',
      description: 'Known or suspected ventricular tachycardia.',
      suggestedAction: 'Emergency assessment; same-hour 12-lead ECG and continuous cardiac monitoring.'
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

Object.assign(NS, { detectFlags });
})();
