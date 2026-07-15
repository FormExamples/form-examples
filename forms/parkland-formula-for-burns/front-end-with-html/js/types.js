// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Parkland Formula for Burns
// fluid-resuscitation calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_parkland_formula_for_burns.sql`
// (`weight_kg` -> `weightKg`, `tbsa_percent` -> `tbsaPercent`,
// `injury_at` -> `injuryAt`, `inhalation_suspected` -> `inhalationSuspected`).
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel,
// tbsaMethodLabel, mechanismLabel, yesNoLabel, injuryTimeKnownLabel,
// priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'burns-unit' | 'intensive-care' | 'retrieval' | 'other' | ''} CareSetting
 * @typedef {'adult' | 'child' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'rule-of-nines' | 'lund-browder' | 'other' | ''} TbsaMethod
 * @typedef {'known' | 'estimated' | ''} InjuryTimeKnown
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'thermal' | 'electrical' | 'chemical' | 'other' | ''} Mechanism
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
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — body weight (calculation input 1).
 * @typedef {Object} Weight
 * @property {number | null} weightKg   - body weight in kilograms
 */

/**
 * Step 4 — burn extent (calculation input 2).
 * @typedef {Object} Burn
 * @property {number | null} tbsaPercent - %TBSA, partial-thickness or deeper
 * @property {TbsaMethod} tbsaMethod     - estimation method
 */

/**
 * Step 5 — time of injury (calculation input 3 — drives the phase offset).
 * @typedef {Object} Injury
 * @property {string} injuryAt              - ISO-ish datetime-local string; '' when unset
 * @property {InjuryTimeKnown} injuryTimeKnown
 */

/**
 * Step 6 — injury features (drive flags, not the arithmetic).
 * @typedef {Object} Features
 * @property {YesNo} inhalationSuspected
 * @property {YesNo} circumferentialOrDeep
 * @property {Mechanism} mechanism
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Weight} weight
 * @property {Burn} burn
 * @property {Injury} injury
 * @property {Features} features
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-TOTAL-VOLUME-01
 * @property {string} instrument   - formula | phase-split | offset | titration
 * @property {string} band         - resuscitation | overdue | unknown
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
 * @property {number | null} total24hVolumeMl
 * @property {number | null} first8hVolumeMl
 * @property {number | null} next16hVolumeMl
 * @property {number | null} hoursSinceInjury
 * @property {number} remainingFirst8hHours
 * @property {number | null} first8hRateMlPerHour
 * @property {number | null} next16hRateMlPerHour
 * @property {number | null} targetUrineOutputLowMlPerHour
 * @property {number | null} targetUrineOutputHighMlPerHour
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

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
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    weight: {
      weightKg: null
    },
    burn: {
      tbsaPercent: null,
      tbsaMethod: ''
    },
    injury: {
      injuryAt: '',
      injuryTimeKnown: ''
    },
    features: {
      inhalationSuspected: '',
      circumferentialOrDeep: '',
      mechanism: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'burns-unit': return 'Burns unit';
    case 'intensive-care': return 'Intensive care';
    case 'retrieval': return 'Retrieval / transfer';
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

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'adult': return 'Adult';
    case 'child': return 'Child';
    default: return '';
  }
}

/** %TBSA estimation-method label. */
function tbsaMethodLabel(method) {
  switch (method) {
    case 'rule-of-nines': return 'Wallace Rule of Nines';
    case 'lund-browder': return 'Lund–Browder chart';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Burn-mechanism label. */
function mechanismLabel(mechanism) {
  switch (mechanism) {
    case 'thermal': return 'Thermal';
    case 'electrical': return 'Electrical';
    case 'chemical': return 'Chemical';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Yes/no label. */
function yesNoLabel(v) {
  switch (v) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Injury-time-known label. */
function injuryTimeKnownLabel(v) {
  switch (v) {
    case 'known': return 'Known';
    case 'estimated': return 'Estimated';
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

export { emptyAssessment, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, tbsaMethodLabel, mechanismLabel, yesNoLabel, injuryTimeKnownLabel, priorityLabel };
