// Plain-JavaScript / JSDoc type definitions for the Electroencephalogram
// (EEG) Test Request form.
//
// Builds the canonical empty `EegRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.
// Wrapped in an IIFE; published via `window.ElectroencephalogramTestRequest`.

/**
 * Build a fresh, fully-blank EEG test request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag / context fields default to false.
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
    request: {
      eegType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    context: {
      seizureFrequency: '',
      currentAntiepileptics: '',
      firstSeizure: false,
      knownEpilepsy: false
    },
    redFlags: {
      recentSeizure: false,
      suspectedStatusEpilepticus: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for an EEG type. */
const EEG_TYPE_LABELS = {
  'routine-awake': 'Routine awake',
  'sleep-deprived': 'Sleep-deprived',
  'ambulatory-24h': 'Ambulatory 24-hour',
  'video-telemetry': 'Video-telemetry',
  'other': 'Other'
};

/** Human-readable label for an EEG type, falling back to the raw value. */
function eegTypeLabel(value) {
  return EEG_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'suspected-epilepsy': 'Suspected epilepsy',
  'seizure-classification': 'Seizure classification',
  'status-epilepticus': 'Status epilepticus',
  'encephalopathy': 'Encephalopathy',
  'first-seizure': 'First seizure',
  'funny-turns': 'Funny turns',
  'dementia': 'Dementia',
  'pre-surgical-evaluation': 'Pre-surgical evaluation',
  'medication-review': 'Medication review',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, eegTypeLabel, indicationLabel, EEG_TYPE_LABELS, INDICATION_LABELS };
