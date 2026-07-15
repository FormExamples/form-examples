// Plain-JavaScript / JSDoc type definitions for the Blood Test Request form.
//
// Builds the canonical empty `BloodTestRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Canonical list of the orderable blood-test panels. The `field` is the
 * camelCase property on the `panels` section (matches the SQL boolean column
 * names and examples/assessment.json); `label` is the human-readable name;
 * `critical` marks panels that escalate triage; `fasting` marks panels that
 * are best collected fasting.
 */
const PANELS = [
  { field: 'fullBloodCount',   label: 'Full blood count (FBC)' },
  { field: 'ureaElectrolytes', label: 'Urea & electrolytes (U&E)' },
  { field: 'liverFunction',    label: 'Liver function (LFT)' },
  { field: 'thyroidFunction',  label: 'Thyroid function (TFT)' },
  { field: 'hba1c',            label: 'HbA1c (diagnostic)' },
  { field: 'lipidProfile',     label: 'Lipid profile', fasting: true },
  { field: 'cReactiveProtein', label: 'C-reactive protein (CRP)' },
  { field: 'coagulationScreen', label: 'Coagulation screen (PT / APTT)' },
  { field: 'boneProfile',      label: 'Bone profile' },
  { field: 'ferritinIron',     label: 'Ferritin / iron studies' },
  { field: 'vitaminB12Folate', label: 'Vitamin B12 & folate' },
  { field: 'vitaminD',         label: 'Vitamin D (25-OH)' },
  { field: 'hba1cMonitoring',  label: 'HbA1c monitoring' },
  { field: 'glucose',          label: 'Glucose', fasting: true },
  { field: 'inr',              label: 'INR' },
  { field: 'bloodCulture',     label: 'Blood culture', critical: true },
  { field: 'groupAndSave',     label: 'Group & save' },
  { field: 'crossmatch',       label: 'Crossmatch', critical: true },
  { field: 'troponin',         label: 'Troponin', critical: true },
  { field: 'dDimer',           label: 'D-dimer', critical: true },
  { field: 'amylaseLipase',    label: 'Amylase / lipase' }
];

/**
 * Build a fresh, fully-blank blood-test request.
 * Strings default to ''; numeric / date / time fields default to null;
 * boolean panel / safety fields default to false.
 */
function emptyRequest() {
  const panels = {};
  for (const p of PANELS) panels[p.field] = false;
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
    panels: panels,
    clinical: {
      primaryIndication: '',
      clinicalDetails: '',
      relevantMedications: ''
    },
    preanalytical: {
      fastingRequired: false,
      fastingStatus: '',
      specimenCollected: '',
      collectionDate: '',
      collectionTime: ''
    },
    safety: {
      knownBloodBorneVirus: false,
      difficultVenousAccess: false
    },
    triage: {
      urgency: '',
      setting: '',
      notes: ''
    }
  };
}

/** Count the number of selected (true) panels. */
function countSelectedPanels(panels) {
  if (!panels) return 0;
  let n = 0;
  for (const p of PANELS) if (panels[p.field] === true) n++;
  return n;
}

/** Return the panel descriptors that are currently selected. */
function selectedPanels(panels) {
  if (!panels) return [];
  return PANELS.filter((p) => panels[p.field] === true);
}

/** Pretty label for an indication value. */
const INDICATION_LABELS = {
  'routine-monitoring': 'Routine monitoring',
  'anaemia': 'Anaemia',
  'fatigue': 'Fatigue',
  'infection': 'Infection',
  'diabetes-monitoring': 'Diabetes monitoring',
  'thyroid-symptoms': 'Thyroid symptoms',
  'cardiovascular-risk': 'Cardiovascular risk',
  'liver-disease': 'Liver disease',
  'renal-monitoring': 'Renal monitoring',
  'anticoagulation-monitoring': 'Anticoagulation monitoring',
  'pre-operative': 'Pre-operative',
  'suspected-malignancy': 'Suspected malignancy',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, countSelectedPanels, selectedPanels, indicationLabel, PANELS, INDICATION_LABELS };
