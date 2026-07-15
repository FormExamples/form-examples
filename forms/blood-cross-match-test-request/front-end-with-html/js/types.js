// Plain-JavaScript / JSDoc type definitions for the Blood Cross-Match Test
// Request form.
//
// Builds the canonical empty `CrossMatchRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank blood cross-match / transfusion request.
 * Strings default to ''; numeric / date / time fields default to null;
 * boolean history / red-flag fields default to false.
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
      positivePatientIdConfirmed: false
    },
    request: {
      requestType: '',
      component: '',
      unitsRequired: null,
      requestedByDate: '',
      requiredByDatetime: ''
    },
    indication: {
      primaryIndication: '',
      clinicalDetails: '',
      currentHaemoglobin: null,
      currentPlatelets: null,
      acuteCoronarySyndrome: false
    },
    history: {
      patientBloodGroup: '',
      knownAntibodies: false,
      antibodyDetail: '',
      previousTransfusion: false,
      previousTransfusionReaction: false,
      pregnant: false
    },
    sample: {
      sampleCollected: '',
      collectionDatetime: '',
      twoSampleRuleMet: false,
      labellingCheckComplete: false
    },
    triage: {
      urgency: '',
      massiveHaemorrhage: false,
      activeUncontrolledBleeding: false,
      haemodynamicallyUnstable: false,
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a request type. */
const REQUEST_TYPE_LABELS = {
  'group-and-save': 'Group and save',
  'antibody-screen': 'Antibody screen',
  'crossmatch': 'Crossmatch',
  'emergency-o-negative': 'Emergency O-negative',
  'other': 'Other'
};

/** Pretty label for a blood component. */
const COMPONENT_LABELS = {
  'red-cells': 'Red cells',
  'platelets': 'Platelets',
  'fresh-frozen-plasma': 'Fresh-frozen plasma',
  'cryoprecipitate': 'Cryoprecipitate',
  'none': 'None (sample only)'
};

/** Pretty label for a clinical indication. */
const INDICATION_LABELS = {
  'surgery': 'Surgery',
  'acute-bleeding': 'Acute bleeding',
  'anaemia': 'Anaemia (non-bleeding)',
  'obstetric-haemorrhage': 'Obstetric haemorrhage',
  'chemotherapy-support': 'Chemotherapy support',
  'transfusion-dependent': 'Transfusion-dependent',
  'other': 'Other'
};

/** Pretty label for an ABO/Rh blood group. */
const BLOOD_GROUP_LABELS = {
  'a-pos': 'A RhD positive',
  'a-neg': 'A RhD negative',
  'b-pos': 'B RhD positive',
  'b-neg': 'B RhD negative',
  'o-pos': 'O RhD positive',
  'o-neg': 'O RhD negative',
  'ab-pos': 'AB RhD positive',
  'ab-neg': 'AB RhD negative',
  'unknown': 'Unknown'
};

/** Human-readable label for a request type, falling back to the raw value. */
function requestTypeLabel(value) {
  return REQUEST_TYPE_LABELS[value] || value || '';
}

/** Human-readable label for a component, falling back to the raw value. */
function componentLabel(value) {
  return COMPONENT_LABELS[value] || value || '';
}

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

/** Human-readable label for a blood group, falling back to the raw value. */
function bloodGroupLabel(value) {
  return BLOOD_GROUP_LABELS[value] || value || '';
}

export { emptyRequest, requestTypeLabel, componentLabel, indicationLabel, bloodGroupLabel, REQUEST_TYPE_LABELS, COMPONENT_LABELS, INDICATION_LABELS, BLOOD_GROUP_LABELS };
