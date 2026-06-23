// Safety-flag detection for the Bronchoscopy Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, massive-haemoptysis-emergency,
// high-bleeding-risk-anticoag, hypoxia, asa-iv, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.BronchoscopyTestRequest`.

(function () {
'use strict';
window.BronchoscopyTestRequest =
  window.BronchoscopyTestRequest || {};
const NS = window.BronchoscopyTestRequest;

/**
 * Detect safety flags for a bronchoscopy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ twoWeekWaitEligible })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Massive haemoptysis emergency ---------------------------------
  if (
    data.symptoms.symptomHaemoptysis === true &&
    data.symptoms.haemoptysisSeverity === 'massive'
  ) {
    flags.push({
      flagId: 'F-MASSIVE-HAEMOPTYSIS-EMERGENCY-001',
      category: 'massive-haemoptysis-emergency',
      priority: 'high',
      description: 'Massive haemoptysis reported — life-threatening airway emergency.',
      suggestedAction: 'Immediate emergency assessment with airway protection; do not delay for routine booking.'
    });
  }

  // --- Suspected cancer two-week-wait --------------------------------
  if (
    data.request.primaryIndication === 'suspected-lung-cancer' ||
    data.request.primaryIndication === 'lung-mass-on-imaging' ||
    ctx.twoWeekWaitEligible === true
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Request meets NICE NG12 suspected-cancer criteria.',
      suggestedAction: 'Expedite onto the two-week-wait lung-cancer pathway.'
    });
  }

  // --- High bleeding risk (anticoagulation) --------------------------
  if (data.bleeding.takingAnticoagulant === true) {
    const agent = data.bleeding.anticoagulantAgent
      ? ` (${data.bleeding.anticoagulantAgent})`
      : '';
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: `Patient is taking an anticoagulant${agent} — high bleeding risk for biopsy.`,
      suggestedAction: 'Confirm anticoagulant omission / bridging plan before any endobronchial biopsy.'
    });
  }
  if (
    data.bleeding.plateletCount !== null &&
    data.bleeding.plateletCount !== undefined &&
    data.bleeding.plateletCount < 50
  ) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-PLATELETS-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: `Platelet count is low (${data.bleeding.plateletCount} x10^9/L) — high bleeding risk.`,
      suggestedAction: 'Correct thrombocytopenia or avoid biopsy until platelets are adequate.'
    });
  }

  // --- Hypoxia -------------------------------------------------------
  if (data.procedural.oxygenDependent === true) {
    flags.push({
      flagId: 'F-HYPOXIA-001',
      category: 'hypoxia',
      priority: 'high',
      description: 'Patient is oxygen-dependent (hypoxia).',
      suggestedAction: 'Plan oxygenation / ventilation strategy; consider anaesthetic support and a higher-care setting.'
    });
  }

  // --- ASA IV --------------------------------------------------------
  if (data.procedural.asaGrade === 'IV' || data.procedural.asaGrade === 'V') {
    flags.push({
      flagId: 'F-ASA-IV-001',
      category: 'asa-iv',
      priority: 'medium',
      description: `ASA grade ${data.procedural.asaGrade} — severe systemic disease / high procedural risk.`,
      suggestedAction: 'Anaesthetic / critical-care review before the procedure; weigh risk against benefit.'
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
      suggestedAction: 'Query the referrer for the specific question the procedure should answer.'
    });
  }

  // --- Other ---------------------------------------------------------
  if (
    !data.symptoms.imagingFindings ||
    data.symptoms.imagingFindings.trim() === ''
  ) {
    flags.push({
      flagId: 'F-MISSING-IMAGING-001',
      category: 'other',
      priority: 'low',
      description: 'No supporting imaging findings recorded.',
      suggestedAction: 'Confirm recent chest imaging (x-ray / CT) is available before the procedure.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
