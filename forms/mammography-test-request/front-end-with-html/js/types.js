// Plain-JavaScript / JSDoc type definitions for the Mammography Test Request
// form.
//
// Builds the canonical empty `MammographyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.MammographyTestRequest`.

/**
 * Build a fresh, fully-blank mammography request.
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
      bodyMassIndex: null
    },
    request: {
      examType: '',
      primaryIndication: '',
      laterality: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      symptomLump: false,
      symptomPain: false,
      symptomNippleDischarge: false,
      symptomSkinChange: false,
      symptomNippleInversion: false
    },
    history: {
      previousMammogram: '',
      previousMammogramDate: '',
      familyHistoryBreastCancer: false,
      breastImplants: false,
      pregnancyOrLactating: '',
      hormoneReplacementTherapy: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      siteName: '',
      notes: ''
    }
  };
}

/** Pretty label for an exam type. */
const EXAM_TYPE_LABELS = {
  'screening': 'Screening',
  'diagnostic': 'Diagnostic',
  'symptomatic': 'Symptomatic',
  'surveillance': 'Surveillance',
  'other': 'Other'
};

/** Human-readable label for an exam type, falling back to the raw value. */
function examTypeLabel(value) {
  return EXAM_TYPE_LABELS[value] || value || '';
}

export { emptyRequest, examTypeLabel, EXAM_TYPE_LABELS };
