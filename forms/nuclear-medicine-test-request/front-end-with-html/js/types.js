// Plain-JavaScript / JSDoc type definitions for the Nuclear Medicine Test
// Request form.
//
// Builds the canonical empty `NuclearMedicineRequest` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Property names are camelCase to match the front-end serde /
// examples convention. Wrapped in an IIFE; published via
// `window.NuclearMedicineTestRequest`.

/**
 * Build a fresh, fully-blank nuclear medicine request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean safety fields default to false.
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
      weightKg: null
    },
    request: {
      scanType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    safety: {
      pregnancyStatus: '',
      breastfeeding: false,
      egfr: null,
      recentOtherNuclearScan: false
    },
    justification: {
      irMeRJustification: '',
      supervisingConsultant: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a scan type. */
const SCAN_TYPE_LABELS = {
  'bone-scan': 'Bone scan (Tc-99m MDP)',
  'myocardial-perfusion': 'Myocardial perfusion',
  'vq-lung-scan': 'V/Q lung scan',
  'thyroid-uptake': 'Thyroid uptake',
  'renal-dmsa': 'Renal DMSA',
  'renal-mag3': 'Renal MAG3',
  'gallium-octreotide': 'Gallium / octreotide',
  'white-cell-scan': 'White-cell scan',
  'sentinel-node': 'Sentinel-node',
  'other': 'Other'
};

/** Human-readable label for a scan type, falling back to the raw value. */
function scanTypeLabel(value) {
  return SCAN_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-bone-metastases': 'Suspected bone metastases',
  'cardiac-ischaemia': 'Cardiac ischaemia',
  'pulmonary-embolism': 'Pulmonary embolism',
  'thyroid-function': 'Thyroid function',
  'renal-function': 'Renal function',
  'infection-localisation': 'Infection localisation',
  'tumour-localisation': 'Tumour localisation',
  'sentinel-node-mapping': 'Sentinel-node mapping',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, scanTypeLabel, indicationLabel, SCAN_TYPE_LABELS, INDICATION_LABELS };
