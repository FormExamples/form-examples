// Plain-JavaScript / JSDoc type definitions for the Microbiology Culture Test
// Request form.
//
// Builds the canonical empty `MicrobiologyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. The requested tests are modelled as BOOLEAN fields, mirroring the
// `test_*` columns in SQL migration 04. Wrapped in an IIFE; published via
// `window.MicrobiologyCultureTestRequest`.

/**
 * Build a fresh, fully-blank microbiology culture request.
 * Strings default to ''; date / time fields default to ''; boolean test and
 * clinical-factor fields default to false.
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
      nhsNumber: ''
    },
    specimen: {
      specimenType: '',
      specimenSiteDetail: '',
      specimenCollected: '',
      collectionDatetime: ''
    },
    tests: {
      cultureAndSensitivity: false,
      gramStain: false,
      acidFastBacilliTb: false,
      fungalCulture: false,
      pcrMolecular: false,
      cDifficileToxin: false,
      mrsaScreen: false
    },
    clinical: {
      primaryIndication: '',
      clinicalDetails: '',
      fever: false,
      currentAntibiotics: false,
      antibioticName: '',
      recentTravel: false,
      immunocompromised: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Ordered list of the requestable test booleans (field key + label). */
const TEST_FIELDS = [
  { field: 'cultureAndSensitivity', label: 'Culture & sensitivity (MC&S)', primary: true },
  { field: 'gramStain', label: 'Gram stain / microscopy' },
  { field: 'acidFastBacilliTb', label: 'Acid-fast bacilli (AFB / TB)' },
  { field: 'fungalCulture', label: 'Fungal culture' },
  { field: 'pcrMolecular', label: 'PCR / molecular' },
  { field: 'cDifficileToxin', label: 'C. difficile toxin' },
  { field: 'mrsaScreen', label: 'MRSA screen' }
];

/** Count how many test booleans are set in the tests sub-object. */
function countSelectedTests(tests) {
  if (!tests) return 0;
  let n = 0;
  for (const t of TEST_FIELDS) {
    if (tests[t.field] === true) n++;
  }
  return n;
}

/** True when at least one requestable test boolean is set. */
function anyTestSelected(tests) {
  return countSelectedTests(tests) > 0;
}

/** Pretty label for a specimen type. */
const SPECIMEN_TYPE_LABELS = {
  'blood-culture': 'Blood culture',
  'urine': 'Urine',
  'wound-swab': 'Wound swab',
  'sputum': 'Sputum',
  'throat-swab': 'Throat swab',
  'stool': 'Stool',
  'csf': 'CSF',
  'tissue': 'Tissue',
  'catheter-tip': 'Catheter tip',
  'genital-swab': 'Genital swab',
  'other': 'Other'
};

/** Human-readable label for a specimen type, falling back to the raw value. */
function specimenTypeLabel(value) {
  return SPECIMEN_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-sepsis': 'Suspected sepsis',
  'urinary-tract-infection': 'Urinary-tract infection',
  'wound-infection': 'Wound infection',
  'respiratory-infection': 'Respiratory infection',
  'gastroenteritis': 'Gastroenteritis',
  'meningitis': 'Meningitis',
  'sti-screen': 'STI screen',
  'pyrexia-unknown-origin': 'Pyrexia of unknown origin',
  'infection-screening': 'Infection screening',
  'other': 'Other'
};

/** Human-readable label for a primary indication, falling back to raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, TEST_FIELDS, countSelectedTests, anyTestSelected, specimenTypeLabel, SPECIMEN_TYPE_LABELS, indicationLabel, INDICATION_LABELS };
