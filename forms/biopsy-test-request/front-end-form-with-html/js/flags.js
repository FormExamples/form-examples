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

function hasValue(v) {
  return v !== null && v !== undefined && v !== '';
}

/**
 * Detect safety flags for a biopsy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ bleedingRiskBand, twoWeekWaitEligible })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Suspected-cancer two-week-wait --------------------------------
  if (
    ctx.twoWeekWaitEligible === true ||
    data.indication.primaryIndication === 'suspected-malignancy' ||
    data.indication.primaryIndication === 'cancer-staging'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Suspected-malignancy / cancer-staging indication — two-week-wait eligible.',
      suggestedAction: 'Book on a suspected-cancer two-week-wait pathway; complete within 14 days.'
    });
  }

  // --- High bleeding risk on anticoagulant ---------------------------
  if (data.bleeding.takingAnticoagulant === true) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: `Patient is taking an anticoagulant${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''}.`,
      suggestedAction: 'Withhold / bridge per BSG / ESGE timing; confirm a periprocedural anticoagulant plan before booking.'
    });
  }

  // --- Coagulopathy ---------------------------------------------------
  if (
    data.bleeding.bleedingDisorder === true ||
    (hasValue(data.bleeding.inr) && Number(data.bleeding.inr) >= 1.5)
  ) {
    flags.push({
      flagId: 'F-COAGULOPATHY-001',
      category: 'coagulopathy',
      priority: 'high',
      description: data.bleeding.bleedingDisorder
        ? 'Known bleeding disorder / coagulopathy.'
        : `Raised INR (${data.bleeding.inr}).`,
      suggestedAction: 'Liaise with haematology; correct coagulation (INR < 1.5) before the procedure.'
    });
  }

  // --- Thrombocytopenia ----------------------------------------------
  if (hasValue(data.bleeding.plateletCount) && Number(data.bleeding.plateletCount) < 100) {
    const severe = Number(data.bleeding.plateletCount) < 50;
    flags.push({
      flagId: 'F-THROMBOCYTOPENIA-001',
      category: 'thrombocytopenia',
      priority: severe ? 'high' : 'medium',
      description: `Platelet count ${data.bleeding.plateletCount} ×10⁹/L${severe ? ' (severe)' : ' (borderline)'}.`,
      suggestedAction: severe
        ? 'Transfuse platelets to ≥ 50 ×10⁹/L before biopsy.'
        : 'Confirm a recent platelet count; consider transfusion for higher-risk sites.'
    });
  }

  // --- Immunosuppression ---------------------------------------------
  if (data.bleeding.immunosuppressed === true) {
    flags.push({
      flagId: 'F-IMMUNOSUPPRESSION-001',
      category: 'immunosuppression',
      priority: 'medium',
      description: 'Patient is immunosuppressed.',
      suggestedAction: 'Consider periprocedural infection precautions and antibiotic prophylaxis where indicated.'
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
