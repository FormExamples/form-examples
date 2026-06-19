// Safety-flag detection for the PET Scan Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: pregnancy, breastfeeding, uncontrolled-glucose,
// high-radiation-dose, missing-indication, missing-clinical-question,
// missing-glucose, and other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.PetScanTestRequest`.

(function () {
'use strict';
window.PetScanTestRequest = window.PetScanTestRequest || {};
const NS = window.PetScanTestRequest;
const {
  isFdgStudy,
  GLUCOSE_RESCHEDULE_THRESHOLD
} = NS;

/**
 * Detect safety flags for a PET-CT scan request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 *   ({ prepSafetyBand, radiationDoseBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};
  const fdg = isFdgStudy(data.request.scanType);
  const glucose = data.prep.bloodGlucoseMmolL;

  // --- Pregnancy -----------------------------------------------------
  if (data.prep.pregnancyStatus === 'pregnant') {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Patient is pregnant; PET-CT delivers ionising radiation to the fetus.',
      suggestedAction: 'Do not proceed without overriding IR(ME)R justification; discuss with the nuclear-medicine physician and medical physics expert.'
    });
  } else if (data.prep.pregnancyStatus === 'possible' || data.prep.pregnancyStatus === 'unknown') {
    flags.push({
      flagId: 'F-PREGNANCY-UNCONFIRMED-001',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Pregnancy is possible or not confirmed.',
      suggestedAction: 'Confirm pregnancy status (e.g. urine / serum hCG) before exposure.'
    });
  }

  // --- Breastfeeding -------------------------------------------------
  if (data.prep.breastfeeding === true) {
    flags.push({
      flagId: 'F-BREASTFEEDING-001',
      category: 'breastfeeding',
      priority: 'medium',
      description: 'Patient is breastfeeding.',
      suggestedAction: 'Advise interruption of breastfeeding and close infant contact per local radiopharmaceutical guidance.'
    });
  }

  // --- Uncontrolled glucose (FDG studies) ----------------------------
  if (fdg && glucose !== null && glucose !== undefined && glucose !== '' &&
      Number(glucose) > GLUCOSE_RESCHEDULE_THRESHOLD) {
    flags.push({
      flagId: 'F-UNCONTROLLED-GLUCOSE-001',
      category: 'uncontrolled-glucose',
      priority: 'high',
      description: `Blood glucose ${Number(glucose)} mmol/L exceeds ~11 mmol/L; FDG uptake is degraded.`,
      suggestedAction: 'Recheck glucose and reschedule the FDG study once glucose is controlled below ~11 mmol/L.'
    });
  }

  // --- Missing glucose (FDG study, no glucose recorded) --------------
  if (fdg && (glucose === null || glucose === undefined || glucose === '')) {
    flags.push({
      flagId: 'F-MISSING-GLUCOSE-001',
      category: 'missing-glucose',
      priority: 'medium',
      description: 'No blood glucose recorded for an FDG study.',
      suggestedAction: 'Measure and document blood glucose before administering the tracer.'
    });
  }

  // --- High radiation dose -------------------------------------------
  if (ctx.radiationDoseBand === 'high') {
    flags.push({
      flagId: 'F-HIGH-RADIATION-DOSE-001',
      category: 'high-radiation-dose',
      priority: 'medium',
      description: 'This request falls in the high relative radiation-dose band.',
      suggestedAction: 'Confirm the IR(ME)R justification accounts for the dose; consider lower-dose alternatives where clinically equivalent.'
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
  if (!data.justification.irMeRJustification || data.justification.irMeRJustification.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-JUSTIFICATION-001',
      category: 'other',
      priority: 'low',
      description: 'No IR(ME)R justification statement recorded.',
      suggestedAction: 'Record the IR(ME)R justification supporting the radiation exposure before booking.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
