import { usesIonisingRadiation } from './types.js';

// Safety-flag detection for the Angiography Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: contrast-allergy, renal-impairment,
// high-bleeding-risk-anticoag, pregnancy, metformin-contrast,
// missing-indication, missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.AngiographyTestRequest`.

/**
 * Detect safety flags for a vascular angiography request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (reserved)
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const usesContrast =
    data.contrast.contrastRequired === 'iodinated' ||
    data.contrast.contrastRequired === 'gadolinium';

  // --- Contrast allergy ----------------------------------------------
  if (data.contrast.contrastAllergy === true) {
    flags.push({
      flagId: 'F-CONTRAST-ALLERGY-001',
      category: 'contrast-allergy',
      priority: usesContrast ? 'high' : 'medium',
      description: 'Previous contrast-media allergy / reaction recorded.',
      suggestedAction: usesContrast
        ? 'Confirm the requirement for contrast; consider premedication, a non-contrast or non-iodinated alternative, and senior radiologist review.'
        : 'No contrast currently planned; document the allergy and avoid contrast if the protocol changes.'
    });
  }

  // --- Renal impairment ----------------------------------------------
  const egfr = data.contrast.egfr;
  if (
    data.contrast.contrastRequired === 'iodinated' &&
    egfr !== null && egfr !== undefined && egfr < 30
  ) {
    flags.push({
      flagId: 'F-RENAL-IMPAIRMENT-001',
      category: 'renal-impairment',
      priority: 'high',
      description: `eGFR ${egfr} with iodinated contrast — high post-contrast acute kidney injury risk.`,
      suggestedAction: 'Discuss with the radiologist; individualise per ACR–NKF / ESUR, arrange renal-protective hydration, and consider a non-iodinated alternative.'
    });
  } else if (
    data.contrast.contrastRequired === 'iodinated' &&
    egfr !== null && egfr !== undefined && egfr >= 30 && egfr < 45
  ) {
    flags.push({
      flagId: 'F-RENAL-IMPAIRMENT-002',
      category: 'renal-impairment',
      priority: 'medium',
      description: `eGFR ${egfr} with iodinated contrast — moderate renal impairment.`,
      suggestedAction: 'Use renal-protective hydration, minimise contrast volume, and recheck renal function after the examination.'
    });
  }

  // --- High bleeding risk on anticoagulation -------------------------
  if (
    data.bleeding.takingAnticoagulant === true &&
    (data.request.angiographyType === 'catheter-dsa' || data.bleeding.bleedingDisorder === true)
  ) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: data.bleeding.anticoagulantAgent
        ? `Anticoagulation (${data.bleeding.anticoagulantAgent}) with raised arterial-access bleeding risk.`
        : 'Anticoagulation with raised arterial-access bleeding risk.',
      suggestedAction: 'Review peri-procedural anticoagulation, check coagulation, and plan bridging / hold per local catheter-angiography policy.'
    });
  }

  // --- Pregnancy / radiation -----------------------------------------
  if (
    data.pregnancy.pregnancyStatus === 'pregnant' &&
    usesIonisingRadiation(data.request.angiographyType)
  ) {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Pregnancy with an ionising-radiation examination.',
      suggestedAction: 'Justify under IR(ME)R, consider MR angiography or ultrasound, and minimise / shield the dose if the examination proceeds.'
    });
  } else if (
    (data.pregnancy.pregnancyStatus === 'possible' || data.pregnancy.pregnancyStatus === 'unknown') &&
    usesIonisingRadiation(data.request.angiographyType)
  ) {
    flags.push({
      flagId: 'F-PREGNANCY-002',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Possible / unknown pregnancy with an ionising-radiation examination.',
      suggestedAction: 'Confirm pregnancy status before exposure; apply the IR(ME)R 28-day / 10-day rule.'
    });
  }

  // --- Metformin + contrast ------------------------------------------
  if (
    data.contrast.metformin === true &&
    data.contrast.contrastRequired === 'iodinated'
  ) {
    flags.push({
      flagId: 'F-METFORMIN-CONTRAST-001',
      category: 'metformin-contrast',
      priority: 'medium',
      description: 'Metformin with iodinated contrast.',
      suggestedAction: 'Review metformin per ESUR guidance based on eGFR; withhold and recheck renal function where indicated.'
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
      suggestedAction: 'Query the referrer for the specific question the examination should answer.'
    });
  }

  // --- Other ----------------------------------------------------------
  if (
    usesIonisingRadiation(data.request.angiographyType) &&
    (!data.pregnancy.irMeRJustification || data.pregnancy.irMeRJustification.trim() === '')
  ) {
    flags.push({
      flagId: 'F-MISSING-IRMER-001',
      category: 'other',
      priority: 'low',
      description: 'No IR(ME)R justification recorded for an ionising-radiation examination.',
      suggestedAction: 'Record the IR(ME)R justification before the exposure is authorised.'
    });
  }

  return flags;
}

export { detectFlags };
