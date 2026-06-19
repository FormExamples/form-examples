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
 * Strings default to ''; numeric / date / time fields default to null;
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
    // Requested urine test panel — each test is a boolean order line.
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
      dysuria: false,
      frequency: false,
      visibleHaematuria: false,
      loinPain: false,
      fever: false
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

/** Ordered list of the eight requestable urine tests (field + label). */
const TEST_DEFINITIONS = [
  { field: 'dipstick', label: 'Dipstick (reagent strip)' },
  { field: 'microscopyCultureSensitivity', label: 'Microscopy, culture & sensitivity (MC&S)' },
  { field: 'albuminCreatinineRatio', label: 'Albumin-creatinine ratio (ACR)' },
  { field: 'proteinCreatinineRatio', label: 'Protein-creatinine ratio (PCR)' },
  { field: 'pregnancyTest', label: 'Pregnancy test (hCG)' },
  { field: 'drugScreen', label: 'Drug screen / toxicology' },
  { field: 'cytology', label: 'Cytology' },
  { field: 'twentyFourHourCollection', label: '24-hour collection' }
];

/** Pretty label for a requested test field. */
const TEST_LABELS = TEST_DEFINITIONS.reduce((acc, t) => {
  acc[t.field] = t.label;
  return acc;
}, {});

/** Count the requested tests that are selected (true). */
function countSelectedTests(tests) {
  if (!tests) return 0;
  return TEST_DEFINITIONS.reduce(
    (n, t) => n + (tests[t.field] === true ? 1 : 0),
    0
  );
}

/** Field names of the tests currently selected, in canonical order. */
function selectedTestFields(tests) {
  if (!tests) return [];
  return TEST_DEFINITIONS.filter((t) => tests[t.field] === true).map((t) => t.field);
}

/** Human-readable label for a requested test field, falling back to raw. */
function testLabel(field) {
  return TEST_LABELS[field] || field || '';
}

Object.assign(window.UrinalysisTestRequest, {
  emptyRequest,
  TEST_DEFINITIONS,
  TEST_LABELS,
  countSelectedTests,
  selectedTestFields,
  testLabel
});
})();
