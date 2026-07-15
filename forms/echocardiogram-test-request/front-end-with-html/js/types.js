// Plain-JavaScript / JSDoc type definitions for the Echocardiogram Test
// Request form.
//
// Builds the canonical empty `EchoRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.

/**
 * Build a fresh, fully-blank echocardiogram request.
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
      heightAsCm: null,
      weightAsKg: null,
      bodyMassIndex: null
    },
    request: {
      echoType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: '',
      relevantMedications: '',
      previousEcho: '',
      previousEchoDate: '',
      ejectionFractionKnown: null
    },
    symptoms: {
      breathlessness: false,
      chestPain: false,
      palpitations: false,
      syncope: false,
      oedema: false,
      nyhaClass: ''
    },
    investigations: {
      ecgFindings: '',
      bnpOrNtProbnp: null,
      knownMurmur: false,
      onCardiotoxicChemotherapy: false
    },
    redFlags: {
      suspectedEndocarditis: false,
      severeSymptomaticValve: false,
      acuteHeartFailure: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for an echo type. */
const ECHO_TYPE_LABELS = {
  'transthoracic-tte': 'Transthoracic (TTE)',
  'transoesophageal-toe': 'Transoesophageal (TOE)',
  'stress-echo': 'Stress echo',
  'contrast-echo': 'Contrast echo',
  'other': 'Other'
};

/** Human-readable label for an echo type, falling back to the raw value. */
function echoTypeLabel(value) {
  return ECHO_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'heart-failure': 'Heart failure',
  'murmur': 'Murmur',
  'suspected-valve-disease': 'Suspected valve disease',
  'breathlessness': 'Breathlessness',
  'palpitations': 'Palpitations',
  'chest-pain': 'Chest pain',
  'hypertension': 'Hypertension',
  'cardiomyopathy': 'Cardiomyopathy',
  'endocarditis': 'Endocarditis',
  'post-mi': 'Post-MI',
  'pulmonary-hypertension': 'Pulmonary hypertension',
  'pre-chemotherapy': 'Pre-chemotherapy / cardio-oncology',
  'stroke-tia-source': 'Stroke / TIA source',
  'congenital': 'Congenital',
  'surveillance-known-disease': 'Surveillance of known disease',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, echoTypeLabel, indicationLabel, ECHO_TYPE_LABELS, INDICATION_LABELS };
