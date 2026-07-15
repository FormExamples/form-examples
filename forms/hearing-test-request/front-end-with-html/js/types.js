// Plain-JavaScript / JSDoc type definitions for the Hearing Test Request form.
//
// Builds the canonical empty `HearingRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank hearing test request.
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
      interpreterRequired: false
    },
    request: {
      testType: '',
      laterality: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      hearingLoss: false,
      tinnitus: false,
      vertigo: false,
      otalgia: false,
      suddenOnset: false,
      onsetWithinDays: '',
      earDischarge: false,
      ototoxicMedication: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a test type. */
const TEST_TYPE_LABELS = {
  'pure-tone-audiometry': 'Pure-tone audiometry',
  'tympanometry': 'Tympanometry',
  'speech-audiometry': 'Speech audiometry',
  'otoacoustic-emissions': 'Otoacoustic emissions',
  'auditory-brainstem-response': 'Auditory brainstem response',
  'newborn-hearing-screen': 'Newborn hearing screen',
  'hearing-aid-assessment': 'Hearing-aid assessment',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

export { emptyRequest, testTypeLabel, TEST_TYPE_LABELS };
