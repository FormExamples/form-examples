// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Nursing Care Plan form.
//
// This is a MULTI-TABLE relational form: a parent care-plan record plus an
// array of PROBLEM rows, each of which carries its own arrays of GOAL and
// INTERVENTION rows plus an inline evaluation (the ADPIE nursing process).
// The shape mirrors the SQL schema in `../sql/`:
//   nursing_care_plan (parent)
//     └─ nursing_care_plan_problem (child, FK care_plan_id)
//          ├─ nursing_care_plan_goal (grandchild, FK problem_id)
//          └─ nursing_care_plan_intervention (grandchild, FK problem_id)
//
// This file builds the canonical empty CarePlan shape used by the wizard, so
// that newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports label / class helpers used by
// both the wizard report and the dashboard.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'medium' | 'high' | ''} RiskLevel
 * @typedef {'met' | 'partially-met' | 'not-met' | 'not-evaluated' | ''} MetStatus
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessClass
 * @typedef {'complete' | 'partial' | 'incomplete'} PlanStatus
 */

/**
 * A risk-assessment group referenced by the plan (falls / pressure ulcer /
 * VTE / nutrition). Mirrors the four `*_risk_*` column families on
 * `nursing_care_plan`.
 * @typedef {Object} RiskGroup
 * @property {YesNo} done
 * @property {RiskLevel} level
 * @property {string} assessedOn   ISO date or ''
 * @property {YesNo} actioned
 */

/**
 * A SMART goal (child of a problem). Mirrors `nursing_care_plan_goal`.
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} goalText
 * @property {string} targetDate   ISO date or ''
 * @property {MetStatus} met
 */

/**
 * A planned nursing intervention (child of a problem). Mirrors
 * `nursing_care_plan_intervention`.
 * @typedef {Object} Intervention
 * @property {string} id
 * @property {string} interventionText
 * @property {'yes' | 'no' | 'partial' | ''} carriedOut
 */

/**
 * A nursing problem / need with its goals, interventions, and inline
 * evaluation. Mirrors `nursing_care_plan_problem` plus its child arrays.
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} problemStatement
 * @property {string} adlCategory
 * @property {'actual' | 'potential' | ''} actualOrPotential
 * @property {string} assessmentData
 * @property {'none' | 'falls' | 'pressure-ulcer' | 'vte' | 'nutrition' | ''} linkedRisk
 * @property {Goal[]} goals
 * @property {Intervention[]} interventions
 * @property {string} evaluationNote
 * @property {MetStatus} goalMet
 * @property {string} nextReviewDate   ISO date or ''
 */

/**
 * The parent care-plan record plus its array of problems.
 * @typedef {Object} CarePlan
 * @property {Object} planContext
 * @property {Object} patient
 * @property {RiskGroup} fallsRisk
 * @property {RiskGroup} pressureUlcerRisk
 * @property {RiskGroup} vteRisk
 * @property {RiskGroup} nutritionRisk
 * @property {Problem[]} problems
 * @property {Object} summary
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} problemId
 * @property {string} problemLabel
 * @property {'goal' | 'intervention' | 'evaluation'} element
 * @property {boolean} present
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {PlanStatus} status
 * @property {number} completenessPercent
 * @property {Array<{problemId: string, completenessClass: CompletenessClass}>} problemClasses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NursingCarePlan`.

/** Monotonic-ish unique id for a newly-created problem / goal / intervention row. */
let _seq = 0;
function uid(prefix) {
  _seq += 1;
  return `${prefix || 'row'}-${Date.now().toString(36)}-${_seq}`;
}

/** Build a fresh, fully-blank risk-assessment group. @returns {RiskGroup} */
function emptyRiskGroup() {
  return { done: '', level: '', assessedOn: '', actioned: '' };
}

/** Build a fresh, fully-blank goal. @returns {Goal} */
function emptyGoal() {
  return { id: uid('goal'), goalText: '', targetDate: '', met: '' };
}

