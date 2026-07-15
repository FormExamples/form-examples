// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Partogram (Partograph) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_partogram.sql` (parent labour-record header) and
// `sql/05_create_table_partogram_observation.sql` (the one-to-many child table
// of timed intrapartum observation rows). This file builds and exports the
// canonical empty PartogramRecord shape used by the wizard, so that
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports the empty-observation factory and the
// display helpers.

/**
 * @typedef {'midwife' | 'obstetrician' | 'nurse' | 'other' | ''} ClinicianRole
 * @typedef {'labour-ward' | 'birth-centre' | 'triage' | 'other' | ''} CareSetting
 * @typedef {'under-18' | '18-24' | '25-34' | '35-39' | '40-plus' | ''} AgeBand
 * @typedef {'nulliparous' | 'multiparous' | ''} Parity
 * @typedef {'intact' | 'ruptured' | ''} Membranes
 * @typedef {'<20s' | '20-40s' | '>40s' | ''} ContractionDurationBand
 * @typedef {'mild' | 'moderate' | 'strong' | ''} ContractionStrength
 * @typedef {'intact' | 'clear' | 'meconium' | 'blood-stained' | 'absent' | ''} LiquorState
 * @typedef {'0' | '+' | '++' | '+++' | ''} Moulding
 * @typedef {'negative' | 'trace' | '+' | '++' | '+++' | ''} Dipstick
 * @typedef {'normal' | 'alertLineCrossed' | 'actionLineCrossed'} ProgressClassification
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * One timed intrapartum observation row — mirrors the child table
 * `partogram_observation`. Any field may be left unanswered.
 *
 * @typedef {Object} Observation
 * @property {string} observedAt                  - ISO-ish datetime-local string; '' when unset
 * @property {number | null} cervicalDilatationCm - cervical dilatation, 0-10 cm
 * @property {number | null} descentFifths        - fifths of head palpable above the brim, 5->0
 * @property {number | null} contractionsPer10Min - contraction frequency per 10 minutes
 * @property {ContractionDurationBand} contractionDurationBand
 * @property {ContractionStrength} contractionStrength
 * @property {number | null} fetalHeartRate       - fetal heart rate in bpm
 * @property {LiquorState} liquorState            - amniotic-fluid state
 * @property {Moulding} moulding                  - degree of skull moulding
 * @property {number | null} systolicBloodPressure  - maternal systolic BP, mmHg
 * @property {number | null} diastolicBloodPressure - maternal diastolic BP, mmHg
 * @property {number | null} pulse                - maternal pulse, bpm
 * @property {number | null} temperature          - maternal temperature, degrees C
 * @property {number | null} urineVolumeMl        - urine passed, mL
 * @property {Dipstick} urineProtein
 * @property {Dipstick} urineKetones
 * @property {Dipstick} urineGlucose
 * @property {number | null} oxytocinRate         - oxytocin infusion rate (drops/min or mU/min)
 * @property {string} drugsAndFluids              - other drugs and IV fluids
 */

/**
 * Step 1 — labour context (mirrors the header recording-context fields).
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {CareSetting} careSetting
 * @property {string} activePhaseStartAt   - ISO-ish datetime-local string; '' when unset
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Patient
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Parity} parity
 * @property {number | null} gestationWeeks
 */

/**
 * Step 3 — admission findings.
 * @typedef {Object} Admission
 * @property {Membranes} membranesOnAdmission
 * @property {string} riskFactors
 * @property {string} plannedCare
 */

/**
 * @typedef {Object} PartogramRecord
 * @property {Context} context
 * @property {Patient} patient
 * @property {Admission} admission
 * @property {Observation[]} observations
 */

/**
 * @typedef {Object} FiredLine
 * @property {string} id                 - 'alert' | 'action'
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
 * @property {string | null} activePhaseStartAt
 * @property {number | null} latestDilatationCm
 * @property {number | null} elapsedHours
 * @property {number | null} alertLineExpectedCm
 * @property {number | null} actionLineExpectedCm
 * @property {ProgressClassification} progressClassification
 * @property {FiredLine[]} firedLines
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank observation row.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {Observation}
 */
function emptyObservation() {
  return {
    observedAt: '',
    cervicalDilatationCm: null,
    descentFifths: null,
    contractionsPer10Min: null,
    contractionDurationBand: '',
    contractionStrength: '',
    fetalHeartRate: null,
    liquorState: '',
    moulding: '',
    systolicBloodPressure: null,
    diastolicBloodPressure: null,
    pulse: null,
    temperature: null,
    urineVolumeMl: null,
    urineProtein: '',
    urineKetones: '',
    urineGlucose: '',
    oxytocinRate: null,
    drugsAndFluids: ''
  };
}

