// Plain-JavaScript / JSDoc type definitions for the Cardiology Request form.
//
// Builds the canonical empty `CardiologyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank cardiology referral request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean symptom / red-flag / history fields default to false.
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
    request: {
      requestedService: '',
      referralReason: '',
      clinicalQuestion: '',
      relevantHistory: '',
      setting: ''
    },
    symptoms: {
      symptomChestPain: false,
      chestPainCharacter: '',
      symptomBreathlessness: false,
      nyhaClass: '',
      symptomPalpitations: false,
      symptomSyncope: false,
      symptomOedema: false
    },
    redFlags: {
      suspectedAcs: false,
      exertionalSyncope: false,
      newOnsetHeartFailure: false,
      ecgDone: false,
      ecgFindings: '',
      troponinStatus: '',
      bnpStatus: ''
    },
    history: {
      knownCoronaryArteryDisease: false,
      previousMi: false,
      heartFailure: false,
      valveDisease: false,
      arrhythmia: false,
      hypertension: false,
      diabetes: false,
      currentMedications: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a requested cardiology service. */
const SERVICE_LABELS = {
  'general-cardiology': 'General cardiology',
  'rapid-access-chest-pain': 'Rapid-access chest-pain clinic',
  'heart-failure': 'Heart-failure clinic',
  'arrhythmia-ep': 'Arrhythmia / EP clinic',
  'valve-clinic': 'Valve clinic',
  'inherited-cardiac-conditions': 'Inherited cardiac conditions',
  'pre-operative-cardiac': 'Pre-operative cardiac',
  'other': 'Other'
};

/** Human-readable label for a service, falling back to the raw value. */
function serviceLabel(value) {
  return SERVICE_LABELS[value] || value || '';
}

/** Pretty label for a referral reason. */
const REASON_LABELS = {
  'chest-pain': 'Chest pain',
  'breathlessness': 'Breathlessness',
  'palpitations': 'Palpitations',
  'syncope': 'Syncope',
  'heart-failure-symptoms': 'Heart-failure symptoms',
  'murmur-or-valve': 'Murmur / valve',
  'abnormal-ecg': 'Abnormal ECG',
  'hypertension': 'Hypertension',
  'arrhythmia': 'Arrhythmia',
  'pre-operative-assessment': 'Pre-operative assessment',
  'other': 'Other'
};

/** Human-readable label for a referral reason, falling back to the raw value. */
function reasonLabel(value) {
  return REASON_LABELS[value] || value || '';
}

export { emptyRequest, serviceLabel, reasonLabel, SERVICE_LABELS, REASON_LABELS };
