// Plain-JavaScript / JSDoc type definitions for the Allergy Skin Test
// Request form.
//
// Builds the canonical empty `AllergyTestRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Allergen panels and validity/safety history are modelled as
// boolean fields (defaulting to false), mirroring the BOOLEAN columns in the
// SQL source of truth. Wrapped in an IIFE; published via
// `window.AllergySkinTestRequest`.

/**
 * Build a fresh, fully-blank allergy test request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean allergen-panel / safety fields default to false.
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
      interpreterRequired: false
    },
    test: {
      testType: '',
      allergenAeroallergens: false,
      allergenFood: false,
      allergenDrug: false,
      allergenVenom: false,
      allergenLatex: false,
      allergenContact: false
    },
    indication: {
      primaryIndication: '',
      clinicalQuestion: '',
      clinicalDetails: ''
    },
    safety: {
      previousAnaphylaxis: false,
      onAntihistamines: false,
      onBetaBlocker: false,
      currentSkinDisease: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** The six allergen-panel boolean fields, in canonical display order. */
const ALLERGEN_PANELS = [
  { field: 'allergenAeroallergens', label: 'Aeroallergens', hint: 'Pollens, house dust mite, animal dander, moulds' },
  { field: 'allergenFood', label: 'Food', hint: 'Milk, egg, peanut, tree nut, fish, shellfish, wheat, soy' },
  { field: 'allergenDrug', label: 'Drug', hint: 'Beta-lactams, NSAIDs, perioperative agents' },
  { field: 'allergenVenom', label: 'Venom', hint: 'Bee, wasp / Vespula venom' },
  { field: 'allergenLatex', label: 'Latex', hint: 'Natural rubber latex' },
  { field: 'allergenContact', label: 'Contact', hint: 'Nickel, fragrances, preservatives (patch-test series)' }
];

/** Count how many allergen panels are selected in a test section. */
function countSelectedPanels(testSection) {
  if (!testSection) return 0;
  let n = 0;
  for (const p of ALLERGEN_PANELS) {
    if (testSection[p.field] === true) n++;
  }
  return n;
}

/** Return the kebab-case categories of the selected allergen panels. */
function selectedPanelCategories(testSection) {
  const out = [];
  if (!testSection) return out;
  if (testSection.allergenAeroallergens) out.push('aeroallergens');
  if (testSection.allergenFood) out.push('food');
  if (testSection.allergenDrug) out.push('drug');
  if (testSection.allergenVenom) out.push('venom');
  if (testSection.allergenLatex) out.push('latex');
  if (testSection.allergenContact) out.push('contact');
  return out;
}

/** Pretty label for a test type. */
const TEST_TYPE_LABELS = {
  'skin-prick-test': 'Skin-prick test',
  'intradermal-test': 'Intradermal test',
  'patch-test': 'Patch test',
  'specific-ige-blood': 'Specific-IgE blood',
  'drug-provocation-challenge': 'Drug-provocation challenge',
  'other': 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
function testTypeLabel(value) {
  return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-food-allergy': 'Suspected food allergy',
  'suspected-drug-allergy': 'Suspected drug allergy',
  'rhinitis-asthma': 'Rhinitis / asthma',
  'anaphylaxis-investigation': 'Anaphylaxis investigation',
  'venom-allergy': 'Venom allergy',
  'contact-dermatitis': 'Contact dermatitis',
  'urticaria': 'Urticaria',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, ALLERGEN_PANELS, countSelectedPanels, selectedPanelCategories, testTypeLabel, TEST_TYPE_LABELS, indicationLabel, INDICATION_LABELS };
