// Plain-JavaScript / JSDoc type definitions for the Tumor Marker Test Request
// form.
//
// Builds the canonical empty `TumorMarkerRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. The requested tumour markers are modelled as BOOLEAN fields
// (mirroring the BOOLEAN columns in SQL migration 04), defaulting to false.
// Wrapped in an IIFE; published via `window.TumorMarkerTestRequest`.

(function () {
'use strict';
window.TumorMarkerTestRequest =
  window.TumorMarkerTestRequest || {};

/**
 * Build a fresh, fully-blank serum tumour-marker request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean marker / context fields default to false.
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
    markers: {
      psa: false,
      ca125: false,
      ca19_9: false,
      carcinoembryonicAntigenCea: false,
      alphaFetoproteinAfp: false,
      betaHcg: false,
      ca15_3: false,
      lactateDehydrogenaseLdh: false,
      calcitonin: false,
      chromograninA: false
    },
    context: {
      primaryIndication: '',
      clinicalDetails: '',
      knownCancerSite: '',
      onTreatment: false,
      previousMarkerValue: null,
      previousMarkerDate: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/**
 * The ten serum tumour markers, in display order. Each entry carries the
 * camelCase state field name, a short label, the marker abbreviation, and the
 * established appropriate use (per the index.md marker-to-indication table).
 */
const MARKERS = [
  { field: 'psa',                         label: 'PSA',            use: 'Prostate cancer (informed-choice; not screening)' },
  { field: 'ca125',                       label: 'CA125',          use: 'Suspected ovarian cancer (NICE CG122 / NG12)' },
  { field: 'ca19_9',                      label: 'CA19-9',         use: 'Pancreatic / hepatobiliary cancer' },
  { field: 'carcinoembryonicAntigenCea',  label: 'CEA',            use: 'Colorectal cancer monitoring / recurrence' },
  { field: 'alphaFetoproteinAfp',         label: 'AFP',            use: 'Hepatocellular carcinoma; germ-cell tumours' },
  { field: 'betaHcg',                     label: 'beta-hCG',       use: 'Germ-cell / trophoblastic tumours' },
  { field: 'ca15_3',                      label: 'CA15-3',         use: 'Breast cancer monitoring' },
  { field: 'lactateDehydrogenaseLdh',     label: 'LDH',            use: 'Germ-cell staging; lymphoma prognosis' },
  { field: 'calcitonin',                  label: 'Calcitonin',     use: 'Medullary thyroid carcinoma' },
  { field: 'chromograninA',               label: 'Chromogranin A', use: 'Neuroendocrine tumours' }
];

/** Pretty label for a tumour-marker state field. */
const MARKER_LABELS = MARKERS.reduce((acc, m) => {
  acc[m.field] = m.label;
  return acc;
}, {});

/** Human-readable label for a marker field, falling back to the raw value. */
function markerLabel(field) {
  return MARKER_LABELS[field] || field || '';
}

/** Count how many markers are currently selected (true). */
function countSelectedMarkers(markers) {
  if (!markers) return 0;
  return MARKERS.reduce((n, m) => n + (markers[m.field] === true ? 1 : 0), 0);
}

/** Return the list of selected marker field names, in display order. */
function selectedMarkerFields(markers) {
  if (!markers) return [];
  return MARKERS.filter((m) => markers[m.field] === true).map((m) => m.field);
}

/** Pretty label for an indication value. */
const INDICATION_LABELS = {
  'suspected-malignancy': 'Suspected malignancy',
  'cancer-monitoring': 'Cancer monitoring',
  'treatment-response': 'Treatment response',
  'recurrence-surveillance': 'Recurrence surveillance',
  'screening-high-risk': 'Screening (high-risk)',
  'characterise-mass': 'Characterise mass',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.TumorMarkerTestRequest, {
  emptyRequest,
  MARKERS,
  MARKER_LABELS,
  markerLabel,
  countSelectedMarkers,
  selectedMarkerFields,
  INDICATION_LABELS,
  indicationLabel
});
})();
