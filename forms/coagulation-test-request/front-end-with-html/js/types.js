// Plain-JavaScript / JSDoc type definitions for the Coagulation Test Request
// form.
//
// Builds the canonical empty `CoagulationTestRequest` shape so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Property names are camelCase to match the front-end serde /
// examples convention (snake_case in SQL).

/**
 * Canonical list of the orderable coagulation tests. The `field` is the
 * camelCase property on the `tests` section (matches the SQL boolean column
 * names: prothrombin_time_inr, activated_partial_thromboplastin_time, ...);
 * `label` is the human-readable name; `indication` is a short typical-use hint.
 */
const TESTS = [
  { field: 'prothrombinTimeInr',                 label: 'Prothrombin time / INR', hint: 'Warfarin monitoring; liver disease; DIC; pre-op screen' },
  { field: 'activatedPartialThromboplastinTime', label: 'Activated partial thromboplastin time (APTT)', hint: 'Heparin monitoring; unexplained bleeding; lupus anticoagulant' },
  { field: 'fibrinogen',                         label: 'Fibrinogen (Clauss)', hint: 'DIC; major haemorrhage; liver disease' },
  { field: 'dDimer',                             label: 'D-dimer', hint: 'Suspected DVT / PE with unlikely Wells; DIC' },
  { field: 'thrombophiliaScreen',                label: 'Thrombophilia screen', hint: 'Selected unprovoked VTE where result changes management' },
  { field: 'factorAssays',                       label: 'Factor assays', hint: 'Investigation of a confirmed bleeding disorder' },
  { field: 'antiXaAssay',                        label: 'Anti-Xa assay', hint: 'LMWH / DOAC level (renal impairment, weight extremes, pregnancy)' },
  { field: 'mixingStudies',                      label: 'Mixing studies', hint: 'Work-up of an unexplained prolonged PT / APTT' },
  { field: 'vonWillebrandScreen',                label: 'Von Willebrand screen', hint: 'Suspected vWD; mucocutaneous bleeding' }
];

/**
 * Build a fresh, fully-blank coagulation test request.
 * Strings default to ''; numeric / date / time fields default to null;
 * boolean test / history fields default to false.
 */
function emptyRequest() {
  const tests = {};
  for (const t of TESTS) tests[t.field] = false;
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
    tests: tests,
    clinical: {
      primaryIndication: '',
      clinicalDetails: '',
      onAnticoagulant: false,
      anticoagulantAgent: '',
      bleedingHistory: false,
      thrombosisHistory: false,
      activeBleeding: false,
      suspectedDic: false,
      wellsUnlikely: false
    },
    specimen: {
      specimenCollected: '',
      collectionDatetime: '',
      citrateTubeFill: '',
      citrateRatioCorrect: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      siteName: '',
      setting: '',
      notes: ''
    }
  };
}

/** Count how many coagulation tests are selected. */
function countSelectedTests(tests) {
  if (!tests) return 0;
  let n = 0;
  for (const t of TESTS) if (tests[t.field] === true) n++;
  return n;
}

/** List the human-readable labels of the selected tests. */
function selectedTestLabels(tests) {
  if (!tests) return [];
  return TESTS.filter((t) => tests[t.field] === true).map((t) => t.label);
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'anticoagulation-monitoring': 'Anticoagulation monitoring',
  'bleeding-disorder': 'Bleeding disorder',
  'suspected-dvt-pe': 'Suspected DVT / PE',
  'pre-operative': 'Pre-operative',
  'thrombophilia-investigation': 'Thrombophilia investigation',
  'liver-disease': 'Liver disease',
  'disseminated-intravascular-coagulation': 'Disseminated intravascular coagulation',
  'abnormal-bleeding': 'Abnormal bleeding',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, countSelectedTests, selectedTestLabels, indicationLabel, INDICATION_LABELS, TESTS };
