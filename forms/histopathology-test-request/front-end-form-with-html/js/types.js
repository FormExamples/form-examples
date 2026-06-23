// Plain-JavaScript / JSDoc type definitions for the Histopathology Test
// Request form.
//
// Builds the canonical empty `HistopathologyRequest` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Property names are camelCase to match the front-end serde /
// examples convention. Wrapped in an IIFE; published via
// `window.HistopathologyTestRequest`.

(function () {
'use strict';
window.HistopathologyTestRequest =
  window.HistopathologyTestRequest || {};

/**
 * Build a fresh, fully-blank tissue histopathology request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag fields default to false.
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
    specimen: {
      specimenType: '',
      specimenSite: '',
      numberOfSpecimens: null,
      fixative: '',
      specimenLabelled: false
    },
    indication: {
      primaryIndication: '',
      clinicalQuestion: '',
      clinicalDetails: '',
      provisionalDiagnosis: '',
      previousHistology: ''
    },
    urgency: {
      urgentFrozenSection: false,
      twoWeekWait: false,
      urgency: ''
    },
    triage: {
      setting: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a specimen type. */
const SPECIMEN_TYPE_LABELS = {
  'biopsy': 'Biopsy',
  'excision': 'Excision',
  'resection': 'Resection',
  'endoscopic-biopsy': 'Endoscopic biopsy',
  'skin-lesion': 'Skin lesion',
  'frozen-section': 'Frozen section',
  'other': 'Other'
};

/** Human-readable label for a specimen type, falling back to the raw value. */
function specimenTypeLabel(value) {
  return SPECIMEN_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-malignancy': 'Suspected malignancy',
  'cancer-staging': 'Cancer staging',
  'inflammatory-disease': 'Inflammatory disease',
  'infection': 'Infection',
  'characterise-lesion': 'Characterise lesion',
  'margin-assessment': 'Margin assessment',
  'transplant-monitoring': 'Transplant monitoring',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.HistopathologyTestRequest, {
  emptyRequest,
  specimenTypeLabel,
  SPECIMEN_TYPE_LABELS,
  indicationLabel,
  INDICATION_LABELS
});
})();
