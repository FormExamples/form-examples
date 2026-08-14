// Safety-flag detection for the Hip Replacement Surgery Evaluation engine.
//
// Flags fire independently of the candidacy recommendation and are never
// suppressed by a clinician override -- see ../../doc/safety-case-notes.md.
// Flag IDs are stable and identical across every front-end and the back-end.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.

import { num } from './ohs-rules.js';

/**
 * Detect safety flags for a hip-replacement surgery evaluation.
 *
 * @param {object} data - the evaluation data model
 * @param {object} context - { bmi, age }
 * @returns {object[]} safety flags, most severe first
 */
function detectFlags(data, context) {
  const flags = [];
  const push = (flagId, category, priority, description, suggestedAction) =>
    flags.push({ flagId, category, priority, description, suggestedAction });

  const { bmi, age } = context;

  // --- Paediatric (checked first: OHS is not validated below 16) ---------
  if (age !== null && age < 16) {
    push(
      'F-PAEDIATRIC-001',
      'paediatric',
      'high',
      `The patient is ${age} years old; the Oxford Hip Score is not validated below 16 years.`,
      'Refer to a paediatric orthopaedic service. Treat the score on this report as invalid.'
    );
  }

  // --- Conservative treatment not exhausted -------------------------------
  if (data.conservative.conservativeMeasuresExhausted === 'no') {
    push(
      'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001',
      'conservative-treatment-not-exhausted',
      'medium',
      'Conservative measures have not yet been exhausted.',
      'Complete physiotherapy, weight-management advice, and an analgesic or steroid-injection trial before listing for surgery.'
    );
  }

  // --- High BMI surgical risk ----------------------------------------------
  if (bmi !== null && bmi >= 40) {
    push(
      'F-HIGH-BMI-SURGICAL-RISK-001',
      'high-bmi-surgical-risk',
      'medium',
      `Body mass index ${bmi} kg/m² is 40 or above.`,
      'Discuss weight-management options and peri-operative risk with the patient before listing; consider a bariatric or weight-management referral.'
    );
  }

  // --- Pre-operative bloods incomplete --------------------------------------
  const missingTests = [
    data.baselineTests.fullBloodCountDone !== 'yes' ? 'full blood count' : null,
    data.baselineTests.renalFunctionDone !== 'yes' ? 'renal function' : null,
    data.baselineTests.clottingOrInrDone !== 'yes' ? 'clotting/INR' : null,
    data.baselineTests.ecgDone !== 'yes' ? 'ECG' : null,
    data.baselineTests.mrsaScreenDone !== 'yes' ? 'MRSA screen' : null,
    data.baselineTests.urinalysisDone !== 'yes' ? 'urinalysis' : null
  ].filter((v) => v !== null);
  if (missingTests.length > 0) {
    push(
      'F-PRE-OP-BLOODS-INCOMPLETE-001',
      'pre-op-bloods-incomplete',
      'medium',
      `Pre-operative baseline tests not yet done: ${missingTests.join(', ')}.`,
      'Complete the outstanding pre-operative baseline tests before listing for surgery.'
    );
  }

  // --- Leg-length discrepancy -----------------------------------------------
  const discrepancy = num(data.gait.legLengthDiscrepancyAsCm);
  if (discrepancy !== null && discrepancy > 2) {
    push(
      'F-LEG-LENGTH-DISCREPANCY-SIGNIFICANT-001',
      'leg-length-discrepancy-significant',
      'medium',
      `Measured leg-length discrepancy of ${discrepancy}cm exceeds 2cm.`,
      'Factor the discrepancy into templating and surgical planning, and discuss expectations for correction with the patient.'
    );
  }

  // --- Trendelenburg -----------------------------------------------------------
  if (data.gait.trendelenburgSign === 'yes') {
    push(
      'F-TRENDELENBURG-POSITIVE-001',
      'trendelenburg-positive',
      'low',
      'The Trendelenburg sign is positive, indicating hip abductor weakness.',
      'Note abductor weakness for surgical approach planning and consider pre-habilitation physiotherapy.'
    );
  }

  // --- Bilateral -----------------------------------------------------------------
  if (data.history.affectedSide === 'bilateral') {
    push(
      'F-BILATERAL-SYMPTOMATIC-001',
      'bilateral-symptomatic',
      'low',
      'Both hips are symptomatic.',
      'Discuss staged versus simultaneous bilateral surgery and plan rehabilitation accordingly.'
    );
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export { detectFlags };
