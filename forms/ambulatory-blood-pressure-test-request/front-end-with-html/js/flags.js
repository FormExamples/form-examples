import { BP_SEVERE_DIASTOLIC, BP_SEVERE_SYSTOLIC } from './rules.js';

// Safety-flag detection for the Ambulatory Blood Pressure Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: severe-hypertension-urgent, accelerated-hypertension,
// atrial-fibrillation-accuracy, missing-clinic-bp, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via
// `window.AmbulatoryBloodPressureTestRequest`.

// Accelerated (malignant) hypertension is at the very top of the severe range
// and warrants same-day specialist review for end-organ damage.
const BP_ACCELERATED_SYSTOLIC = 200;
const BP_ACCELERATED_DIASTOLIC = 130;

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function bpPresent(d) {
  return (
    num(d.bloodPressure.clinicBpSystolic) !== null &&
    num(d.bloodPressure.clinicBpDiastolic) !== null
  );
}

/**
 * Detect safety flags for an ABPM request.
 *
 * @param {object} data - the request data model
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];
  const sys = num(data.bloodPressure.clinicBpSystolic);
  const dia = num(data.bloodPressure.clinicBpDiastolic);

  // --- Severe / accelerated hypertension ------------------------------
  const accelerated =
    (sys !== null && sys >= BP_ACCELERATED_SYSTOLIC) ||
    (dia !== null && dia >= BP_ACCELERATED_DIASTOLIC);
  const severe =
    (sys !== null && sys >= BP_SEVERE_SYSTOLIC) ||
    (dia !== null && dia >= BP_SEVERE_DIASTOLIC);

  if (accelerated) {
    flags.push({
      flagId: 'F-ACCELERATED-HYPERTENSION-001',
      category: 'accelerated-hypertension',
      priority: 'high',
      description: 'Clinic BP in the accelerated / malignant range (>=200/130).',
      suggestedAction: 'Arrange same-day specialist review; assess for end-organ damage (fundoscopy, urinalysis, ECG, bloods) before routine ABPM.'
    });
  } else if (severe) {
    flags.push({
      flagId: 'F-SEVERE-HYPERTENSION-001',
      category: 'severe-hypertension-urgent',
      priority: 'high',
      description: 'Clinic BP >=180/120 mmHg (severe hypertension).',
      suggestedAction: 'Arrange same-day specialist review (NICE NG136); same-day assessment takes priority over routine ABPM booking.'
    });
  }

  // --- Atrial fibrillation accuracy -----------------------------------
  if (data.symptoms.atrialFibrillation === true) {
    flags.push({
      flagId: 'F-ATRIAL-FIBRILLATION-ACCURACY-001',
      category: 'atrial-fibrillation-accuracy',
      priority: 'medium',
      description: 'Atrial fibrillation reduces oscillometric ABPM accuracy (BIHS).',
      suggestedAction: 'Use an AF-validated device or confirm readings auscultatorily; interpret ABPM results with caution.'
    });
  }

  // --- Completeness / data-quality flags ------------------------------
  if (!bpPresent(data)) {
    flags.push({
      flagId: 'F-MISSING-CLINIC-BP-001',
      category: 'missing-clinic-bp',
      priority: 'medium',
      description: 'No recent clinic blood pressure recorded.',
      suggestedAction: 'Record a clinic blood pressure; it drives both the appropriateness and triage axes.'
    });
  }
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
      priority: 'low',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the test should answer.'
    });
  }

  return flags;
}

export { detectFlags };
