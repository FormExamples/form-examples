// Plain-JavaScript / JSDoc type definitions for the Pregnancy Ultrasound
// Test Request form.
//
// Builds the canonical empty `UltrasoundRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.PregnancyUltrasoundTestRequest`.

/**
 * Build a fresh, fully-blank obstetric ultrasound request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag / risk fields default to false.
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
      bodyMassIndex: null,
      interpreterRequired: false
    },
    dating: {
      lastMenstrualPeriodDate: '',
      lastMenstrualPeriodReliability: '',
      estimatedDueDate: '',
      estimatedDueDateMethod: '',
      gestationalAgeWeeks: null,
      gestationalAgeDays: null
    },
    history: {
      gravida: null,
      para: null,
      plurality: '',
      chorionicity: '',
      conceptionMethod: '',
      rhesusStatus: ''
    },
    request: {
      requestedScanType: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: '',
      previousScanFinding: '',
      previousScanDate: ''
    },
    symptoms: {
      vaginalBleeding: '',
      abdominalPain: '',
      reducedFetalMovements: false,
      suspectedEctopic: false,
      haemodynamicallyUnstable: false
    },
    riskFactors: {
      hypertension: false,
      diabetes: false,
      previousGrowthRestriction: false,
      previousPretermBirth: false,
      previousCaesarean: false,
      smoker: false
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
 * Convert a gestational age expressed as weeks + days into a total number of
 * days. Returns null when no gestational age has been entered.
 */
function gestationalAgeToDays(weeks, days) {
  if (weeks === null || weeks === undefined || weeks === '') return null;
  const w = Number(weeks);
  const d = days === null || days === undefined || days === '' ? 0 : Number(days);
  if (Number.isNaN(w) || Number.isNaN(d)) return null;
  return w * 7 + d;
}

/** Format a gestational age (weeks + days) in the canonical "W+D" form. */
function formatGestationalAge(weeks, days) {
  if (weeks === null || weeks === undefined || weeks === '') return '';
  const d = days === null || days === undefined || days === '' ? 0 : Number(days);
  return `${Number(weeks)}+${d}`;
}

/** Pretty label for a scan type. */
const SCAN_TYPE_LABELS = {
  'viability': 'Viability',
  'dating': 'Dating',
  'nuchal-translucency': 'Nuchal translucency / combined',
  'anomaly': 'Anomaly (anatomy)',
  'growth': 'Growth / wellbeing',
  'doppler': 'Doppler surveillance',
  'presentation': 'Presentation',
  'cervical-length': 'Cervical length',
  'placental-location': 'Placental location',
  'liquor-volume': 'Liquor volume',
  'reassurance': 'Reassurance',
  'other': 'Other'
};

/** Human-readable label for a scan type, falling back to the raw value. */
function scanTypeLabel(value) {
  return SCAN_TYPE_LABELS[value] || value || '';
}

export { emptyRequest, gestationalAgeToDays, formatGestationalAge, scanTypeLabel, SCAN_TYPE_LABELS };
