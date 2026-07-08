// Safety-flag detection for the Nerve Conduction Study Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-mnd-urgent, anticoag-emg-bleeding-risk,
// pacemaker-stimulation-caution, missing-indication, missing-clinical-question,
// other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.NerveConductionStudyTestRequest`.

(function () {
'use strict';
window.NerveConductionStudyTestRequest =
  window.NerveConductionStudyTestRequest || {};
const NS = window.NerveConductionStudyTestRequest;
const { involvesNeedleEmg } = NS;

/**
 * Detect safety flags for an electrodiagnostic request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Suspected motor neurone disease (expedite) --------------------
  if (data.request.primaryIndication === 'suspected-motor-neurone-disease') {
    flags.push({
      flagId: 'F-SUSPECTED-MND-URGENT-001',
      category: 'suspected-mnd-urgent',
      priority: 'high',
      description: 'Suspected motor neurone disease.',
      suggestedAction: 'Expedite as an urgent neurophysiology slot; early electrodiagnostic confirmation changes management and access to disease-modifying therapy.'
    });
  }

  // --- Needle EMG bleeding risk while anticoagulated -----------------
  if (involvesNeedleEmg(data.study.studyType) && data.safety.takingAnticoagulant === true) {
    flags.push({
      flagId: 'F-ANTICOAG-EMG-BLEEDING-RISK-001',
      category: 'anticoag-emg-bleeding-risk',
      priority: 'high',
      description: 'Needle EMG requested in an anticoagulated patient.',
      suggestedAction: 'Review anticoagulation and INR before needle EMG; consider limiting needling, deferring, or a nerve-conduction-only study.'
    });
  }

  // --- Pacemaker / ICD stimulation caution ---------------------------
  if (data.safety.pacemakerOrIcd === true) {
    flags.push({
      flagId: 'F-PACEMAKER-STIMULATION-CAUTION-001',
      category: 'pacemaker-stimulation-caution',
      priority: 'medium',
      description: 'Pacemaker or implantable cardioverter-defibrillator present.',
      suggestedAction: 'Apply stimulation-technique caution; avoid stimulating near the device and over the chest; follow local cardiac-device protocol.'
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
      suggestedAction: 'Query the referrer for the specific question the study should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
