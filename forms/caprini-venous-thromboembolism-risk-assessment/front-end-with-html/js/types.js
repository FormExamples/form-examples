// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Caprini Venous Thromboembolism
// Risk Assessment form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_caprini_venous_thromboembolism_risk_assessment.sql`.
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, recommendedProphylaxisLabel,
// clinicianRoleLabel, careSettingLabel, admissionTypeLabel, sexLabel,
// ageBandLabel, weightGroupLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'surgeon' | 'nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'surgical-ward' | 'medical-ward' | 'pre-operative-clinic' | 'other' | ''} CareSetting
 * @typedef {'surgical' | 'medical' | ''} AdmissionType
 * @typedef {'under-41' | '41-60' | '61-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'very-low' | 'low' | 'moderate' | 'high'} RiskBand
 * @typedef {'early-ambulation' | 'mechanical' | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical'} Prophylaxis
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AdmissionType} admissionType
 */

/**
 * Step 2 — patient identification and age band.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — 1-point risk factors (each yes/no; the fixed weight applies on 'yes').
 * @typedef {Object} OnePoint
 * @property {YesNo} minorSurgery
 * @property {YesNo} recentMajorSurgery
 * @property {YesNo} varicoseVeins
 * @property {YesNo} inflammatoryBowelDisease
 * @property {YesNo} swollenLegs
 * @property {YesNo} obesity
 * @property {YesNo} acuteMyocardialInfarction
 * @property {YesNo} congestiveHeartFailure
 * @property {YesNo} sepsis
 * @property {YesNo} seriousLungDisease
 * @property {YesNo} abnormalPulmonaryFunction
 * @property {YesNo} medicalPatientBedRest
 * @property {YesNo} oralContraceptiveOrHrt
 * @property {YesNo} pregnancyOrPostpartum
 * @property {YesNo} adversePregnancyHistory
 */

/**
 * Step 4 — 2-point risk factors.
 * @typedef {Object} TwoPoint
 * @property {YesNo} arthroscopicSurgery
 * @property {YesNo} majorOpenSurgery
 * @property {YesNo} laparoscopicSurgery
 * @property {YesNo} malignancy
 * @property {YesNo} confinedToBed
 * @property {YesNo} immobilisingCast
 * @property {YesNo} centralVenousAccess
 */

/**
 * Step 5 — 3-point risk factors.
 * @typedef {Object} ThreePoint
 * @property {YesNo} historyOfVte
 * @property {YesNo} familyHistoryOfThrombosis
 * @property {YesNo} factorVLeiden
 * @property {YesNo} prothrombin20210a
 * @property {YesNo} lupusAnticoagulant
 * @property {YesNo} anticardiolipinAntibodies
 * @property {YesNo} elevatedHomocysteine
 * @property {YesNo} heparinInducedThrombocytopenia
 * @property {YesNo} otherThrombophilia
 */

/**
 * Step 6 — 5-point risk factors.
 * @typedef {Object} FivePoint
 * @property {YesNo} stroke
 * @property {YesNo} electiveArthroplasty
 * @property {YesNo} hipPelvisLegFracture
 * @property {YesNo} acuteSpinalCordInjury
 * @property {YesNo} multipleTrauma
 */

/**
 * Step 7 — bleeding risk.
 * @typedef {Object} Bleeding
 * @property {YesNo} highBleedingRisk
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {OnePoint} onePoint
 * @property {TwoPoint} twoPoint
 * @property {ThreePoint} threePoint
 * @property {FivePoint} fivePoint
 * @property {Bleeding} bleeding
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredFactor
 * @property {string} id           - stable rule id, e.g. R-HISTORY-OF-VTE-3POINT-01
 * @property {string} factor       - snake_case factor key, or age_band
 * @property {string} weightGroup  - age | 1-point | 2-point | 3-point | 5-point
 * @property {number} points       - points contributed
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} ageBandPoints
 * @property {Object<string, number>} groupSubtotals
 * @property {number} capriniScore
 * @property {RiskBand} riskBand
 * @property {Prophylaxis} baseProphylaxis
 * @property {Prophylaxis} recommendedProphylaxis
 * @property {boolean} bleedingDowngraded
 * @property {FiredFactor[]} firedFactors
 * @property {FiredFactor[]} factorPoints
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CapriniVenousThromboembolismRiskAssessment`.
(function () {
'use strict';
window.CapriniVenousThromboembolismRiskAssessment =
  window.CapriniVenousThromboembolismRiskAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings/enums default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      admissionType: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    onePoint: {
      minorSurgery: '',
      recentMajorSurgery: '',
      varicoseVeins: '',
      inflammatoryBowelDisease: '',
      swollenLegs: '',
      obesity: '',
      acuteMyocardialInfarction: '',
      congestiveHeartFailure: '',
      sepsis: '',
      seriousLungDisease: '',
      abnormalPulmonaryFunction: '',
      medicalPatientBedRest: '',
      oralContraceptiveOrHrt: '',
      pregnancyOrPostpartum: '',
      adversePregnancyHistory: ''
    },
    twoPoint: {
      arthroscopicSurgery: '',
      majorOpenSurgery: '',
      laparoscopicSurgery: '',
      malignancy: '',
      confinedToBed: '',
      immobilisingCast: '',
      centralVenousAccess: ''
    },
    threePoint: {
      historyOfVte: '',
      familyHistoryOfThrombosis: '',
      factorVLeiden: '',
      prothrombin20210a: '',
      lupusAnticoagulant: '',
      anticardiolipinAntibodies: '',
      elevatedHomocysteine: '',
      heparinInducedThrombocytopenia: '',
      otherThrombophilia: ''
    },
    fivePoint: {
      stroke: '',
      electiveArthroplasty: '',
      hipPelvisLegFracture: '',
      acuteSpinalCordInjury: '',
      multipleTrauma: ''
    },
    bleeding: {
      highBleedingRisk: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Age-band point weights (spec §4). */
const ageBandPoints = {
  'under-41': 0,
  '41-60': 1,
  '61-74': 2,
  '75-plus': 3
};

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'very-low': return 'Very low risk (Caprini 0-1)';
    case 'low': return 'Low risk (Caprini 2)';
    case 'moderate': return 'Moderate risk (Caprini 3-4)';
    case 'high': return 'High risk (Caprini 5+)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'very-low': return 'risk-low';
    case 'low': return 'risk-moderate';
    case 'moderate': return 'risk-high';
    case 'high': return 'risk-critical';
    default: return '';
  }
}

