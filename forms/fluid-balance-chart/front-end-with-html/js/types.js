// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Fluid Balance Chart form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_fluid_balance_chart.sql` (parent chart header) and
// `sql/05_create_table_fluid_balance_chart_entry.sql` (the one-to-many child
// timed intake/output entry rows). This file builds and exports the canonical
// empty ChartData shape used by the wizard, so that newly-added fields default
// correctly when older saved state is rehydrated from localStorage. It also
// exports the empty-entry factory and display helpers.

/**
 * @typedef {'nurse' | 'doctor' | 'healthcare-assistant' | 'other' | ''} ClinicianRole
 * @typedef {'intake' | 'output' | ''} Direction
 * @typedef {'oral' | 'iv' | 'enteral' | 'blood-products' | 'other-intake' | 'urine' | 'drains' | 'vomit-ng' | 'stool' | 'insensible-other' | ''} Category
 * @typedef {'balanced' | 'positive' | 'negative' | 'oliguria'} FluidStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * One timed intake / output line item — mirrors the child table
 * `fluid_balance_chart_entry`.
 *
 * @typedef {Object} Entry
 * @property {string} entryAt              - ISO-ish datetime-local string; '' when unset
 * @property {Direction} direction         - intake or output
 * @property {Category} category           - fluid category (depends on direction)
 * @property {string} description          - optional route / free-text description
 * @property {number | null} volumeMl      - recorded volume in millilitres
 */

/**
 * Step 1 — chart context (mirrors the chart header context fields).
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} patientIdentifier
 * @property {string} wardOrUnit
 * @property {string} chartStartAt         - ISO-ish datetime-local string; '' when unset
 * @property {number | null} chartPeriodHours - charting period in hours (default 24)
 */

/**
 * Step 2 — patient weight.
 * @typedef {Object} Patient
 * @property {number | null} weightKg      - patient weight in kilograms
 */

/**
 * Step 5 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} ChartData
 * @property {Context} context
 * @property {Patient} patient
 * @property {Entry[]} entries
 * @property {Note} note
 */

/**
 * @typedef {Object} RunningBalancePoint
 * @property {string} entryAt
 * @property {number} balanceMl
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
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
 * @property {number} totalIntakeMl
 * @property {number} totalOutputMl
 * @property {number} netBalanceMl
 * @property {Record<string, number>} intakeByCategory
 * @property {Record<string, number>} outputByCategory
 * @property {RunningBalancePoint[]} runningBalance
 * @property {number} urineOutputMl
 * @property {number} hoursObserved
 * @property {number | null} weightKg
 * @property {number | null} urineOutputRateMlPerKgPerHour
 * @property {number} positiveThresholdMl
 * @property {number} negativeThresholdMl
 * @property {FluidStatus} fluidStatus
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.FluidBalanceChart`.

/** Default charting period in hours (spec §4). */
const DEFAULT_CHART_PERIOD_HOURS = 24;

/**
 * Build a fresh, fully-blank entry row for the given direction.
 * Strings default to `''`; numeric fields default to `null`.
 * @param {Direction} [direction]
 * @returns {Entry}
 */
function emptyEntry(direction) {
  return {
    entryAt: '',
    direction: direction || '',
    category: '',
    description: '',
    volumeMl: null
  };
}

/**
 * Build a fresh, fully-blank chart.
 * Strings default to `''`; numeric fields default to `null` (except the
 * charting period, which pre-fills the conventional 24-hour default); the
 * entry list defaults to `[]`.
 * @returns {ChartData}
 */
function emptyChart() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      patientIdentifier: '',
      wardOrUnit: '',
      chartStartAt: '',
      chartPeriodHours: DEFAULT_CHART_PERIOD_HOURS
    },
    patient: {
      weightKg: null
    },
    entries: [],
    note: {
      clinicalNote: ''
    }
  };
}

/** Intake category values, in display order. */
const INTAKE_CATEGORIES = ['oral', 'iv', 'enteral', 'blood-products', 'other-intake'];
/** Output category values, in display order. */
const OUTPUT_CATEGORIES = ['urine', 'drains', 'vomit-ng', 'stool', 'insensible-other'];

/** Charting-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'nurse': return 'Nurse';
    case 'doctor': return 'Doctor';
    case 'healthcare-assistant': return 'Healthcare assistant';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Direction label. */
function directionLabel(direction) {
  switch (direction) {
    case 'intake': return 'Intake';
    case 'output': return 'Output';
    default: return '';
  }
}

/** Fluid category label. */
function categoryLabel(category) {
  switch (category) {
    case 'oral': return 'Oral';
    case 'iv': return 'Intravenous (IV)';
    case 'enteral': return 'Enteral';
    case 'blood-products': return 'Blood / products';
    case 'other-intake': return 'Other intake';
    case 'urine': return 'Urine';
    case 'drains': return 'Drains';
    case 'vomit-ng': return 'Vomit / NG';
    case 'stool': return 'Stool';
    case 'insensible-other': return 'Insensible / other';
    default: return '';
  }
}

/** Fluid-status label. */
function fluidStatusLabel(status) {
  switch (status) {
    case 'balanced': return 'Balanced';
    case 'positive': return 'Positive';
    case 'negative': return 'Negative';
    case 'oliguria': return 'Oliguria';
    default: return '';
  }
}

/** CSS class hint for the fluid-status badge (reuses the shared risk palette). */
function fluidStatusClass(status) {
  switch (status) {
    case 'balanced': return 'risk-low';
    case 'positive': return 'risk-moderate';
    case 'negative': return 'risk-moderate';
    case 'oliguria': return 'risk-high';
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

export { DEFAULT_CHART_PERIOD_HOURS, INTAKE_CATEGORIES, OUTPUT_CATEGORIES, emptyEntry, emptyChart, clinicianRoleLabel, directionLabel, categoryLabel, fluidStatusLabel, fluidStatusClass, priorityLabel };
