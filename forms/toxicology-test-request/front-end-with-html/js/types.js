// Plain-JavaScript / JSDoc type definitions for the Toxicology Test Request
// form.
//
// Builds the canonical empty `ToxicologyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.ToxicologyTestRequest`.

/**
 * Canonical list of the orderable toxicology assays. The `field` is the
 * camelCase property on the `assays` section (matches the SQL boolean column
 * names); `label` is the human-readable name; `note` is an optional clinical
 * hint; `critical` marks assays whose timing or context drives safety flags.
 */
const ASSAYS = [
  { field: 'paracetamolLevel',      label: 'Paracetamol level', note: 'Nomogram ≥ 4 h', critical: true },
  { field: 'salicylateLevel',       label: 'Salicylate level', note: 'Aspirin; serial levels' },
  { field: 'alcoholLevel',          label: 'Alcohol level', note: 'Blood ethanol' },
  { field: 'drugsOfAbuseScreen',    label: 'Drugs-of-abuse screen', note: 'Opiates, benzodiazepines, cocaine, amphetamines' },
  { field: 'lithiumLevel',          label: 'Lithium level', note: 'TDM and toxicity' },
  { field: 'digoxinLevel',          label: 'Digoxin level', note: 'TDM and toxicity' },
  { field: 'antiepilepticDrugLevel', label: 'Antiepileptic drug level', note: 'Phenytoin, carbamazepine, valproate' },
  { field: 'carboxyhaemoglobin',    label: 'Carboxyhaemoglobin', note: 'Carbon-monoxide exposure' },
  { field: 'heavyMetals',           label: 'Heavy metals', note: 'Lead, mercury, arsenic' },
  { field: 'specificDrugLevel',     label: 'Specific drug level', note: 'Named agent in suspected agent' }
];

/**
 * Build a fresh, fully-blank toxicology request.
 * Strings default to ''; numeric / date / time fields default to null;
 * boolean assay / context fields default to false.
 */
function emptyRequest() {
  const assays = {};
  for (const a of ASSAYS) assays[a.field] = false;
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
    assays: assays,
    clinical: {
      primaryIndication: '',
      clinicalDetails: '',
      suspectedAgent: '',
      timeSinceIngestionHours: null,
      deliberateOverdose: false,
      symptomatic: false
    },
    specimen: {
      specimenCollected: '',
      collectionDatetime: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Count the number of selected (true) assays. */
function countSelectedAssays(assays) {
  if (!assays) return 0;
  let n = 0;
  for (const a of ASSAYS) if (assays[a.field] === true) n++;
  return n;
}

/** Human-readable label for an assay field, falling back to the raw value. */
function assayLabel(field) {
  const a = ASSAYS.find((x) => x.field === field);
  return a ? a.label : (field || '');
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-overdose': 'Suspected overdose',
  'deliberate-self-harm': 'Deliberate self-harm',
  'therapeutic-drug-monitoring': 'Therapeutic drug monitoring',
  'suspected-poisoning': 'Suspected poisoning',
  'substance-misuse-screen': 'Substance-misuse screen',
  'occupational-screen': 'Occupational screen',
  'forensic': 'Forensic',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { ASSAYS, emptyRequest, countSelectedAssays, assayLabel, indicationLabel, INDICATION_LABELS };
