// Plain-JavaScript / JSDoc type definitions for the Bronchoscopy Test Request
// form.
//
// Builds the canonical empty `BronchoscopyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.BronchoscopyTestRequest`.

/**
 * Build a fresh, fully-blank bronchoscopy request.
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
      procedure: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomHaemoptysis: false,
      haemoptysisSeverity: '',
      symptomCough: false,
      symptomBreathlessness: false,
      symptomWeightLoss: false,
      imagingFindings: ''
    },
    bleeding: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      antiplateletAgent: '',
      plateletCount: null
    },
    procedural: {
      oxygenDependent: false,
      asaGrade: '',
      sedation: '',
      haemodynamicallyUnstable: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a procedure. */
const PROCEDURE_LABELS = {
  'flexible-bronchoscopy': 'Flexible bronchoscopy',
  'ebus': 'EBUS (endobronchial ultrasound)',
  'rigid-bronchoscopy': 'Rigid bronchoscopy',
  'bronchoalveolar-lavage': 'Bronchoalveolar lavage',
  'other': 'Other'
};

/** Human-readable label for a procedure, falling back to the raw value. */
function procedureLabel(value) {
  return PROCEDURE_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'suspected-lung-cancer': 'Suspected lung cancer',
  'haemoptysis': 'Haemoptysis',
  'persistent-cough': 'Persistent cough',
  'lung-mass-on-imaging': 'Lung mass on imaging',
  'mediastinal-lymphadenopathy': 'Mediastinal lymphadenopathy',
  'infection-sampling': 'Infection sampling',
  'foreign-body': 'Foreign body',
  'stridor': 'Stridor',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, procedureLabel, indicationLabel, PROCEDURE_LABELS, INDICATION_LABELS };
