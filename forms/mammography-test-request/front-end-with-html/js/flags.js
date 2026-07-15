import { ageInYears } from './rules.js';

// Safety-flag detection for the Mammography Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, breast-lump, bloody-nipple-discharge,
// age-below-screening, pregnancy-lactating, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a mammography request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 *   ({ twoWeekWaitEligible, twoWeekWaitRationale })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Suspected-cancer two-week-wait (NICE NG12) --------------------
  if (ctx.twoWeekWaitEligible === true) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: ctx.twoWeekWaitRationale ||
        'Request meets NICE NG12 suspected-cancer two-week-wait criteria.',
      suggestedAction: 'Refer on the two-week-wait suspected-cancer pathway; book within 14 days.'
    });
  }

  // --- Symptom-based flags -------------------------------------------
  if (data.symptoms.symptomLump === true) {
    flags.push({
      flagId: 'F-BREAST-LUMP-001',
      category: 'breast-lump',
      priority: 'high',
      description: 'Breast lump reported.',
      suggestedAction: 'Prioritise diagnostic work-up, usually triple assessment with ultrasound.'
    });
  }
  if (data.symptoms.symptomNippleDischarge === true) {
    flags.push({
      flagId: 'F-BLOODY-NIPPLE-DISCHARGE-001',
      category: 'bloody-nipple-discharge',
      priority: 'high',
      description: 'Nipple discharge reported — exclude bloody / single-duct discharge.',
      suggestedAction: 'Assess for bloody or single-duct discharge; consider diagnostic mammography and ultrasound.'
    });
  }

  // --- Age-below-screening -------------------------------------------
  const age = ageInYears(data.patient.dateOfBirth);
  if (
    age !== null &&
    age < 40 &&
    (data.request.examType === 'screening' ||
      data.request.primaryIndication === 'routine-screening')
  ) {
    flags.push({
      flagId: 'F-AGE-BELOW-SCREENING-001',
      category: 'age-below-screening',
      priority: 'medium',
      description: `Patient aged ${age} is below the usual screening age range for a screening mammogram.`,
      suggestedAction: 'Confirm indication; consider ultrasound first in younger, denser breasts (IR(ME)R justification).'
    });
  }

  // --- Pregnancy / lactation -----------------------------------------
  if (
    data.history.pregnancyOrLactating === 'pregnant' ||
    data.history.pregnancyOrLactating === 'lactating'
  ) {
    flags.push({
      flagId: 'F-PREGNANCY-LACTATING-001',
      category: 'pregnancy-lactating',
      priority: 'medium',
      description: `Patient is ${data.history.pregnancyOrLactating} — radiation justification required.`,
      suggestedAction: 'Justify ionising-radiation exposure (IR(ME)R 2017); consider ultrasound as first-line.'
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

  return flags;
}

export { detectFlags };
