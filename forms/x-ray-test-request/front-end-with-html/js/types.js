// Plain-JavaScript / JSDoc type definitions for the X-Ray Test Request form.
//
// Builds the canonical empty `XRayRequest` shape so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.
// Wrapped in an IIFE; published via `window.XRayTestRequest`.

/**
 * Build a fresh, fully-blank plain-radiograph (X-ray) request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean fields default to false.
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
      bodyRegion: '',
      laterality: '',
      primaryIndication: ''
    },
    detail: {
      clinicalQuestion: '',
      relevantHistory: ''
    },
    safety: {
      pregnancyStatus: '',
      recentSimilarXray: false,
      irMeRJustification: ''
    },
    practical: {
      mobility: '',
      setting: '',
      requestedByDate: ''
    },
    triage: {
      urgency: '',
      notes: ''
    }
  };
}

/** Pretty label for a body region. */
const BODY_REGION_LABELS = {
  'chest': 'Chest',
  'abdomen': 'Abdomen',
  'spine-cervical': 'Spine (cervical)',
  'spine-thoracic': 'Spine (thoracic)',
  'spine-lumbar': 'Spine (lumbar)',
  'pelvis': 'Pelvis',
  'hip': 'Hip',
  'knee': 'Knee',
  'ankle-foot': 'Ankle / foot',
  'shoulder': 'Shoulder',
  'wrist-hand': 'Wrist / hand',
  'skull': 'Skull',
  'dental': 'Dental',
  'other': 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
function bodyRegionLabel(value) {
  return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS = {
  'trauma-fracture': 'Trauma / fracture',
  'chest-infection': 'Chest infection',
  'suspected-pneumothorax': 'Suspected pneumothorax',
  'foreign-body': 'Foreign body',
  'joint-pain': 'Joint pain',
  'arthritis': 'Arthritis',
  'pre-operative': 'Pre-operative',
  'line-position-check': 'Line-position check',
  'abdominal-obstruction': 'Abdominal obstruction',
  'swallowed-object': 'Swallowed object',
  'follow-up': 'Follow-up',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

export { emptyRequest, bodyRegionLabel, indicationLabel, BODY_REGION_LABELS, INDICATION_LABELS };
