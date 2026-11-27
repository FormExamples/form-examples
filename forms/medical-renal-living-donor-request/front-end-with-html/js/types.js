// Plain-JavaScript / JSDoc type definitions for the Medical Renal Living Donor
// Request form.
//
// Builds the canonical empty request so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. Property names are
// camelCase to match the front-end serde / examples convention. The request
// is about the DONOR sample; the recipient is optional (an altruistic donor
// has none) and is only referenced for identity and matching.

/** Test catalogue: state field, SQL test_code, label, group, tubes needed (mL). Tube volumes are local policy. */
const TEST_DEFINITIONS = [
  {
    "field": "livingDonorFullCrossmatch",
    "code": "living-donor-full-crossmatch",
    "label": "Full crossmatch",
    "group": "Crossmatch and matching",
    "samples": {
      "edta": 30,
      "pink": 6,
      "abo": 6
    }
  },
  {
    "field": "livingDonorVirtualCrossmatch",
    "code": "living-donor-virtual-crossmatch",
    "label": "Virtual crossmatch",
    "group": "Crossmatch and matching",
    "samples": {
      "edta": 10,
      "pink": 6,
      "abo": 6
    }
  },
  {
    "field": "livingDonorMatchGrade",
    "code": "living-donor-match-grade",
    "label": "Match grade",
    "group": "Crossmatch and matching",
    "samples": {
      "edta": 10,
      "pink": 6,
      "abo": 6
    }
  },
  {
    "field": "altruisticDonor",
    "code": "altruistic-donor",
    "label": "Altruistic donor work-up",
    "group": "Donation pathway",
    "samples": {
      "edta": 10,
      "pink": 6
    }
  },
  {
    "field": "dayOfTransplantSamples",
    "code": "day-of-transplant-samples",
    "label": "Day-of-transplant samples",
    "group": "Day of transplant",
    "samples": {
      "edta": 20
    }
  },
  {
    "field": "aboTitresOnly",
    "code": "abo-titres-only",
    "label": "ABO titres only",
    "group": "ABO and red-cell antibodies",
    "samples": {
      "edta": 6
    }
  },
  {
    "field": "redCellAntibodyFollowUp",
    "code": "red-cell-antibody-follow-up",
    "label": "Follow-up red-cell antibody investigation",
    "group": "ABO and red-cell antibodies",
    "samples": {
      "edta": 6
    }
  }
];

const PERSON_FIELDS = {
  familyName: '',
  givenNames: '',
  previousName: '',
  birthDate: '',
  sex: '',
  nationalHealthIdentifier: '',
  medicalRecordNumber: '',
  address: '',
  postcode: ''
};

/**
 * Build a fresh, fully-blank request. Strings default to ''; numeric and date
 * fields default to null (strings for date inputs); booleans default to false.
 */
function emptyRequest() {
  return {
    donor: { ...PERSON_FIELDS },
    recipient: { ...PERSON_FIELDS },
    pathway: {
      donationPathway: '',
      relationshipOfDonorToRecipient: '',
      recipientTransplantCentreName: '',
      donorAboGroup: '',
      recipientAboGroup: ''
    },
    tests: {
      livingDonorFullCrossmatch: false,
      livingDonorVirtualCrossmatch: false,
      livingDonorMatchGrade: false,
      altruisticDonor: false,
      dayOfTransplantSamples: false,
      aboTitresOnly: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      clinicianName: '',
      clinicianRole: '',
      clinicianEmail: '',
      transplantCentreName: '',
      requestedBySignedAt: '',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: '',
      sampleCollectedAt: '',
      identifiersOnSampleCount: null,
      identifiersOnFormCount: null,
      sampleAndFormDetailsMatch: false,
      samplesEdtaPurpleCount: null,
      samplesEdtaPinkHandLabelledCount: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratoryDonorIdentifier: '',
      laboratoryRecipientIdentifier: '',
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

const PATHWAY_LABELS = {
  'directed': 'Directed donation',
  'altruistic': 'Altruistic (non-directed) donation',
  'paired-exchange': 'Paired exchange'
};

const ABO_LABELS = { 'a': 'A', 'b': 'B', 'ab': 'AB', 'o': 'O', 'unknown': 'Unknown' };

function pathwayLabel(value) {
  return PATHWAY_LABELS[value] || value || '';
}

function aboLabel(value) {
  return ABO_LABELS[value] || value || '';
}

/** Selected tests, as { field, code, label, group, samples }. */
function selectedTests(data) {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}

export {
  emptyRequest, pathwayLabel, aboLabel, selectedTests,
  TEST_DEFINITIONS, PATHWAY_LABELS, ABO_LABELS
};
