// Plain-JavaScript / JSDoc type definitions for the Mammography Test Request
// form.
//
// Builds the canonical empty `MammographyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention (see examples/assessment.json). Wrapped in an IIFE; published via
// `window.MammographyTestRequest`.

(function () {
'use strict';
window.MammographyTestRequest =
  window.MammographyTestRequest || {};

/**
 * Build a fresh, fully-blank mammography request.
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
      ageYears: null,
      bodyMassIndex: null,
      interpreterRequired: false
    },
    request: {
      examType: '',
      primaryIndication: '',
      laterality: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomLump: false,
      symptomPain: false,
      symptomNippleDischarge: false,
      bloodyNippleDischarge: false,
      symptomSkinChange: false,
      symptomNippleInversion: false
    },
    history: {
      previousMammogram: '',
      previousMammogramDate: '',
      familyHistoryBreastCancer: false,
      breastImplants: false,
      pregnancyOrLactating: '',
      hormoneReplacementTherapy: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for an exam type. */
const EXAM_TYPE_LABELS = {
  'screening': 'Screening',
  'diagnostic': 'Diagnostic',
  'symptomatic': 'Symptomatic',
  'surveillance': 'Surveillance',
  'other': 'Other'
};

/** Human-readable label for an exam type, falling back to the raw value. */
function examTypeLabel(value) {
  return EXAM_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'routine-screening': 'Routine screening',
  'breast-lump': 'Breast lump',
  'breast-pain': 'Breast pain',
  'nipple-discharge': 'Nipple discharge',
  'skin-change': 'Skin change',
  'family-history': 'Family history',
  'follow-up-known-cancer': 'Follow-up known cancer',
  'post-treatment-surveillance': 'Post-treatment surveillance',
  'recall-from-screening': 'Recall from screening',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.MammographyTestRequest, {
  emptyRequest,
  examTypeLabel,
  indicationLabel,
  EXAM_TYPE_LABELS,
  INDICATION_LABELS
});
})();
