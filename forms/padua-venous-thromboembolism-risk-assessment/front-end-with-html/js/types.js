// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Padua Venous Thromboembolism
// Risk Assessment (Padua Prediction Score) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_padua_venous_thromboembolism_risk_assessment.sql`. This
// file builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, prophylaxisLabel, clinicianRoleLabel,
// careSettingLabel, sexLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'acute-medical' | 'general-medical' | 'admissions-unit' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'high'} RiskBand
 * @typedef {'pharmacological' | 'mechanical' | 'none'} ProphylaxisRecommendation
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} admissionReason
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears   - patient age in years; drives factor 6 (>= 70)
 * @property {Sex} sex
 */

/**
 * Step 3 — oncology and thrombosis history.
 * @typedef {Object} History
 * @property {YesNo} activeCancer          - factor 1 (3 points)
 * @property {YesNo} previousVte           - factor 2 (3 points)
 * @property {YesNo} knownThrombophilia    - factor 4 (3 points)
 */

/**
 * Step 4 — mobility and recent events.
 * @typedef {Object} Mobility
 * @property {YesNo} reducedMobility          - factor 3 (3 points)
 * @property {YesNo} recentTraumaOrSurgery    - factor 5 (2 points)
 */

/**
 * Step 5 — cardiorespiratory and acute illness.
 * @typedef {Object} Cardiorespiratory
 * @property {YesNo} heartOrRespiratoryFailure        - factor 7 (1 point)
 * @property {YesNo} acuteMiOrIschaemicStroke         - factor 8 (1 point)
 * @property {YesNo} acuteInfectionOrRheumatological  - factor 9 (1 point)
 */

/**
 * Step 6 — metabolic and treatment factors.
 * @typedef {Object} Metabolic
 * @property {number | null} bodyMassIndex     - kg/m^2; drives factor 10 (>= 30)
 * @property {YesNo} ongoingHormonalTreatment  - factor 11 (1 point)
 */

/**
 * Step 7 — bleeding-risk check (informational; gates the recommendation, not
 * the score).
 * @typedef {Object} Bleeding
 * @property {YesNo} activeBleeding
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
 * @property {History} history
 * @property {Mobility} mobility
 * @property {Cardiorespiratory} cardiorespiratory
 * @property {Metabolic} metabolic
 * @property {Bleeding} bleeding
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredFactor
 * @property {string} id           - stable rule id, e.g. R-ACTIVE-CANCER-01
 * @property {string} factor       - factor key, e.g. activeCancer
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
 * @property {Record<string, number>} factorPoints
 * @property {number} paduaScore
 * @property {RiskBand} riskBand
 * @property {ProphylaxisRecommendation} prophylaxisRecommendation
 * @property {FiredFactor[]} firedFactors
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PaduaVenousThromboembolismRiskAssessment`.

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
      careSetting: '',
      admissionReason: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    history: {
      activeCancer: '',
      previousVte: '',
      knownThrombophilia: ''
    },
    mobility: {
      reducedMobility: '',
      recentTraumaOrSurgery: ''
    },
    cardiorespiratory: {
      heartOrRespiratoryFailure: '',
      acuteMiOrIschaemicStroke: '',
      acuteInfectionOrRheumatological: ''
    },
    metabolic: {
      bodyMassIndex: null,
      ongoingHormonalTreatment: ''
    },
    bleeding: {
      activeBleeding: '',
      highBleedingRisk: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk (Padua < 4)';
    case 'high': return 'High risk (Padua >= 4)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Prophylaxis-recommendation label for display. */
function prophylaxisLabel(recommendation) {
  switch (recommendation) {
    case 'pharmacological': return 'Consider pharmacological thromboprophylaxis';
    case 'mechanical': return 'Mechanical prophylaxis and review';
    case 'none': return 'Routine pharmacological prophylaxis not indicated';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'acute-medical': return 'Acute medical';
    case 'general-medical': return 'General medical';
    case 'admissions-unit': return 'Admissions unit';
    case 'other': return 'Other';
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

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, riskBandLabel, riskBandClass, prophylaxisLabel, clinicianRoleLabel, careSettingLabel, sexLabel, priorityLabel };
