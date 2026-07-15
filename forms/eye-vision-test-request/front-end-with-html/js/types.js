// Plain-JavaScript / JSDoc type definitions for the Eye Vision Test Request
// form.
//
// Builds the canonical empty `EyeVisionRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank eye vision test request.
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
      reducedVision: false,
      suddenLoss: false,
      flashesFloaters: false,
      eyePain: false,
      redEye: false
    },
    riskFactors: {
      diabetes: false,
      knownGlaucoma: false
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
  'visual-acuity': 'Visual acuity',
  'visual-fields': 'Visual fields',
  'refraction': 'Refraction',
  'fundus-examination': 'Fundus examination',
  'optical-coherence-tomography': 'Optical coherence tomography (OCT)',
  'fluorescein-angiography': 'Fluorescein angiography',
  'tonometry': 'Tonometry',
  'slit-lamp': 'Slit-lamp examination',
  'orthoptic-assessment': 'Orthoptic assessment',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'reduced-vision': 'Reduced vision',
  'suspected-glaucoma': 'Suspected glaucoma',
  'diabetic-retinopathy-screening': 'Diabetic retinopathy screening',
  'sudden-visual-loss': 'Sudden visual loss',
  'flashes-floaters': 'Flashes / floaters',
  'red-eye': 'Red eye',
  'childhood-squint': 'Childhood squint',
  'visual-field-defect': 'Visual-field defect',
  'cataract-assessment': 'Cataract assessment',
  'headache-visual-symptoms': 'Headache with visual symptoms',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, testTypeLabel, indicationLabel, TEST_TYPE_LABELS, INDICATION_LABELS };
