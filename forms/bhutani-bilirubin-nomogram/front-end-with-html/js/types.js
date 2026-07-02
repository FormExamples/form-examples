// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Bhutani Bilirubin Nomogram form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_bhutani_bilirubin_nomogram.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (riskZoneLabel,
// riskZoneClass, percentileBandLabel, clinicianRoleLabel, careSettingLabel,
// sexLabel, measurementMethodLabel, priorityLabel).

/**
 * @typedef {'midwife' | 'neonatal-nurse' | 'paediatrician' | 'other' | ''} ClinicianRole
 * @typedef {'postnatal-ward' | 'neonatal-unit' | 'midwife-led-unit' | 'community' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'serum' | 'transcutaneous' | ''} MeasurementMethod
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'low-intermediate' | 'high-intermediate' | 'high' | null} RiskZone
 * @typedef {'<40' | '40-75' | '75-95' | '>=95' | null} PercentileBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — infant identification.
 * @typedef {Object} Identification
 * @property {string} infantIdentifier
 * @property {Sex} sex
 * @property {string} bornAt                     - datetime-local string; '' when unset
 * @property {number | null} gestationalAgeWeeks - weeks; selects the threshold curve
 */

/**
 * Step 3 — bilirubin measurement.
 * @typedef {Object} Measurement
 * @property {number | null} ageHours                  - age at measurement (nomogram x-axis)
 * @property {number | null} totalSerumBilirubinUmolL  - measured TSB µmol/L (nomogram y-axis)
 * @property {MeasurementMethod} measurementMethod
 */

/**
 * Step 4 — neonatal hyperbilirubinaemia risk factors (each yes/no).
 * @typedef {Object} RiskFactors
 * @property {YesNo} pretermUnder38             - gestational age < 38 weeks
 * @property {YesNo} previousSiblingJaundice    - previous sibling required phototherapy / had jaundice
 * @property {YesNo} exclusiveBreastfeeding     - exclusively breastfed
 * @property {YesNo} bruising                   - significant bruising or cephalohaematoma
 * @property {YesNo} bloodGroupIncompatibility  - ABO / Rhesus incompatibility or positive DAT
 * @property {YesNo} earlyOnsetUnder24h         - jaundice onset before 24 hours of age
 */

/**
 * Step 5 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Measurement} measurement
 * @property {RiskFactors} riskFactors
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRiskFactor
 * @property {string} id           - stable field key, e.g. earlyOnsetUnder24h
 * @property {string} label        - human-readable label
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-ZONE-HIGH-INTERMEDIATE-01
 * @property {string} category     - zone-lookup | phototherapy-threshold | exchange-threshold
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
 * @property {number | null} ageHours
 * @property {RiskZone} riskZone
 * @property {PercentileBand} percentileBand
 * @property {number | null} p40                  - interpolated 40th-percentile track
 * @property {number | null} p75                  - interpolated 75th-percentile track
 * @property {number | null} p95                  - interpolated 95th-percentile track
 * @property {string} gestationBand
 * @property {number | null} phototherapyThreshold
 * @property {number | null} exchangeThreshold
 * @property {boolean} abovePhototherapy
 * @property {boolean} aboveExchange
 * @property {boolean} outOfRange
 * @property {FiredRiskFactor[]} firedRiskFactors
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.BhutaniBilirubinNomogram`.
(function () {
'use strict';
window.BhutaniBilirubinNomogram = window.BhutaniBilirubinNomogram || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: ''
    },
    identification: {
      infantIdentifier: '',
      sex: '',
      bornAt: '',
      gestationalAgeWeeks: null
    },
    measurement: {
      ageHours: null,
      totalSerumBilirubinUmolL: null,
      measurementMethod: ''
    },
    riskFactors: {
      pretermUnder38: '',
      previousSiblingJaundice: '',
      exclusiveBreastfeeding: '',
      bruising: '',
      bloodGroupIncompatibility: '',
      earlyOnsetUnder24h: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Human-readable label for each risk factor. */
const RISK_FACTOR_LABELS = {
  pretermUnder38: 'Gestational age below 38 weeks',
  previousSiblingJaundice: 'Previous sibling with neonatal jaundice',
  exclusiveBreastfeeding: 'Exclusively breastfed',
  bruising: 'Significant bruising or cephalohaematoma',
  bloodGroupIncompatibility: 'Blood-group incompatibility or positive DAT',
  earlyOnsetUnder24h: 'Jaundice onset before 24 hours of age'
};

/** Risk-zone label for display. */
function riskZoneLabel(zone) {
  switch (zone) {
    case 'low': return 'Low risk (< 40th centile)';
    case 'low-intermediate': return 'Low-intermediate risk (40th–75th)';
    case 'high-intermediate': return 'High-intermediate risk (75th–95th)';
    case 'high': return 'High risk (≥ 95th centile)';
    default: return 'Not classified';
  }
}

/** CSS class hint for the risk-zone badge (reuses the shared risk palette). */
function riskZoneClass(zone) {
  switch (zone) {
    case 'low': return 'risk-low';
    case 'low-intermediate': return 'risk-low';
    case 'high-intermediate': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Percentile-band label for display. */
function percentileBandLabel(band) {
  switch (band) {
    case '<40': return '< 40th percentile';
    case '40-75': return '40th–75th percentile';
    case '75-95': return '75th–95th percentile';
    case '>=95': return '≥ 95th percentile';
    default: return 'N/A';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'midwife': return 'Midwife';
    case 'neonatal-nurse': return 'Neonatal / paediatric nurse';
    case 'paediatrician': return 'Paediatrician';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'postnatal-ward': return 'Postnatal ward';
    case 'neonatal-unit': return 'Neonatal unit';
    case 'midwife-led-unit': return 'Midwife-led unit';
    case 'community': return 'Community / midwifery follow-up';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Infant-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Measurement-method label. */
function measurementMethodLabel(method) {
  switch (method) {
    case 'serum': return 'Serum bilirubin (SBR)';
    case 'transcutaneous': return 'Transcutaneous (TcB)';
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

Object.assign(window.BhutaniBilirubinNomogram, {
  emptyAssessment,
  RISK_FACTOR_LABELS,
  riskZoneLabel,
  riskZoneClass,
  percentileBandLabel,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  measurementMethodLabel,
  priorityLabel
});
})();
