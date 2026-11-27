// Plain-JavaScript / JSDoc type definitions for the Medical Renal Transplant
// Recipient Request form.
//
// Builds the canonical empty request so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. Property names are
// camelCase to match the front-end serde / examples convention.

/** Test catalogue: state field, SQL test_code, label, group, tubes needed (mL). */
const TEST_DEFINITIONS = [
  {
    "field": "listRegistrationFirstTypingAndRetyping",
    "code": "list-registration-first-typing-and-retyping",
    "label": "First typing and re-typing",
    "group": "Transplant list registration",
    "samples": {
      "edta": 10,
      "pink": 6,
      "serum": 12
    }
  },
  {
    "field": "listRegistrationReturningToList",
    "code": "list-registration-returning-to-list",
    "label": "Returning to list",
    "group": "Transplant list registration",
    "samples": {
      "edta": 10,
      "pink": 6,
      "serum": 12
    }
  },
  {
    "field": "listRegistrationOther",
    "code": "list-registration-other",
    "label": "Other list registration test (specify)",
    "group": "Transplant list registration",
    "samples": {
      "edta": 10,
      "pink": 6,
      "serum": 12
    }
  },
  {
    "field": "deceasedDonorFullCrossmatch",
    "code": "deceased-donor-full-crossmatch",
    "label": "Full crossmatch",
    "group": "Deceased donor testing",
    "samples": {
      "edta": 30,
      "serum": 12
    }
  },
  {
    "field": "deceasedDonorDayOfTransplant",
    "code": "deceased-donor-day-of-transplant",
    "label": "Day of transplant",
    "group": "Deceased donor testing",
    "samples": {
      "edta": 30,
      "serum": 12
    }
  },
  {
    "field": "livingDonorFullCrossmatch",
    "code": "living-donor-full-crossmatch",
    "label": "Full crossmatch",
    "group": "Living donor testing",
    "samples": {
      "edta": 30,
      "pink": 6,
      "serum": 12,
      "abo": 6
    }
  },
  {
    "field": "livingDonorDayOfTransplant",
    "code": "living-donor-day-of-transplant",
    "label": "Day of transplant",
    "group": "Living donor testing",
    "samples": {
      "edta": 30,
      "pink": 6,
      "serum": 12,
      "abo": 6
    }
  },
  {
    "field": "livingDonorVirtualCrossmatch",
    "code": "living-donor-virtual-crossmatch",
    "label": "Virtual crossmatch",
    "group": "Living donor testing",
    "samples": {
      "edta": 10,
      "pink": 6,
      "serum": 12,
      "abo": 6
    }
  },
  {
    "field": "livingDonorMatchGrade",
    "code": "living-donor-match-grade",
    "label": "Match grade",
    "group": "Living donor testing",
    "samples": {
      "edta": 10,
      "pink": 6,
      "serum": 12,
      "abo": 6
    }
  },
  {
    "field": "livingDonorAboTitresOnly",
    "code": "living-donor-abo-titres-only",
    "label": "ABO titres only",
    "group": "Living donor testing",
    "samples": {
      "edta": 6
    }
  },
  {
    "field": "autologousCrossmatch",
    "code": "autologous-crossmatch",
    "label": "Autologous crossmatch",
    "group": "Autologous",
    "samples": {
      "edta": 10,
      "serum": 12
    }
  },
  {
    "field": "hlaMonitoringRoutineTransplantList",
    "code": "hla-antibody-monitoring-routine-transplant-list",
    "label": "Routine transplant list",
    "group": "Routine HLA-antibody monitoring",
    "samples": {
      "serum": 12
    }
  },
  {
    "field": "hlaMonitoringRoutinePostTransplant",
    "code": "hla-antibody-monitoring-routine-post-transplant",
    "label": "Routine post-transplant list",
    "group": "Routine HLA-antibody monitoring",
    "samples": {
      "serum": 12
    }
  },
  {
    "field": "hlaMonitoringPostTransfusion",
    "code": "hla-antibody-monitoring-post-transfusion",
    "label": "Post-transfusion",
    "group": "Routine HLA-antibody monitoring",
    "samples": {
      "serum": 12
    }
  },
  {
    "field": "hlaRejectionInvestigation",
    "code": "hla-rejection-investigation",
    "label": "HLA rejection investigation",
    "group": "Investigation",
    "samples": {
      "serum": 12
    }
  },
  {
    "field": "aboIncompatibleMonitoring",
    "code": "abo-incompatible-transplant-monitoring",
    "label": "ABO-incompatible transplant monitoring",
    "group": "Investigation",
    "samples": {
      "edta": 6
    }
  },
  {
    "field": "redCellAntibodyFollowUp",
    "code": "red-cell-antibody-follow-up",
    "label": "Follow-up red-cell antibody investigation",
    "group": "Investigation",
    "samples": {
      "edta": 6
    }
  }
];

/**
 * Build a fresh, fully-blank request. Strings default to ''; numeric and date
 * fields default to null (strings for date inputs); booleans default to false.
 */
function emptyRequest() {
  return {
    recipient: {
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
    history: {
      organRequired: '',
      previousTransplantCount: null,
      previousTransplantDates: '',
      transfusionCount: null,
      transfusionDates: '',
      pregnancyCount: null,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: '',
      dialysisMode: '',
      dialysisUnitName: ''
    },
    tests: {
      listRegistrationFirstTypingAndRetyping: false,
      listRegistrationReturningToList: false,
      listRegistrationOther: false,
      deceasedDonorFullCrossmatch: false,
      deceasedDonorDayOfTransplant: false,
      livingDonorFullCrossmatch: false,
      livingDonorDayOfTransplant: false,
      livingDonorVirtualCrossmatch: false,
      livingDonorMatchGrade: false,
      livingDonorAboTitresOnly: false,
      autologousCrossmatch: false,
      hlaMonitoringRoutineTransplantList: false,
      hlaMonitoringRoutinePostTransplant: false,
      hlaMonitoringPostTransfusion: false,
      hlaRejectionInvestigation: false,
      aboIncompatibleMonitoring: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: '',
      dfppStatus: '',
      postTransfusionDatesAndNumber: '',
      donorReference: ''
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
      samplesSerumCount: null
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

const ORGAN_LABELS = {
  'kidney': 'Kidney only',
  'kidney-pancreas': 'Kidney / pancreas',
  'pancreas': 'Pancreas only'
};

const DIALYSIS_MODE_LABELS = {
  'unit-haemodialysis': 'Unit haemodialysis',
  'capd': 'CAPD',
  'home-peritoneal-dialysis': 'Home peritoneal dialysis',
  'pre-dialysis': 'Pre-dialysis',
  'failing-transplant': 'Failing transplant'
};

const ABO_LABELS = { 'a': 'A', 'b': 'B', 'ab': 'AB', 'o': 'O', 'unknown': 'Unknown' };

function organLabel(value) {
  return ORGAN_LABELS[value] || value || '';
}

function dialysisModeLabel(value) {
  return DIALYSIS_MODE_LABELS[value] || value || '';
}

function aboLabel(value) {
  return ABO_LABELS[value] || value || '';
}

/** Selected tests, as { field, code, label, group, samples }. */
function selectedTests(data) {
  return TEST_DEFINITIONS.filter((t) => data.tests[t.field] === true);
}

export {
  emptyRequest, organLabel, dialysisModeLabel, aboLabel, selectedTests,
  TEST_DEFINITIONS, ORGAN_LABELS, DIALYSIS_MODE_LABELS, ABO_LABELS
};
