// Plain-JavaScript / JSDoc type definitions for the CT Scan Test Request form.
//
// Builds the canonical empty `CtScanRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.CtScanTestRequest`.

(function () {
'use strict';
window.CtScanTestRequest = window.CtScanTestRequest || {};

/**
 * Build a fresh, fully-blank CT scan request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean safety / risk fields default to false.
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
      weightKg: null,
      interpreterRequired: false
    },
    request: {
      bodyRegion: '',
      primaryIndication: '',
      clinicalQuestion: ''
    },
    context: {
      relevantHistory: '',
      relevantPreviousImaging: ''
    },
    contrast: {
      contrastRequired: '',
      egfr: null,
      iodineContrastAllergy: false,
      previousContrastReaction: '',
      metformin: false,
      diabetes: false,
      renalImpairment: false
    },
    radiation: {
      pregnancyStatus: '',
      irMeRJustification: ''
    },
    triage: {
      urgency: '',
      setting: '',
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a CT body region. */
const BODY_REGION_LABELS = {
  'head': 'Head',
  'neck': 'Neck',
  'chest': 'Chest',
  'abdomen': 'Abdomen',
  'pelvis': 'Pelvis',
  'abdomen-pelvis': 'Abdomen / pelvis',
  'spine': 'Spine',
  'ct-angiogram': 'CT angiogram',
  'ct-colonography': 'CT colonography',
  'whole-body': 'Whole body',
  'extremity': 'Extremity',
  'other': 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
function bodyRegionLabel(value) {
  return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty label for a contrast requirement. */
const CONTRAST_LABELS = {
  'none': 'None',
  'iv-iodinated': 'IV iodinated',
  'oral': 'Oral',
  'both': 'IV + oral',
  'unknown': 'Unknown'
};

/** Human-readable label for a contrast requirement. */
function contrastLabel(value) {
  return CONTRAST_LABELS[value] || value || '';
}

/** True when the requested study involves intravascular iodinated contrast. */
function usesIvContrast(contrastRequired) {
  return contrastRequired === 'iv-iodinated' || contrastRequired === 'both';
}

Object.assign(window.CtScanTestRequest, {
  emptyRequest,
  bodyRegionLabel,
  contrastLabel,
  usesIvContrast,
  BODY_REGION_LABELS,
  CONTRAST_LABELS
});
})();
