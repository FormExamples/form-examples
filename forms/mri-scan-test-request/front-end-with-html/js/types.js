// Plain-JavaScript / JSDoc type definitions for the MRI Scan Test Request
// form.
//
// Builds the canonical empty `MriRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.

/**
 * Build a fresh, fully-blank MRI scan request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean MRI-safety implant-screen fields default to false.
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
      weightKg: null,
      interpreterRequired: false
    },
    request: {
      bodyRegion: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    contrast: {
      contrastRequired: '',
      egfr: null,
      previousGadoliniumReaction: '',
      pregnancyStatus: ''
    },
    // MRI safety screen — full ferromagnetic / electronic implant checklist.
    safety: {
      pacemakerOrIcd: false,
      cochlearImplant: false,
      aneurysmClip: false,
      metallicForeignBodyEye: false,
      shrapnelOrMetalFragments: false,
      programmableShunt: false,
      neurostimulator: false,
      metalImplantOrProsthesis: false,
      insulinPump: false,
      claustrophobia: false,
      mriSafetyStatus: ''
    },
    priorImaging: {
      relevantPreviousImaging: ''
    },
    logistics: {
      weightVersusBoreLimit: '',
      setting: '',
      siteName: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a body region. */
const BODY_REGION_LABELS = {
  'brain': 'Brain',
  'spine-cervical': 'Spine — cervical',
  'spine-thoracic': 'Spine — thoracic',
  'spine-lumbar': 'Spine — lumbar',
  'head-neck': 'Head & neck',
  'chest': 'Chest',
  'abdomen': 'Abdomen',
  'pelvis': 'Pelvis',
  'cardiac': 'Cardiac',
  'mr-angiogram': 'MR angiogram',
  'breast': 'Breast',
  'musculoskeletal-joint': 'Musculoskeletal joint',
  'whole-body': 'Whole body',
  'other': 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
function bodyRegionLabel(value) {
  return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-malignancy': 'Suspected malignancy',
  'cancer-staging': 'Cancer staging',
  'neurological-deficit': 'Neurological deficit',
  'suspected-ms': 'Suspected MS',
  'back-pain-radiculopathy': 'Back pain with radiculopathy',
  'joint-derangement': 'Joint derangement',
  'suspected-stroke': 'Suspected stroke',
  'epilepsy': 'Epilepsy',
  'dementia': 'Dementia',
  'pituitary': 'Pituitary',
  'cardiac-function': 'Cardiac function',
  'follow-up-surveillance': 'Follow-up / surveillance',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, bodyRegionLabel, indicationLabel, BODY_REGION_LABELS, INDICATION_LABELS };
