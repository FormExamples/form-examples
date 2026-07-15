import { isExerciseTest } from './types.js';

// Safety-flag detection for the Cardiac Stress Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: recent-acs-contraindication, severe-aortic-stenosis,
// uncontrolled-hypertension, unable-to-exercise, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.CardiacStressTestRequest`.

/**
 * Detect safety flags for a cardiac stress test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context (unused here)
 * @returns {object[]} safety flags
 */
function detectFlags(data /*, context */) {
  const flags = [];

  // --- Absolute / safety-critical contraindications -------------------
  if (data.safety.recentAcuteCoronarySyndrome === true) {
    flags.push({
      flagId: 'F-RECENT-ACS-CONTRAINDICATION-001',
      category: 'recent-acs-contraindication',
      priority: 'high',
      description: 'Recent acute coronary syndrome reported.',
      suggestedAction: 'Do not stress test until clinically stabilised; arrange emergency cardiology review.'
    });
  }
  if (data.safety.aorticStenosis === 'severe') {
    flags.push({
      flagId: 'F-SEVERE-AORTIC-STENOSIS-001',
      category: 'severe-aortic-stenosis',
      priority: 'high',
      description: 'Severe (symptomatic) aortic stenosis reported.',
      suggestedAction: 'Exercise testing contraindicated; refer for coronary angiography / valve assessment instead.'
    });
  }

  // --- Relative contraindications -------------------------------------
  if (data.safety.uncontrolledHypertension === true) {
    flags.push({
      flagId: 'F-UNCONTROLLED-HYPERTENSION-001',
      category: 'uncontrolled-hypertension',
      priority: 'medium',
      description: 'Uncontrolled hypertension reported.',
      suggestedAction: 'Relative contraindication; control blood pressure before stress testing.'
    });
  }
  if (isExerciseTest(data.request.testType) && data.symptoms.ableToExercise !== true) {
    flags.push({
      flagId: 'F-UNABLE-TO-EXERCISE-001',
      category: 'unable-to-exercise',
      priority: 'medium',
      description: 'Exercise test requested but patient is unable to exercise.',
      suggestedAction: 'Redirect to a pharmacological / imaging modality (e.g. dobutamine stress echo or perfusion imaging).'
    });
  }

  // --- Completeness / data-quality flags ------------------------------
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
      suggestedAction: 'Query the referrer for the specific question the test should answer.'
    });
  }

  return flags;
}

export { detectFlags };
