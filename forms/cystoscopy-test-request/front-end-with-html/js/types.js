// Plain-JavaScript / JSDoc type definitions for the Cystoscopy Test Request
// form.
//
// Builds the canonical empty `CystoscopyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.CystoscopyTestRequest`.

/**
 * Build a fresh, fully-blank cystoscopy request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag / risk fields default to false.
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
      age: null,
      nhsNumber: ''
    },
    request: {
      procedure: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomHaematuria: false,
      symptomDysuria: false,
      symptomFrequency: false,
      symptomRetention: false,
      visibleHaematuria: false,
      currentUti: false
    },
    bleeding: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      previousBladderCancer: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a requested procedure. */
const PROCEDURE_LABELS = {
  'flexible-cystoscopy': 'Flexible cystoscopy',
  'rigid-cystoscopy': 'Rigid cystoscopy',
  'other': 'Other'
};

/** Human-readable label for a procedure, falling back to the raw value. */
function procedureLabel(value) {
  return PROCEDURE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'visible-haematuria': 'Visible haematuria',
  'non-visible-haematuria': 'Non-visible haematuria',
  'recurrent-uti': 'Recurrent UTI',
  'lower-urinary-tract-symptoms': 'Lower urinary tract symptoms',
  'bladder-cancer-surveillance': 'Bladder cancer surveillance',
  'suspected-bladder-tumour': 'Suspected bladder tumour',
  'urethral-stricture': 'Urethral stricture',
  'catheter-problems': 'Catheter problems',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, procedureLabel, indicationLabel, PROCEDURE_LABELS, INDICATION_LABELS };
