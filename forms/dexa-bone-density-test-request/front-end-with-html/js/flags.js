// Safety-flag detection for the DEXA Bone Density Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: recent-fragility-fracture, high-frax-risk,
// duplicate-recent-dexa, pregnancy, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.DexaBoneDensityTestRequest`.

(function () {
'use strict';
window.DexaBoneDensityTestRequest =
  window.DexaBoneDensityTestRequest || {};
const NS = window.DexaBoneDensityTestRequest;

// NOGG / ISCD repeat-DXA interval: a previous DEXA within ~2 years (730 days)
// without a clear monitoring indication is a possible duplicate.
const DUPLICATE_DEXA_DAYS = 730;
const FRAX_HIGH_FLAG_THRESHOLD = 30;

/**
 * Detect safety flags for a DEXA bone-density request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- High-acuity clinical factors ----------------------------------
  if (data.riskFactors.previousFragilityFracture === true) {
    flags.push({
      flagId: 'F-RECENT-FRAGILITY-FRACTURE-001',
      category: 'recent-fragility-fracture',
      priority: 'high',
      description: 'A previous (low-trauma) fragility fracture is recorded.',
      suggestedAction: 'Expedite vetting; a fragility fracture is itself a strong indication and may warrant treatment regardless of BMD.'
    });
  }

  if (fraxAtOrAbove(data, FRAX_HIGH_FLAG_THRESHOLD)) {
    flags.push({
      flagId: 'F-HIGH-FRAX-RISK-001',
      category: 'high-frax-risk',
      priority: 'high',
      description: `FRAX 10-year major-fracture probability (${Number(data.riskFactors.fraxMajorFracturePercent)}%) is very high.`,
      suggestedAction: 'Expedite vetting; consider whether treatment can be started against the NOGG intervention threshold.'
    });
  }

  // --- Duplicate / repeat DEXA ---------------------------------------
  if (isDuplicateRecentDexa(data)) {
    flags.push({
      flagId: 'F-DUPLICATE-RECENT-DEXA-001',
      category: 'duplicate-recent-dexa',
      priority: 'medium',
      description: 'A previous DEXA was performed within the last two years.',
      suggestedAction: 'Confirm a monitoring indication; repeating DEXA inside the least-significant-change interval rarely adds value (ISCD / NOGG).'
    });
  }

  // --- Pregnancy ------------------------------------------------------
  if (
    data.patient.pregnancyStatus === 'pregnant' ||
    data.patient.pregnancyStatus === 'possible'
  ) {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Pregnancy is known or suspected.',
      suggestedAction: 'Defer DEXA until pregnancy is excluded or completed; although the dose is very low, avoid unnecessary exposure.'
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
      suggestedAction: 'Query the referrer for the specific question the scan should answer.'
    });
  }

  // --- Other ----------------------------------------------------------
  if (data.request.primaryIndication === 'other' || data.request.scanRegion === 'other') {
    flags.push({
      flagId: 'F-OTHER-001',
      category: 'other',
      priority: 'low',
      description: 'Indication or scan region recorded as "other".',
      suggestedAction: 'Review the free-text history to confirm the request is justified and correctly sited.'
    });
  }

  return flags;
}

function fraxAtOrAbove(d, threshold) {
  const v = d.riskFactors.fraxMajorFracturePercent;
  if (v === null || v === undefined || v === '') return false;
  const n = Number(v);
  return !Number.isNaN(n) && n >= threshold;
}

function isDuplicateRecentDexa(d) {
  const prev = d.previousDexa.previousDexa;
  const date = d.previousDexa.previousDexaDate;
  // A meaningful prior result with a recent date, not a treatment-monitoring
  // request, is a possible duplicate.
  const hasPrior = prev && prev !== '' && prev !== 'none' && prev !== 'unknown';
  if (!hasPrior || !date) return false;
  if (d.request.primaryIndication === 'monitoring-treatment') return false;
  const then = Date.parse(date);
  if (Number.isNaN(then)) return false;
  const ageDays = (Date.now() - then) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays < DUPLICATE_DEXA_DAYS;
}

Object.assign(NS, { detectFlags });
})();
