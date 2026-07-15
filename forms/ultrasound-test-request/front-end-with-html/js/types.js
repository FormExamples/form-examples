// Plain-JavaScript / JSDoc type definitions for the Ultrasound Test Request
// form (general, non-obstetric diagnostic ultrasound referral).
//
// Builds the canonical empty `UltrasoundRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank general ultrasound request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag / prep fields default to false.
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
      bodyRegion: '',
      laterality: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: '',
      previousScanFinding: '',
      previousScanDate: ''
    },
    prep: {
      fastingRequired: false,
      fullBladderRequired: false
    },
    redFlags: {
      suspectedDvt: false,
      suspectedTesticularTorsion: false,
      suspectedAaa: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a body region. */
const BODY_REGION_LABELS = {
  'abdomen': 'Abdomen',
  'pelvis': 'Pelvis',
  'renal-tract': 'Renal tract',
  'liver-biliary': 'Liver / biliary',
  'thyroid-neck': 'Thyroid / neck',
  'scrotum-testes': 'Scrotum / testes',
  'breast': 'Breast',
  'soft-tissue': 'Soft tissue',
  'vascular-doppler': 'Vascular Doppler',
  'dvt-leg': 'DVT (leg)',
  'carotid': 'Carotid',
  'msk-joint': 'MSK / joint',
  'other': 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
function bodyRegionLabel(value) {
  return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'abdominal-pain': 'Abdominal pain',
  'suspected-gallstones': 'Suspected gallstones',
  'abnormal-lfts': 'Abnormal LFTs',
  'renal-impairment': 'Renal impairment',
  'haematuria': 'Haematuria',
  'palpable-mass': 'Palpable mass',
  'suspected-dvt': 'Suspected DVT',
  'suspected-aaa': 'Suspected AAA',
  'thyroid-nodule': 'Thyroid nodule',
  'testicular-pain': 'Testicular pain',
  'follow-up': 'Follow-up',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, bodyRegionLabel, indicationLabel, BODY_REGION_LABELS, INDICATION_LABELS };
