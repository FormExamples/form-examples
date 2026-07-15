// Plain-JavaScript / JSDoc type definitions for the Colonoscopy Test Request
// form.
//
// Builds the canonical empty `ColonoscopyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.ColonoscopyTestRequest`.

/**
 * Build a fresh, fully-blank colonoscopy request.
 * Strings default to ''; numeric fields default to null; boolean red-flag /
 * medication / fitness fields default to false.
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
      setting: ''
    },
    request: {
      procedure: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    redFlags: {
      weightLoss: false,
      anaemia: false,
      abdominalMass: false,
      rectalBleeding: false,
      fitResultUgG: null,
      haemoglobinGL: null
    },
    medication: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      antiplateletAgent: '',
      diabetesMedication: ''
    },
    fitness: {
      fitForBowelPrep: false,
      bowelPrepAgent: '',
      chronicKidneyDisease: false,
      egfrMlMin: null,
      asaGrade: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a procedure. */
const PROCEDURE_LABELS = {
  'colonoscopy': 'Colonoscopy',
  'flexible-sigmoidoscopy': 'Flexible sigmoidoscopy',
  'ct-colonography': 'CT colonography',
  'other': 'Other'
};

/** Human-readable label for a procedure, falling back to the raw value. */
function procedureLabel(value) {
  return PROCEDURE_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'rectal-bleeding': 'Rectal bleeding',
  'change-in-bowel-habit': 'Change in bowel habit',
  'iron-deficiency-anaemia': 'Iron-deficiency anaemia',
  'positive-fit': 'Positive FIT',
  'abdominal-mass': 'Abdominal / rectal mass',
  'ibd-diagnosis': 'IBD diagnosis',
  'ibd-surveillance': 'IBD surveillance',
  'polyp-surveillance': 'Polyp surveillance',
  'crc-screening': 'CRC screening',
  'abnormal-imaging': 'Abnormal imaging',
  'chronic-diarrhoea': 'Chronic diarrhoea',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, procedureLabel, indicationLabel, PROCEDURE_LABELS, INDICATION_LABELS };
