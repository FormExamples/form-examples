import { GLUCOSE_UNCONTROLLED_THRESHOLD } from './rules.js';
import { isFdgStudy } from './types.js';

// Safety-flag detection for the PET Scan Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: pregnancy, breastfeeding, uncontrolled-glucose,
// high-radiation-dose, missing-indication, missing-clinical-question,
// missing-glucose, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.PetScanTestRequest`.

/**
 * Detect safety flags for a PET-CT scan request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ radiationDoseBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};
  const prep = data.preparation;
  const fdg = isFdgStudy(data.request.scanType);

  // --- Radiation-safety flags ----------------------------------------
  if (prep.pregnancyStatus === 'pregnant') {
    flags.push({
      flagId: 'F-PREGNANCY-001',
      category: 'pregnancy',
      priority: 'high',
      description: 'Patient is pregnant.',
      suggestedAction: 'Do not expose unless justified by exception; discuss alternatives with the nuclear-medicine physician and ARSAC holder.'
    });
  } else if (prep.pregnancyStatus === 'possible') {
    flags.push({
      flagId: 'F-PREGNANCY-002',
      category: 'pregnancy',
      priority: 'medium',
      description: 'Pregnancy cannot be excluded.',
      suggestedAction: 'Confirm pregnancy status (e.g. beta-hCG / LMP) before tracer administration.'
    });
  }

  if (prep.breastfeeding === true) {
    flags.push({
      flagId: 'F-BREASTFEEDING-001',
      category: 'breastfeeding',
      priority: 'medium',
      description: 'Patient is breastfeeding.',
      suggestedAction: 'Advise interruption of breastfeeding and close-contact precautions per local radiation-protection protocol.'
    });
  }

  // --- Glucose-control flags (FDG studies) ---------------------------
  if (fdg) {
    const g = prep.bloodGlucoseMmolL;
    if (g === null || g === undefined || g === '') {
      flags.push({
        flagId: 'F-MISSING-GLUCOSE-001',
        category: 'missing-glucose',
        priority: 'medium',
        description: 'No blood glucose recorded for an FDG study.',
        suggestedAction: 'Measure and document blood glucose before tracer injection; FDG uptake depends on glucose control.'
      });
    } else if (Number(g) > GLUCOSE_UNCONTROLLED_THRESHOLD) {
      flags.push({
        flagId: 'F-UNCONTROLLED-GLUCOSE-001',
        category: 'uncontrolled-glucose',
        priority: 'high',
        description: `Blood glucose ${Number(g)} mmol/L is above ~11 mmol/L.`,
        suggestedAction: 'Recheck glucose and reschedule if it remains above ~11 mmol/L; impaired FDG uptake degrades the study.'
      });
    }
  }

  // --- Radiation-dose flag -------------------------------------------
  if (ctx.radiationDoseBand === 'high') {
    flags.push({
      flagId: 'F-HIGH-RADIATION-DOSE-001',
      category: 'high-radiation-dose',
      priority: 'low',
      description: 'Requested study carries a high relative radiation dose.',
      suggestedAction: 'Confirm the IR(ME)R justification documents that the benefit outweighs the dose.'
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
      flagId: 'F-OTHER-MISSING-JUSTIFICATION-001',
      category: 'other',
      priority: 'medium',
      description: 'No IR(ME)R justification statement recorded.',
      suggestedAction: 'Record the IR(ME)R justification supporting the radiation exposure before booking.'
    });
  }

  return flags;
}

export { detectFlags };
