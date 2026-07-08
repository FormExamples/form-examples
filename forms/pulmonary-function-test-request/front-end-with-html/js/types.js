// Plain-JavaScript / JSDoc type definitions for the Pulmonary Function Test
// Request form.
//
// Builds the canonical empty `PulmonaryFunctionTestRequest` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end serde
// / examples convention. Wrapped in an IIFE; published via
// `window.PulmonaryFunctionTestRequest`.

(function () {
'use strict';
window.PulmonaryFunctionTestRequest =
  window.PulmonaryFunctionTestRequest || {};

/**
 * Build a fresh, fully-blank pulmonary function test request.
 * Strings default to ''; numeric fields default to null;
 * boolean symptom / safety fields default to false.
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
      heightCm: null,
      weightKg: null
    },
    request: {
      testType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      breathlessness: false,
      cough: false,
      wheeze: false
    },
    background: {
      smokingStatus: '',
      currentInhalers: ''
    },
    safety: {
      recentRespiratoryInfection: false,
      recentMiOrEyeAbdominalSurgery: false,
      suspectedActiveTuberculosis: false,
      haemoptysis: false
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
  'spirometry': 'Spirometry',
  'spirometry-with-reversibility': 'Spirometry with reversibility',
  'full-lung-function': 'Full lung function',
  'gas-transfer-dlco': 'Gas transfer (DLCO)',
  'peak-flow': 'Peak flow',
  'feno': 'FeNO',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-asthma': 'Suspected asthma',
  'suspected-copd': 'Suspected COPD',
  'breathlessness': 'Breathlessness',
  'chronic-cough': 'Chronic cough',
  'pre-operative': 'Pre-operative',
  'occupational-lung-disease': 'Occupational lung disease',
  'monitoring': 'Monitoring',
  'restrictive-disease': 'Restrictive disease',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.PulmonaryFunctionTestRequest, {
  emptyRequest,
  testTypeLabel,
  TEST_TYPE_LABELS,
  indicationLabel,
  INDICATION_LABELS
});
})();
