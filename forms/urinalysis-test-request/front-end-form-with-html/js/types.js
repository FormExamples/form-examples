// Plain-JavaScript / JSDoc type definitions for the Urinalysis Test Request
// form.
//
// Builds the canonical empty `UrinalysisRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.UrinalysisTestRequest`.

(function () {
'use strict';
window.UrinalysisTestRequest = window.UrinalysisTestRequest || {};

/**
 * Build a fresh, fully-blank urinalysis test request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean test / symptom / modifier fields default to false.
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
    // Requested test panel — each test is a boolean order line.
    tests: {
      dipstick: false,
      microscopyCultureSensitivity: false,
      albuminCreatinineRatio: false,
      proteinCreatinineRatio: false,
      pregnancyTest: false,
      drugScreen: false,
      cytology: false,
      twentyFourHourCollection: false
    },
    context: {
      primaryIndication: '',
      clinicalDetails: '',
      pregnant: false,
      catheterised: false,
      currentAntibiotics: false
    },
    symptoms: {
      symptomDysuria: false,
      symptomFrequency: false,
      symptomVisibleHaematuria: false,
      symptomLoinPain: false,
      symptomFever: false
    },
    specimen: {
      specimenType: '',
      specimenCollected: '',
      collectionDatetime: ''
    },
    triage: {
      urgency: '',
      setting: '',
      notes: ''
    }
  };
}

/**
 * Catalogue of requested tests. `field` is the camelCase key on `tests`;
 * `critical` tests (cytology, 24-hour collection) carry a preanalytical /
 * handling caveat surfaced in the UI.
 */
const TESTS = [
  { field: 'dipstick', label: 'Dipstick (reagent strip)' },
  { field: 'microscopyCultureSensitivity', label: 'Microscopy, culture & sensitivity (MC&S)' },
  { field: 'albuminCreatinineRatio', label: 'Albumin-creatinine ratio (ACR)' },
  { field: 'proteinCreatinineRatio', label: 'Protein-creatinine ratio (PCR)' },
  { field: 'pregnancyTest', label: 'Pregnancy test (hCG)' },
  { field: 'drugScreen', label: 'Drug screen / toxicology' },
  { field: 'cytology', label: 'Cytology', tag: 'malignancy' },
  { field: 'twentyFourHourCollection', label: '24-hour collection', tag: 'handling' }
];

/** Count how many tests are selected in the panel. */
function countSelectedTests(tests) {
  if (!tests) return 0;
  return TESTS.reduce((n, t) => n + (tests[t.field] === true ? 1 : 0), 0);
}

/** Pretty label for a test field. */
const TEST_LABELS = TESTS.reduce((m, t) => {
  m[t.field] = t.label;
  return m;
}, {});

/** Human-readable label for a test field, falling back to the raw value. */
function testLabel(field) {
  return TEST_LABELS[field] || field || '';
}

Object.assign(window.UrinalysisTestRequest, {
  emptyRequest,
  TESTS,
  TEST_LABELS,
  countSelectedTests,
  testLabel
});
})();
