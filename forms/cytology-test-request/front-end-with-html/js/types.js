// Plain-JavaScript / JSDoc type definitions for the Cytology Test Request form.
//
// Builds the canonical empty `CytologyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank cytology specimen request.
 * Strings default to ''; numeric / date / date-time fields default to null;
 * boolean context fields default to false.
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
      specimenType: '',
      specimenSite: '',
      primaryIndication: '',
      clinicalQuestion: '',
      clinicalDetails: ''
    },
    context: {
      hpvTestRequested: false,
      previousAbnormalCytology: '',
      lastMenstrualPeriodDate: ''
    },
    collection: {
      specimenCollected: '',
      collectionDatetime: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a specimen type. */
const SPECIMEN_TYPE_LABELS = {
  'cervical-smear': 'Cervical smear',
  'urine-cytology': 'Urine cytology',
  'sputum-cytology': 'Sputum cytology',
  'fluid-pleural-ascitic': 'Fluid — pleural / ascitic',
  'fine-needle-aspiration-thyroid': 'FNA — thyroid',
  'fine-needle-aspiration-breast': 'FNA — breast',
  'csf-cytology': 'CSF cytology',
  'other': 'Other'
};

/** Human-readable label for a specimen type, falling back to the raw value. */
function specimenTypeLabel(value) {
  return SPECIMEN_TYPE_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'cervical-screening': 'Cervical screening',
  'suspected-malignancy': 'Suspected malignancy',
  'haematuria': 'Haematuria',
  'effusion-investigation': 'Effusion investigation',
  'thyroid-nodule': 'Thyroid nodule',
  'breast-lump': 'Breast lump',
  'follow-up': 'Follow-up',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, specimenTypeLabel, indicationLabel, SPECIMEN_TYPE_LABELS, INDICATION_LABELS };
