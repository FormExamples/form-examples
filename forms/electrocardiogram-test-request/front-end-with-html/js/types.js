// Plain-JavaScript / JSDoc type definitions for the Electrocardiogram (ECG)
// Test Request form.
//
// Builds the canonical empty `EcgRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.
// Wrapped in an IIFE; published via `window.ElectrocardiogramTestRequest`.

(function () {
'use strict';
window.ElectrocardiogramTestRequest =
  window.ElectrocardiogramTestRequest || {};

/**
 * Build a fresh, fully-blank ECG test request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean symptom / red-flag fields default to false.
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
      interpreterRequired: false
    },
    request: {
      ecgType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomChestPain: false,
      symptomPalpitations: false,
      symptomSyncope: false,
      symptomBreathlessness: false,
      symptomDizziness: false,
      currentlySymptomatic: false,
      suspectedAcs: false,
      knownArrhythmia: ''
    },
    medications: {
      relevantMedications: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      siteName: '',
      notes: ''
    }
  };
}

/** Pretty label for an ECG type. */
const ECG_TYPE_LABELS = {
  'resting-12-lead': 'Resting 12-lead',
  'exercise-stress': 'Exercise stress',
  'ambulatory-holter-24h': 'Ambulatory Holter 24h',
  'ambulatory-48h': 'Ambulatory 48h',
  'event-recorder': 'Event recorder',
  'other': 'Other'
};

/** Human-readable label for an ECG type, falling back to the raw value. */
function ecgTypeLabel(value) {
  return ECG_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'chest-pain': 'Chest pain',
  'palpitations': 'Palpitations',
  'syncope': 'Syncope',
  'suspected-arrhythmia': 'Suspected arrhythmia',
  'suspected-mi-acs': 'Suspected MI / ACS',
  'pre-operative': 'Pre-operative',
  'medication-monitoring-qt': 'Medication monitoring (QT)',
  'hypertension': 'Hypertension',
  'heart-failure': 'Heart failure',
  'screening': 'Screening',
  'follow-up': 'Follow-up',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.ElectrocardiogramTestRequest, {
  emptyRequest,
  ecgTypeLabel,
  indicationLabel,
  ECG_TYPE_LABELS,
  INDICATION_LABELS
});
})();