/** Recommended-prophylaxis label for display. */
function recommendedProphylaxisLabel(rec) {
  switch (rec) {
    case 'early-ambulation':
      return 'Early ambulation — no specific mechanical or pharmacological prophylaxis';
    case 'mechanical':
      return 'Mechanical prophylaxis (intermittent pneumatic compression and/or graduated compression stockings)';
    case 'pharmacological-or-mechanical':
      return 'Pharmacological prophylaxis (LMWH or low-dose unfractionated heparin) or mechanical prophylaxis; consider combining';
    case 'pharmacological-plus-mechanical':
      return 'Pharmacological prophylaxis plus mechanical prophylaxis; consider extended-duration prophylaxis';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'surgeon': return 'Surgeon';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'surgical-ward': return 'Surgical ward';
    case 'medical-ward': return 'Medical ward';
    case 'pre-operative-clinic': return 'Pre-operative clinic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Admission-type label. */
function admissionTypeLabel(type) {
  switch (type) {
    case 'surgical': return 'Surgical';
    case 'medical': return 'Medical';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-41': return 'Under 41';
    case '41-60': return '41-60 (1 point)';
    case '61-74': return '61-74 (2 points)';
    case '75-plus': return '75 and over (3 points)';
    default: return '';
  }
}

/** Weight-group label. */
function weightGroupLabel(group) {
  switch (group) {
    case 'age': return 'Age band';
    case '1-point': return '1 point';
    case '2-point': return '2 points';
    case '3-point': return '3 points';
    case '5-point': return '5 points';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.CapriniVenousThromboembolismRiskAssessment, {
  emptyAssessment,
  ageBandPoints,
  riskBandLabel,
  riskBandClass,
  recommendedProphylaxisLabel,
  clinicianRoleLabel,
  careSettingLabel,
  admissionTypeLabel,
  sexLabel,
  ageBandLabel,
  weightGroupLabel,
  priorityLabel
});
})();
