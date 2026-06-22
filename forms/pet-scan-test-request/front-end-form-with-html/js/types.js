// Plain-JavaScript / JSDoc type definitions for the PET Scan Test Request form.
//
// Builds the canonical empty `PetScanRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via `window.PetScanTestRequest`.

(function () {
'use strict';
window.PetScanTestRequest = window.PetScanTestRequest || {};

/**
 * Build a fresh, fully-blank PET-CT scan request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean safety fields default to false.
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
      setting: '',
      interpreterRequired: false
    },
    request: {
      scanType: '',
      primaryIndication: '',
      clinicalQuestion: ''
    },
    context: {
      primaryTumourSite: '',
      relevantHistory: '',
      recentChemoRadiotherapy: ''
    },
    preparation: {
      diabetes: false,
      bloodGlucoseMmolL: null,
      pregnancyStatus: '',
      breastfeeding: false,
      egfr: null,
      claustrophobia: false
    },
    justification: {
      irMeRJustification: '',
      urgency: ''
    },
    triage: {
      requestedByDate: '',
      notes: ''
    }
  };
}

/** Pretty label for a scan type / tracer. */
const SCAN_TYPE_LABELS = {
  'fdg-pet-ct': 'FDG-PET-CT ([18F]FDG)',
  'psma-pet': 'PSMA-PET',
  'dotatate-pet': 'DOTATATE-PET',
  'amyloid-pet': 'Amyloid-PET',
  'cardiac-pet': 'Cardiac-PET',
  'other': 'Other'
};

/** Human-readable label for a scan type, falling back to the raw value. */
function scanTypeLabel(value) {
  return SCAN_TYPE_LABELS[value] || value || '';
}

/** Whether the requested scan type is an FDG study (glucose-dependent). */
function isFdgStudy(scanType) {
  return scanType === 'fdg-pet-ct' || scanType === 'cardiac-pet';
}

Object.assign(window.PetScanTestRequest, {
  emptyRequest,
  scanTypeLabel,
  isFdgStudy,
  SCAN_TYPE_LABELS
});
})();
