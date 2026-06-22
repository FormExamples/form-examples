// Plain-JavaScript / JSDoc type definitions for the Sleep Study Test Request
// form.
//
// Builds the canonical empty `SleepStudyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.SleepStudyTestRequest`.

(function () {
'use strict';
window.SleepStudyTestRequest =
  window.SleepStudyTestRequest || {};

/**
 * Build a fresh, fully-blank sleep study request.
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
      bodyMassIndex: null,
      interpreterRequired: false
    },
    request: {
      studyType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    scores: {
      epworthScore: null,
      stopBangScore: null,
      neckCircumferenceCm: null
    },
    symptoms: {
      witnessedApnoeas: false,
      occupationalDriver: false,
      cardiovascularDisease: false
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
  'home-sleep-apnoea-test': 'Home sleep apnoea test (HSAT)',
  'polysomnography': 'Polysomnography (PSG)',
  'overnight-oximetry': 'Overnight oximetry',
  'multiple-sleep-latency-test': 'Multiple sleep latency test (MSLT)',
  'actigraphy': 'Actigraphy',
  'other': 'Other'
};

/** Human-readable label for a study type, falling back to the raw value. */
function studyTypeLabel(value) {
  return STUDY_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-osa': 'Suspected OSA',
  'snoring': 'Snoring',
  'daytime-sleepiness': 'Daytime sleepiness',
  'suspected-narcolepsy': 'Suspected narcolepsy',
  'insomnia': 'Insomnia',
  'restless-legs': 'Restless legs',
  'copd-overlap': 'COPD overlap',
  'pre-bariatric': 'Pre-bariatric',
  'driver-assessment': 'Driver assessment',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.SleepStudyTestRequest, {
  emptyRequest,
  studyTypeLabel,
  indicationLabel,
  STUDY_TYPE_LABELS,
  INDICATION_LABELS
});
})();
