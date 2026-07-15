// Plain-JavaScript / JSDoc type definitions for the Biopsy Test Request form.
//
// Builds the canonical empty `BiopsyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.BiopsyTestRequest`.

/**
 * Build a fresh, fully-blank biopsy request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean fields default to false.
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
    procedure: {
      biopsySite: '',
      biopsyMethod: '',
      laterality: '',
      imagingGuidanceRequired: false,
      setting: ''
    },
    indication: {
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    lesion: {
      lesionDescription: '',
      lesionSize: null,
      lesionLocation: '',
      imagingCorrelate: '',
      previousFinding: ''
    },
    bleeding: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      antiplateletAgent: '',
      inr: null,
      plateletCount: null,
      bleedingDisorder: false,
      immunosuppressed: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a biopsy site. */
const BIOPSY_SITE_LABELS = {
  'skin': 'Skin',
  'breast': 'Breast',
  'lymph-node': 'Lymph node',
  'liver': 'Liver',
  'kidney': 'Kidney',
  'prostate': 'Prostate',
  'lung': 'Lung',
  'bone-marrow': 'Bone marrow',
  'gi-tract': 'GI tract',
  'thyroid': 'Thyroid',
  'soft-tissue': 'Soft tissue',
  'other': 'Other'
};

/** Pretty label for a biopsy method. */
const BIOPSY_METHOD_LABELS = {
  'punch': 'Punch',
  'excision': 'Excision',
  'incision': 'Incision',
  'core-needle': 'Core needle',
  'fine-needle-aspiration': 'Fine-needle aspiration',
  'image-guided': 'Image-guided',
  'endoscopic': 'Endoscopic',
  'other': 'Other'
};

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-malignancy': 'Suspected malignancy',
  'cancer-staging': 'Cancer staging',
  'suspected-infection': 'Suspected infection',
  'inflammatory-disease': 'Inflammatory disease',
  'transplant-monitoring': 'Transplant monitoring',
  'lymphadenopathy': 'Lymphadenopathy',
  'characterise-lesion': 'Characterise lesion',
  'other': 'Other'
};

/** Human-readable label for a biopsy site, falling back to the raw value. */
function biopsySiteLabel(value) {
  return BIOPSY_SITE_LABELS[value] || value || '';
}

/** Human-readable label for a biopsy method, falling back to the raw value. */
function biopsyMethodLabel(value) {
  return BIOPSY_METHOD_LABELS[value] || value || '';
}

/** Human-readable label for a primary indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, biopsySiteLabel, biopsyMethodLabel, indicationLabel, BIOPSY_SITE_LABELS, BIOPSY_METHOD_LABELS, INDICATION_LABELS };
