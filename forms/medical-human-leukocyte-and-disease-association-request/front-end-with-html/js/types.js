// Plain-JavaScript / JSDoc type definitions for the Medical Human Leukocyte and
// Disease Association Request form.
//
// Builds the canonical empty request so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. Property names are
// camelCase to match the front-end serde / examples convention.

/** Test catalogue: state field, SQL test_code, label, typical use, tubes needed (mL, minimum). */
const TEST_DEFINITIONS = [
  {
    "field": "hlaA29",
    "code": "hla-a29",
    "label": "HLA-A29",
    "use": "birdshot chorioretinopathy",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaB27",
    "code": "hla-b27",
    "label": "HLA-B27",
    "use": "ankylosing spondylitis, uveitis",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaB51",
    "code": "hla-b51",
    "label": "HLA-B51",
    "use": "Behcet disease",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaB5701",
    "code": "hla-b-57-01",
    "label": "HLA-B*57:01",
    "use": "abacavir hypersensitivity (pre-prescribing)",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaDr15Dq6",
    "code": "hla-dr15-dq6",
    "label": "HLA-DR15/DQ6",
    "use": "narcolepsy",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaDq2Dq8",
    "code": "hla-dq2-dq8",
    "label": "HLA-DQ2/DQ8",
    "use": "coeliac disease",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "hlaDqa105",
    "code": "hla-dqa1-05",
    "label": "HLA-DQA1*05",
    "use": "anti-TNF response in Crohn disease (emerging)",
    "samples": {
      "edta": 5
    }
  },
  {
    "field": "otherHlaDiseaseAssociation",
    "code": "other-hla-disease-association",
    "label": "Other HLA-disease association (specify)",
    "use": "named allele or antigen",
    "samples": {
      "edta": 5
    }
  }
];

/**
 * Build a fresh, fully-blank request. Strings default to ''; numeric and date
 * fields default to null (strings for date inputs); booleans default to false.
 */
function emptyRequest() {
  return {
    patient: {
      familyName: '',
      givenNames: '',
      previousName: '',
      birthDate: '',
      sex: '',
      ethnicity: '',
      nationalHealthIdentifier: '',
      medicalRecordNumber: '',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: '',
      clinicianRole: '',
      clinicianEmail: '',
      department: '',
      organization: '',
      copyOfReportTo: '',
      reportEmail: ''
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: '',
      clinicalDetails: '',
      plannedDrug: '',
      previousHlaTypingKnown: false
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: false,
      highRiskDescription: ''
    },
    requester: {
      requestedBySignedAt: '',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: '',
      sampleCollectedAt: '',
      identifiersOnSampleCount: null,
      identifiersOnFormCount: null,
      sampleAndFormDetailsMatch: false,
      sampleVolumeMl: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

const INDICATION_LABELS = {
  'suspected-disease': 'Suspected disease',
  'pre-treatment-drug-hypersensitivity': 'Pre-treatment drug hypersensitivity',
  'treatment-response': 'Treatment response',
  'family-screening': 'Family screening',
  'exclusion-of-disease': 'Exclusion of disease',
  'other': 'Other'
};

function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** Selected tests, as { field, code, label, use, samples }. */
function selectedTests(data) {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}

export { emptyRequest, indicationLabel, selectedTests, TEST_DEFINITIONS, INDICATION_LABELS };