/**
 * Build a fresh, fully-blank labour record.
 * Strings default to `''`; numeric and time fields default to `null` / `''`;
 * the observation list defaults to `[]`.
 * @returns {PartogramRecord}
 */
function emptyRecord() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      careSetting: '',
      activePhaseStartAt: ''
    },
    patient: {
      patientIdentifier: '',
      ageBand: '',
      parity: '',
      gestationWeeks: null
    },
    admission: {
      membranesOnAdmission: '',
      riskFactors: '',
      plannedCare: ''
    },
    observations: []
  };
}

/** Enum value lists, in display order (mirror the SQL CHECK constraints). */
const LIQUOR_STATES = ['intact', 'clear', 'meconium', 'blood-stained', 'absent'];
const MOULDING_GRADES = ['0', '+', '++', '+++'];
const DURATION_BANDS = ['<20s', '20-40s', '>40s'];
const CONTRACTION_STRENGTHS = ['mild', 'moderate', 'strong'];
const DIPSTICK_GRADES = ['negative', 'trace', '+', '++', '+++'];

/** Recording-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'midwife': return 'Midwife';
    case 'obstetrician': return 'Obstetrician';
    case 'nurse': return 'Nurse';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'labour-ward': return 'Labour ward';
    case 'birth-centre': return 'Birth centre';
    case 'triage': return 'Triage';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-18': return 'Under 18';
    case '18-24': return '18-24';
    case '25-34': return '25-34';
    case '35-39': return '35-39';
    case '40-plus': return '40+';
    default: return '';
  }
}

/** Parity label. */
function parityLabel(parity) {
  switch (parity) {
    case 'nulliparous': return 'Nulliparous';
    case 'multiparous': return 'Multiparous';
    default: return '';
  }
}

/** Membranes-on-admission label. */
function membranesLabel(m) {
  switch (m) {
    case 'intact': return 'Intact';
    case 'ruptured': return 'Ruptured';
    default: return '';
  }
}

/** Contraction-duration band label. */
function durationBandLabel(band) {
  switch (band) {
    case '<20s': return '< 20 s';
    case '20-40s': return '20-40 s';
    case '>40s': return '> 40 s';
    default: return '';
  }
}

/** Contraction-strength label. */
function contractionStrengthLabel(s) {
  switch (s) {
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'strong': return 'Strong';
    default: return '';
  }
}

/** Liquor-state label. */
function liquorStateLabel(s) {
  switch (s) {
    case 'intact': return 'Membranes intact';
    case 'clear': return 'Clear';
    case 'meconium': return 'Meconium-stained';
    case 'blood-stained': return 'Blood-stained';
    case 'absent': return 'Absent';
    default: return '';
  }
}

/** Moulding label. */
function mouldingLabel(m) {
  switch (m) {
    case '0': return '0 (none)';
    case '+': return '+';
    case '++': return '++';
    case '+++': return '+++';
    default: return '';
  }
}

/** Urine-dipstick label. */
function dipstickLabel(d) {
  switch (d) {
    case 'negative': return 'Negative';
    case 'trace': return 'Trace';
    case '+': return '+';
    case '++': return '++';
    case '+++': return '+++';
    default: return '';
  }
}

/** Progress-classification label. */
function progressLabel(classification) {
  switch (classification) {
    case 'normal': return 'Normal';
    case 'alertLineCrossed': return 'Alert line crossed';
    case 'actionLineCrossed': return 'Action line crossed';
    default: return '';
  }
}

/** CSS class hint for the progress badge (reuses the shared risk palette). */
function progressClass(classification) {
  switch (classification) {
    case 'normal': return 'risk-low';
    case 'alertLineCrossed': return 'risk-moderate';
    case 'actionLineCrossed': return 'risk-high';
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

export { LIQUOR_STATES, MOULDING_GRADES, DURATION_BANDS, CONTRACTION_STRENGTHS, DIPSTICK_GRADES, emptyObservation, emptyRecord, clinicianRoleLabel, careSettingLabel, ageBandLabel, parityLabel, membranesLabel, durationBandLabel, contractionStrengthLabel, liquorStateLabel, mouldingLabel, dipstickLabel, progressLabel, progressClass, priorityLabel };
