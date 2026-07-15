// Plain-JavaScript / JSDoc type definitions for the DEXA Bone Density Test
// Request form.
//
// Builds the canonical empty `DexaRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank DEXA bone-density request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean risk / red-flag fields default to false.
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
      pregnancyStatus: ''
    },
    request: {
      scanRegion: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    riskFactors: {
      fraxMajorFracturePercent: null,
      previousFragilityFracture: false,
      longTermSteroids: false,
      menopauseStatus: '',
      parentalHipFracture: false,
      weightKg: null
    },
    previousDexa: {
      previousDexa: '',
      previousDexaDate: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a scan region. */
const SCAN_REGION_LABELS = {
  'hip': 'Hip',
  'spine': 'Spine',
  'hip-and-spine': 'Hip and spine',
  'forearm': 'Forearm',
  'whole-body': 'Whole body',
  'other': 'Other'
};

/** Human-readable label for a scan region, falling back to the raw value. */
function scanRegionLabel(value) {
  return SCAN_REGION_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'osteoporosis-screening': 'Osteoporosis screening',
  'fragility-fracture': 'Fragility fracture',
  'long-term-steroids': 'Long-term steroids',
  'early-menopause': 'Early menopause',
  'high-frax-risk': 'High FRAX risk',
  'monitoring-treatment': 'Monitoring treatment',
  'secondary-osteoporosis': 'Secondary osteoporosis',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, scanRegionLabel, indicationLabel, SCAN_REGION_LABELS, INDICATION_LABELS };
