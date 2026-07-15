// Plain-JavaScript / JSDoc type definitions for the Nerve Conduction Study
// Test Request form.
//
// Builds the canonical empty `NerveConductionStudyRequest` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Property names are camelCase to match the front-end serde /
// examples convention. Wrapped in an IIFE; published via
// `window.NerveConductionStudyTestRequest`.

/**
 * Build a fresh, fully-blank electrodiagnostic request.
 * Strings default to ''; numeric / date fields default to null;
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
      interpreterRequired: false
    },
    study: {
      studyType: '',
      region: '',
      laterality: '',
      requestedByDate: ''
    },
    request: {
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomNumbness: false,
      symptomWeakness: false,
      symptomPain: false,
      symptomTingling: false,
      symptomDuration: ''
    },
    safety: {
      diabetes: false,
      takingAnticoagulant: false,
      pacemakerOrIcd: false
    },
    triage: {
      urgency: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a study type. */
const STUDY_TYPE_LABELS = {
  'nerve-conduction': 'Nerve conduction',
  'emg': 'Needle EMG',
  'nerve-conduction-and-emg': 'Nerve conduction + EMG',
  'repetitive-stimulation': 'Repetitive stimulation',
  'other': 'Other'
};

/** Human-readable label for a study type, falling back to the raw value. */
function studyTypeLabel(value) {
  return STUDY_TYPE_LABELS[value] || value || '';
}

/** Pretty label for an anatomical region. */
const REGION_LABELS = {
  'upper-limb': 'Upper limb',
  'lower-limb': 'Lower limb',
  'all-limbs': 'All limbs',
  'cranial': 'Cranial',
  'generalised': 'Generalised',
  'other': 'Other'
};

/** Human-readable label for a region, falling back to the raw value. */
function regionLabel(value) {
  return REGION_LABELS[value] || value || '';
}

/** Whether the requested study involves a needle-EMG component. */
function involvesNeedleEmg(studyType) {
  return studyType === 'emg' || studyType === 'nerve-conduction-and-emg';
}

/** Whether the requested study involves electrical stimulation. */
function involvesStimulation(studyType) {
  return (
    studyType === 'nerve-conduction' ||
    studyType === 'nerve-conduction-and-emg' ||
    studyType === 'repetitive-stimulation'
  );
}

export { emptyRequest, studyTypeLabel, regionLabel, involvesNeedleEmg, involvesStimulation, STUDY_TYPE_LABELS, REGION_LABELS };
