// Plain-JavaScript / JSDoc type definitions for the Genetic Test Request form.
//
// Builds the canonical empty `GeneticTestRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.GeneticTestRequest`.

/**
 * Build a fresh, fully-blank clinical genetics / genomic test request.
 * Strings default to ''; date fields default to ''; boolean fields default
 * to false.
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
      addressLine: ''
    },
    request: {
      testType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      requestedByDate: ''
    },
    clinical: {
      clinicalDetails: '',
      suspectedCondition: '',
      familyHistory: '',
      affectedRelativeTested: false
    },
    consent: {
      consentObtained: false,
      geneticCounsellingOffered: false
    },
    triage: {
      specimenType: '',
      urgency: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a test type. */
const TEST_TYPE_LABELS = {
  'diagnostic-single-gene': 'Diagnostic single gene',
  'gene-panel': 'Gene panel',
  'whole-exome': 'Whole exome',
  'whole-genome': 'Whole genome',
  'chromosomal-microarray': 'Chromosomal microarray',
  'karyotype': 'Karyotype',
  'predictive-presymptomatic': 'Predictive / presymptomatic',
  'carrier-testing': 'Carrier testing',
  'pharmacogenomic': 'Pharmacogenomic',
  'prenatal': 'Prenatal',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-genetic-disorder': 'Suspected genetic disorder',
  'familial-cancer': 'Familial cancer',
  'developmental-delay': 'Developmental delay',
  'congenital-anomaly': 'Congenital anomaly',
  'cardiomyopathy-arrhythmia': 'Cardiomyopathy / arrhythmia',
  'neuromuscular': 'Neuromuscular',
  'predictive-family-history': 'Predictive (family history)',
  'carrier-screening': 'Carrier screening',
  'prenatal-diagnosis': 'Prenatal diagnosis',
  'pharmacogenomics': 'Pharmacogenomics',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** True when the requested test is predictive / presymptomatic. */
function isPredictiveTest(testType, indication) {
  return (
    testType === 'predictive-presymptomatic' ||
    indication === 'predictive-family-history'
  );
}

/** True when the request is prenatal. */
function isPrenatalRequest(testType, indication, specimenType) {
  return (
    testType === 'prenatal' ||
    indication === 'prenatal-diagnosis' ||
    specimenType === 'prenatal'
  );
}

export { emptyRequest, testTypeLabel, indicationLabel, isPredictiveTest, isPrenatalRequest, TEST_TYPE_LABELS, INDICATION_LABELS };
