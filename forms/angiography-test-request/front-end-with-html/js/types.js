// Plain-JavaScript / JSDoc type definitions for the Angiography Test Request
// form.
//
// Builds the canonical empty `AngiographyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank vascular angiography request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean safety / risk fields default to false.
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
      interpreterRequired: false
    },
    request: {
      angiographyType: '',
      bodyRegion: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    contrast: {
      contrastRequired: '',
      egfr: null,
      contrastAllergy: false,
      diabetes: false,
      metformin: false
    },
    bleeding: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      bleedingDisorder: false
    },
    pregnancy: {
      pregnancyStatus: '',
      irMeRJustification: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for an angiography type. */
const ANGIOGRAPHY_TYPE_LABELS = {
  'ct-angiography': 'CT angiography (CTA)',
  'mr-angiography': 'MR angiography (MRA)',
  'catheter-dsa': 'Catheter / DSA',
  'coronary-angiography': 'Coronary angiography',
  'peripheral-angiography': 'Peripheral angiography',
  'cerebral-angiography': 'Cerebral angiography',
  'other': 'Other'
};

/** Human-readable label for an angiography type, falling back to the raw value. */
function angiographyTypeLabel(value) {
  return ANGIOGRAPHY_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a body region. */
const BODY_REGION_LABELS = {
  'coronary': 'Coronary',
  'cerebral': 'Cerebral',
  'carotid': 'Carotid',
  'aorta': 'Aorta',
  'renal': 'Renal',
  'peripheral-lower-limb': 'Peripheral (lower limb)',
  'pulmonary': 'Pulmonary',
  'mesenteric': 'Mesenteric',
  'other': 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
function bodyRegionLabel(value) {
  return BODY_REGION_LABELS[value] || value || '';
}

/**
 * Whether the requested examination uses ionising radiation. CT, catheter /
 * DSA, coronary, peripheral, and cerebral angiography all use X-rays; MR
 * angiography does not.
 */
function usesIonisingRadiation(angiographyType) {
  return angiographyType !== '' && angiographyType !== 'mr-angiography';
}

export { emptyRequest, angiographyTypeLabel, bodyRegionLabel, usesIonisingRadiation, ANGIOGRAPHY_TYPE_LABELS, BODY_REGION_LABELS };
