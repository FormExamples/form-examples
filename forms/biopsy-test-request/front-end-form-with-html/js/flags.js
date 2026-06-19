// Safety-flag detection for the Biopsy Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, high-bleeding-risk-anticoag,
// coagulopathy, thrombocytopenia, immunosuppression, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.BiopsyTestRequest`.

(function () {
'use strict';
window.BiopsyTestRequest = window.BiopsyTestRequest || {};
const NS = window.BiopsyTestRequest;

// Thresholds mirror those in rules.js (BSIR / CIRSE).
const INR_HIGH = 1.5;
const PLATELET_HIGH = 50;
const PLATELET_MODERATE = 100;

/**
 * Detect safety flags for a biopsy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ twoWeekWaitEligible, bleedingRiskBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};
  const b = data.bleeding;

  // --- Suspected-cancer two-week-wait --------------------------------
  if (ctx.twoWeekWaitEligible === true) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Suspected-malignancy / cancer-staging indication — NICE NG12 two-week-wait eligible.',
      suggestedAction: 'Refer on a suspected-cancer two-week-wait pathway; expedite vetting and booking within 14 days.'
    });
  }

  // --- High bleeding risk on anticoagulant ---------------------------
  if (b.takingAnticoagulant === true) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: b.anticoagulantAgent
        ? `Patient on an anticoagulant (${b.anticoagulantAgent}) — high periprocedural bleeding risk.`
        : 'Patient on an anticoagulant — high periprocedural bleeding risk.',
      suggestedAction: 'Withhold / bridge per local periprocedural protocol; confirm coagulation before the biopsy.'
    });
  }

  // --- Coagulopathy --------------------------------------------------
  if (
    b.bleedingDisorder === true ||
    (b.inr !== null && b.inr !== undefined && b.inr !== '' && Number(b.inr) > INR_HIGH)
  ) {
    flags.push({
      flagId: 'F-COAGULOPATHY-001',
      category: 'coagulopathy',
      priority: 'high',
      description: b.bleedingDisorder === true
        ? 'Known bleeding disorder / coagulopathy.'
        : `INR ${Number(b.inr)} above ${INR_HIGH} — coagulopathy.`,
      suggestedAction: 'Involve haematology; correct coagulation and arrange factor cover before the procedure.'
    });
  }

  // --- Thrombocytopenia ----------------------------------------------
  if (b.plateletCount !== null && b.plateletCount !== undefined && b.plateletCount !== '') {
    const plt = Number(b.plateletCount);
    if (!Number.isNaN(plt) && plt < PLATELET_MODERATE) {
      flags.push({
        flagId: 'F-THROMBOCYTOPENIA-001',
        category: 'thrombocytopenia',
        priority: plt < PLATELET_HIGH ? 'high' : 'medium',
        description: `Platelet count ${plt} x10^9/L below ${PLATELET_MODERATE} — thrombocytopenia.`,
        suggestedAction: plt < PLATELET_HIGH
          ? 'Arrange platelet transfusion cover and confirm a target platelet count before the biopsy.'
          : 'Confirm the platelet count is acceptable for the planned biopsy method.'
      });
    }
  }

  // --- Immunosuppression ---------------------------------------------
  if (b.immunosuppressed === true) {
    flags.push({
      flagId: 'F-IMMUNOSUPPRESSION-001',
      category: 'immunosuppression',
      priority: 'medium',
      description: 'Patient is immunosuppressed.',
      suggestedAction: 'Consider infection / wound-healing risk; review prophylaxis and aseptic technique.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.indication.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.indication.clinicalQuestion || data.indication.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the biopsy should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
