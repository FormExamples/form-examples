// Plain-JavaScript / JSDoc type definitions for the Endoscopy Test Request
// form.
//
// Builds the canonical empty `EndoscopyRequest` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention. Wrapped in an IIFE; published via
// `window.EndoscopyTestRequest`.

(function () {
'use strict';
window.EndoscopyTestRequest = window.EndoscopyTestRequest || {};

/**
 * Build a fresh, fully-blank GI endoscopy request.
 * Strings default to ''; numeric / date fields default to null;
 * boolean red-flag / risk / infection fields default to false.
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
    request: {
      requestedProcedure: '',
      primaryIndication: '',
      clinicalQuestion: '',
      relevantHistory: ''
    },
    redFlags: {
      redFlagDysphagia: false,
      redFlagWeightLoss: false,
      redFlagAnaemia: false,
      redFlagGiBleeding: false,
      redFlagAbdominalMass: false,
      redFlagAgeOver55: false,
      fitResultUgG: null,
      haemoglobinGL: null,
      ferritinUgL: null
    },
    medication: {
      takingAnticoagulant: false,
      anticoagulantAgent: '',
      takingAntiplatelet: false,
      antiplateletAgent: '',
      diabetesMedication: '',
      allergies: '',
      latexAllergy: false
    },
    comorbidities: {
      cardiacNyhaClass: '',
      pacemakerIcd: false,
      chronicKidneyDisease: false,
      egfrMlMin: null,
      sleepApnoea: false,
      neutropenia: false,
      asaGrade: ''
    },
    infectionPrep: {
      vcjdRisk: false,
      cpeCarriage: false,
      mrsa: false,
      bloodBorneVirus: false,
      fitForBowelPrep: false,
      bowelPrepAgent: '',
      sedation: '',
      escortAvailable: false
    },
    triage: {
      urgency: '',
      requestedByDate: '',
      setting: '',
      notes: ''
    }
  };
}

/** Pretty label for a procedure. */
const PROCEDURE_LABELS = {
  'ogd': 'OGD / gastroscopy',
  'gastroscopy': 'Gastroscopy',
  'colonoscopy': 'Colonoscopy',
  'flexible-sigmoidoscopy': 'Flexible sigmoidoscopy',
  'ercp': 'ERCP',
  'eus': 'EUS',
  'capsule': 'Capsule',
  'other': 'Other'
};

/** Human-readable label for a procedure, falling back to the raw value. */
function procedureLabel(value) {
  return PROCEDURE_LABELS[value] || value || '';
}

/** Pretty label for an indication. */
const INDICATION_LABELS = {
  'dyspepsia': 'Dyspepsia',
  'gord': 'GORD',
  'dysphagia': 'Dysphagia',
  'upper-gi-bleeding': 'Upper-GI bleeding',
  'iron-deficiency-anaemia': 'Iron-deficiency anaemia',
  'weight-loss': 'Weight loss',
  'suspected-malignancy': 'Suspected malignancy',
  'barretts-surveillance': "Barrett's surveillance",
  'h-pylori': 'H. pylori',
  'rectal-bleeding': 'Rectal bleeding',
  'change-in-bowel-habit': 'Change in bowel habit',
  'positive-fit': 'Positive FIT',
  'ibd-surveillance': 'IBD surveillance',
  'polyp-surveillance': 'Polyp surveillance',
  'abnormal-imaging': 'Abnormal imaging',
  'other': 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
function indicationLabel(value) {
  return INDICATION_LABELS[value] || value || '';
}

Object.assign(window.EndoscopyTestRequest, {
  emptyRequest,
  procedureLabel,
  indicationLabel,
  PROCEDURE_LABELS,
  INDICATION_LABELS
});
})();
