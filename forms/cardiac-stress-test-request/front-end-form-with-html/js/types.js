// Plain-JavaScript / JSDoc type definitions for the Cardiac Stress Test
// Request form.
//
// Builds the canonical empty `StressTestRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.CardiacStressTestRequest`.

(function () {
'use strict';
window.CardiacStressTestRequest =
  window.CardiacStressTestRequest || {};

/**
 * Build a fresh, fully-blank cardiac stress test request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean symptom / risk fields default to false.
 */
function emptyRequest() {
  return {
    clinician: {
      clinicianName: '',
      clinicianRole: '',
      registrationBody: '',
      registrationNumber: '',
      requesterContact: '',
      supervisingConsultant: '',
      siteName: '',
      referralDate: ''
    },
    patient: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nhsNumber: '',
      bodyMassIndex: null
    },
    request: {
      testType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomChestPain: false,
      symptomBreathlessness: false,
      symptomPalpitations: false,
      ableToExercise: false,
      restingEcgFindings: ''
    },
    safety: {
      knownCoronaryArteryDisease: false,
      recentAcuteCoronarySyndrome: false,
      aorticStenosis: '',
      uncontrolledHypertension: false,
      betaBlocker: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a test type. */
const TEST_TYPE_LABELS = {
  'exercise-treadmill-ecg': 'Exercise treadmill ECG',
  'stress-echo': 'Stress echocardiography',
  'dobutamine-stress-echo': 'Dobutamine stress echo',
  'myocardial-perfusion-spect': 'Myocardial perfusion SPECT',
  'stress-cardiac-mri': 'Stress cardiac MRI',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a clinical indication. */
const INDICATION_LABELS = {
  'suspected-angina': 'Suspected angina',
  'known-cad-assessment': 'Known CAD assessment',
  'risk-stratification-post-mi': 'Risk stratification post-MI',
  'pre-operative-cardiac': 'Pre-operative cardiac',
  'exercise-tolerance': 'Exercise tolerance',
  'arrhythmia-evaluation': 'Arrhythmia evaluation',
  'valve-disease': 'Valve disease',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/**
 * True when the requested test is an exercise (non-pharmacological) modality
 * that requires the patient to be able to exercise.
 */
function isExerciseTest(testType) {
  return testType === 'exercise-treadmill-ecg' || testType === 'stress-echo';
}

Object.assign(window.CardiacStressTestRequest, {
  emptyRequest,
  testTypeLabel,
  indicationLabel,
  isExerciseTest,
  TEST_TYPE_LABELS,
  INDICATION_LABELS
});
})();
