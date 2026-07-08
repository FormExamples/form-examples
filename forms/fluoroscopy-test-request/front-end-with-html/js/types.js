// Plain-JavaScript / JSDoc type definitions for the Fluoroscopy Test Request
// form.
//
// Builds the canonical empty `FluoroscopyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.FluoroscopyTestRequest`.

(function () {
'use strict';
window.FluoroscopyTestRequest =
  window.FluoroscopyTestRequest || {};

/**
 * Build a fresh, fully-blank fluoroscopy / contrast-study request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean risk fields default to false.
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
      studyType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    safety: {
      pregnancyStatus: '',
      contrastAllergy: false,
      aspirationRisk: false,
      diabetes: false,
      irMeRJustification: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a study type. */
const STUDY_TYPE_LABELS = {
  'barium-swallow': 'Barium swallow',
  'barium-meal': 'Barium meal',
  'barium-follow-through': 'Barium follow-through',
  'barium-enema': 'Barium enema',
  'water-soluble-contrast-swallow': 'Water-soluble contrast swallow',
  'defecating-proctogram': 'Defecating proctogram',
  'hysterosalpingogram': 'Hysterosalpingogram',
  'micturating-cystourethrogram': 'Micturating cystourethrogram',
  'arthrogram': 'Arthrogram',
  'fluoroscopy-guided-procedure': 'Fluoroscopy-guided procedure',
  'other': 'Other'
};

/** Human-readable label for a study type, falling back to the raw value. */
function studyTypeLabel(value) {
  return STUDY_TYPE_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'dysphagia': 'Dysphagia',
  'reflux': 'Reflux',
  'suspected-obstruction': 'Suspected obstruction',
  'suspected-perforation': 'Suspected perforation',
  'constipation': 'Constipation',
  'infertility-tubal-patency': 'Infertility / tubal patency',
  'vesicoureteric-reflux': 'Vesicoureteric reflux',
  'joint-assessment': 'Joint assessment',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** Whether a study type uses ionising radiation (all fluoroscopy does). */
function isIonisingStudy(studyType) {
  return !!studyType && studyType !== '';
}

/** Whether a study type is a barium (insoluble-contrast) study. */
function isBariumStudy(studyType) {
  return (
    studyType === 'barium-swallow' ||
    studyType === 'barium-meal' ||
    studyType === 'barium-follow-through' ||
    studyType === 'barium-enema'
  );
}

Object.assign(window.FluoroscopyTestRequest, {
  emptyRequest,
  studyTypeLabel,
  indicationLabel,
  isIonisingStudy,
  isBariumStudy,
  STUDY_TYPE_LABELS,
  INDICATION_LABELS
});
})();
