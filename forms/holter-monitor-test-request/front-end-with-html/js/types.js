// Plain-JavaScript / JSDoc type definitions for the Holter Monitor Test
// Request form.
//
// Builds the canonical empty `HolterRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.HolterMonitorTestRequest`.

/**
 * Build a fresh, fully-blank ambulatory ECG (Holter) monitoring request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean symptom / red-flag fields default to false.
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
      bodyMassIndex: null
    },
    request: {
      monitorType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    symptoms: {
      palpitations: false,
      syncope: false,
      presyncope: false,
      breathlessness: false,
      symptomFrequency: ''
    },
    cardiac: {
      knownArrhythmia: '',
      recentStrokeTia: false,
      relevantMedications: ''
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a monitor type. */
const MONITOR_TYPE_LABELS = {
  '24-hour': '24-hour Holter',
  '48-hour': '48-hour Holter',
  '7-day': '7-day monitor',
  '14-day': '14-day monitor',
  'event-recorder': 'Event recorder',
  'implantable-loop-recorder': 'Implantable loop recorder',
  'other': 'Other'
};

/** Human-readable label for a monitor type, falling back to the raw value. */
function monitorTypeLabel(value) {
  return MONITOR_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'palpitations': 'Palpitations',
  'suspected-arrhythmia': 'Suspected arrhythmia',
  'syncope': 'Syncope',
  'atrial-fibrillation-detection': 'Atrial-fibrillation detection',
  'post-stroke-af-screen': 'Post-stroke AF screen',
  'rate-control-assessment': 'Rate-control assessment',
  'qt-monitoring': 'QT monitoring',
  'pacemaker-check': 'Pacemaker check',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, monitorTypeLabel, indicationLabel, MONITOR_TYPE_LABELS, INDICATION_LABELS };
