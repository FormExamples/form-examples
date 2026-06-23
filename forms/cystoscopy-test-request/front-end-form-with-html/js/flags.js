// Safety-flag detection for the Cystoscopy Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// sql/07: suspected-cancer-2ww, visible-haematuria, active-uti-defer,
// high-bleeding-risk-anticoag, missing-indication, missing-clinical-question,
// other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.CystoscopyTestRequest`.

(function () {
'use strict';
window.CystoscopyTestRequest =
  window.CystoscopyTestRequest || {};
const NS = window.CystoscopyTestRequest;

/**
 * Detect safety flags for a cystoscopy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ twoWeekWaitEligible })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Suspected-cancer two-week-wait --------------------------------
  if (ctx.twoWeekWaitEligible === true ||
      data.request.primaryIndication === 'suspected-bladder-tumour') {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Request meets a NICE NG12 suspected-cancer two-week-wait threshold.',
      suggestedAction: 'Refer on the suspected-cancer two-week-wait pathway; book the cystoscopy within 14 days.'
    });
  }

  // --- Visible haematuria --------------------------------------------
  if (data.symptoms.visibleHaematuria === true ||
      data.request.primaryIndication === 'visible-haematuria') {
    flags.push({
      flagId: 'F-VISIBLE-HAEMATURIA-001',
      category: 'visible-haematuria',
      priority: 'high',
      description: 'Visible (macroscopic) haematuria reported.',
      suggestedAction: 'Per BAUS, any episode of visible haematuria warrants urological assessment including cystoscopy and upper-tract imaging.'
    });
  }

  // --- Active UTI defer ----------------------------------------------
  if (data.symptoms.currentUti === true) {
    flags.push({
      flagId: 'F-ACTIVE-UTI-DEFER-001',
      category: 'active-uti-defer',
      priority: 'high',
      description: 'Active urinary tract infection at the time of request.',
      suggestedAction: 'Defer instrumentation: treat the active UTI first and reschedule once resolved to avoid urosepsis.'
    });
  }

  // --- High bleeding risk on anticoagulation -------------------------
  if (data.bleeding.takingAnticoagulant === true) {
    const agent = (data.bleeding.anticoagulantAgent || '').trim();
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'medium',
      description: agent
        ? `Patient is anticoagulated (${agent}) — high bleeding risk.`
        : 'Patient is anticoagulated — high bleeding risk.',
      suggestedAction: 'Confirm the agent and indication; plan peri-procedure hold / bridging per local anticoagulation policy before any biopsy or resection.'
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
      suggestedAction: 'Query the referrer for the specific question the cystoscopy should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
