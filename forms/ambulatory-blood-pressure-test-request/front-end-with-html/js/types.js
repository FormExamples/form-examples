// Plain-JavaScript / JSDoc type definitions for the Ambulatory Blood Pressure
// Test Request (ABPM referral) form.
//
// Builds the canonical empty `AbpmRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.
// Wrapped in an IIFE; published via
// `window.AmbulatoryBloodPressureTestRequest`.

(function () {
'use strict';
window.AmbulatoryBloodPressureTestRequest =
  window.AmbulatoryBloodPressureTestRequest || {};

/**
 * Build a fresh, fully-blank ABPM request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean symptom / accuracy / medication fields default to false.
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
    bloodPressure: {
      clinicBpSystolic: null,
      clinicBpDiastolic: null,
      onAntihypertensives: false,
      currentMedications: ''
    },
    symptoms: {
      symptomDizziness: false,
      symptomHeadache: false,
      atrialFibrillation: false,
      pregnant: false
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
  '24-hour-abpm': '24-hour ABPM',
  'home-blood-pressure-monitoring': 'Home blood pressure monitoring',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'diagnose-hypertension': 'Diagnose hypertension',
  'white-coat-hypertension': 'Suspected white-coat hypertension',
  'masked-hypertension': 'Suspected masked hypertension',
  'resistant-hypertension': 'Resistant hypertension',
  'treatment-monitoring': 'Treatment monitoring',
  'hypotension-symptoms': 'Hypotension symptoms',
  'pregnancy-hypertension': 'Pregnancy hypertension',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** Format a clinic blood-pressure pair as "S/D mmHg" or '' if incomplete. */
function formatBloodPressure(systolic, diastolic) {
  if (systolic === null || systolic === undefined || systolic === '') return '';
  if (diastolic === null || diastolic === undefined || diastolic === '') return '';
  return `${Number(systolic)}/${Number(diastolic)} mmHg`;
}

Object.assign(window.AmbulatoryBloodPressureTestRequest, {
  emptyRequest,
  testTypeLabel,
  indicationLabel,
  formatBloodPressure,
  TEST_TYPE_LABELS,
  INDICATION_LABELS
});
})();
