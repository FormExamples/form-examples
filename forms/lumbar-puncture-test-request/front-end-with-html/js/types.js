// Plain-JavaScript / JSDoc type definitions for the Lumbar Puncture Test
// Request form.
//
// Builds the canonical empty `LumbarPunctureRequest` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Property names are camelCase to match the front-end serde /
// examples convention. Wrapped in an IIFE; published via
// `window.LumbarPunctureTestRequest`.

/**
 * Build a fresh, fully-blank lumbar puncture request.
 * Strings default to ''; numeric fields default to null;
 * boolean safety fields default to false.
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
      nhsNumber: ''
    },
    procedure: {
      procedureIntent: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    neuroSafety: {
      suspectedRaisedIntracranialPressure: false,
      focalNeurologicalSigns: false,
      reducedConsciousness: false,
      ctHeadStatus: ''
    },
    bleeding: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      antiplateletAgent: '',
      inr: null,
      plateletCount: null,
      bleedingDisorder: false,
      localSkinInfection: false
    },
    triage: {
      openingPressureRequired: false,
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-meningitis': 'Suspected meningitis',
  'suspected-subarachnoid-haemorrhage': 'Suspected subarachnoid haemorrhage',
  'suspected-multiple-sclerosis': 'Suspected multiple sclerosis',
  'suspected-guillain-barre': 'Suspected Guillain-Barré',
  'idiopathic-intracranial-hypertension': 'Idiopathic intracranial hypertension',
  'suspected-cns-malignancy': 'Suspected CNS malignancy',
  'cns-infection': 'CNS infection',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** Pretty label for a procedure intent. */
const PROCEDURE_INTENT_LABELS = {
  'diagnostic': 'Diagnostic',
  'therapeutic': 'Therapeutic',
  'other': 'Other'
};

/** Human-readable label for a procedure intent. */
function procedureIntentLabel(value) {
  return PROCEDURE_INTENT_LABELS[value] || value || '';
}

export { emptyRequest, indicationLabel, procedureIntentLabel, INDICATION_LABELS, PROCEDURE_INTENT_LABELS };