/** Build a fresh, fully-blank intervention. @returns {Intervention} */
function emptyIntervention() {
  return { id: uid('intervention'), interventionText: '', carriedOut: '' };
}

/** Build a fresh, fully-blank problem (with empty goal / intervention arrays). @returns {Problem} */
function emptyProblem() {
  return {
    id: uid('problem'),
    problemStatement: '',
    adlCategory: '',
    actualOrPotential: '',
    assessmentData: '',
    linkedRisk: '',
    goals: [],
    interventions: [],
    evaluationNote: '',
    goalMet: '',
    nextReviewDate: ''
  };
}

/**
 * Build a fresh, fully-blank care plan.
 * Strings default to `''`; date fields default to `''`; lists default to `[]`.
 * @returns {CarePlan}
 */
function emptyPlan() {
  return {
    planContext: {
      nurseName: '',
      nurseRole: '',
      nmcNumber: '',
      authoredAt: '',
      careSetting: '',
      planType: '',
      modelUsed: ''
    },
    patient: {
      patientIdentifier: '',
      patientName: '',
      dateOfBirth: '',
      sex: '',
      wardLocation: ''
    },
    fallsRisk: emptyRiskGroup(),
    pressureUlcerRisk: emptyRiskGroup(),
    vteRisk: emptyRiskGroup(),
    nutritionRisk: emptyRiskGroup(),
    problems: [],
    summary: {
      handoverNote: '',
      reviewDate: ''
    }
  };
}

// ---- Enumerations shared with the wizard UI --------------------------------

/** Roper–Logan–Tierney activities of living. */
const ADL_CATEGORIES = [
  { value: 'safe-environment', label: 'Maintaining a safe environment' },
  { value: 'communication', label: 'Communication' },
  { value: 'breathing', label: 'Breathing' },
  { value: 'eating-drinking', label: 'Eating and drinking' },
  { value: 'elimination', label: 'Elimination' },
  { value: 'personal-cleansing-dressing', label: 'Personal cleansing and dressing' },
  { value: 'body-temperature', label: 'Controlling body temperature' },
  { value: 'mobilising', label: 'Mobilising' },
  { value: 'working-playing', label: 'Working and playing' },
  { value: 'expressing-sexuality', label: 'Expressing sexuality' },
  { value: 'sleeping', label: 'Sleeping' },
  { value: 'dying', label: 'Dying' },
  { value: 'other', label: 'Other' }
];

const MET_OPTIONS = [
  { value: 'met', label: 'Met' },
  { value: 'partially-met', label: 'Partially met' },
  { value: 'not-met', label: 'Not met' },
  { value: 'not-evaluated', label: 'Not evaluated' }
];

const LINKED_RISK_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'falls', label: 'Falls' },
  { value: 'pressure-ulcer', label: 'Pressure ulcer' },
  { value: 'vte', label: 'Venous thromboembolism (VTE)' },
  { value: 'nutrition', label: 'Nutrition (MUST)' }
];

/** Label for an ADL category value. */
function adlCategoryLabel(value) {
  const found = ADL_CATEGORIES.find((o) => o.value === value);
  return found ? found.label : '';
}

/** Human label for a plan / problem completeness value. */
function completenessLabel(value) {
  switch (value) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS badge class for a completeness value (reuses the shared risk palette). */
function completenessClass(value) {
  switch (value) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-critical';
    default: return '';
  }
}

/** Label for a risk-assessment level. */
function riskLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low';
    case 'medium': return 'Medium';
    case 'high': return 'High';
    default: return '';
  }
}

export { uid, emptyRiskGroup, emptyGoal, emptyIntervention, emptyProblem, emptyPlan, ADL_CATEGORIES, MET_OPTIONS, LINKED_RISK_OPTIONS, adlCategoryLabel, completenessLabel, completenessClass, riskLevelLabel };
