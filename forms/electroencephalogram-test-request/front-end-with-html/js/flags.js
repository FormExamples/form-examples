// Safety-flag detection for the Electroencephalogram (EEG) Test Request
// engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-status-epilepticus, recent-first-seizure,
// encephalopathy, eeg-not-to-exclude-epilepsy, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.ElectroencephalogramTestRequest`.

(function () {
'use strict';
window.ElectroencephalogramTestRequest =
  window.ElectroencephalogramTestRequest || {};
const NS = window.ElectroencephalogramTestRequest;

// Phrases that imply the EEG is being requested to rule out / exclude
// epilepsy — contrary to NICE NG217.
const EXCLUDE_EPILEPSY_PATTERNS = [
  'exclude epilepsy',
  'rule out epilepsy',
  'rule-out epilepsy',
  'rule out seizure',
  'exclude seizure',
  'is this epilepsy',
  'normal eeg to reassure',
  'confirm not epilepsy',
  'not epilepsy'
];

/**
 * Detect safety flags for an EEG test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (unused; kept for parity)
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Red-flag categories -------------------------------------------
  if (
    data.redFlags.suspectedStatusEpilepticus === true ||
    data.request.primaryIndication === 'status-epilepticus'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-STATUS-EPILEPTICUS-001',
      category: 'suspected-status-epilepticus',
      priority: 'high',
      description: 'Suspected status epilepticus.',
      suggestedAction: 'Arrange emergency EEG and escalate to the on-call neurology / neurophysiology team; do not delay for routine booking.'
    });
  }
  if (
    data.redFlags.recentSeizure === true &&
    (data.context.firstSeizure === true || data.request.primaryIndication === 'first-seizure')
  ) {
    flags.push({
      flagId: 'F-RECENT-FIRST-SEIZURE-001',
      category: 'recent-first-seizure',
      priority: 'high',
      description: 'Recent first unprovoked seizure.',
      suggestedAction: 'Expedite EEG via first-seizure pathway; an early EEG increases the diagnostic yield of interictal discharges.'
    });
  }
  if (data.request.primaryIndication === 'encephalopathy') {
    flags.push({
      flagId: 'F-ENCEPHALOPATHY-001',
      category: 'encephalopathy',
      priority: 'high',
      description: 'Encephalopathy indication.',
      suggestedAction: 'Urgent EEG to characterise diffuse cerebral dysfunction and exclude non-convulsive status epilepticus.'
    });
  }

  // --- Guideline-misuse flag (NICE NG217) ----------------------------
  if (impliesExcludeEpilepsy(data)) {
    flags.push({
      flagId: 'F-EEG-NOT-TO-EXCLUDE-EPILEPSY-001',
      category: 'eeg-not-to-exclude-epilepsy',
      priority: 'medium',
      description: 'Clinical question implies the EEG is being used to exclude epilepsy.',
      suggestedAction: 'Per NICE NG217, EEG must not be used to exclude a diagnosis of epilepsy nor in isolation; query the referrer.'
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
      suggestedAction: 'Query the referrer for the specific question the EEG should answer.'
    });
  }

  return flags;
}

/** True when the clinical question text implies EEG is to exclude epilepsy. */
function impliesExcludeEpilepsy(d) {
  const q = String(d.request.clinicalQuestion || '').toLowerCase();
  if (!q) return false;
  return EXCLUDE_EPILEPSY_PATTERNS.some((p) => q.includes(p));
}

Object.assign(NS, { detectFlags });
})();
