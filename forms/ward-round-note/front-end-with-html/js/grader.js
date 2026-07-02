// Ward-round-note documentation-completeness grader. Pure functions: take an
// `AssessmentData` object and derive the documentation outputs (spec §4).
// This is NOT a numeric clinical score. It emits:
//
//   status                = complete | partial | incomplete
//   completenessPercent   = round(100 * documentedRequired / 8) (0..100)
//   componentStatuses[]   = per-component presence (all ten components)
//   documentedComponents  = names of every documented component (required +
//                           recommended)
//   firedRules[]          = audit trail: each documented component, plus a
//                           completeness row (mirrors ward_round_note_grade_rule)
//   flags[]               = the safety flags (from flags.js)
//
// Classification (spec §4):
//   documentedRequired == 8                              -> 'complete'
//   header && plan && documentedRequired >= 4            -> 'partial'
//   otherwise                                            -> 'incomplete'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ComponentStatus} ComponentStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.WardRoundNote.
(function () {
'use strict';
window.WardRoundNote = window.WardRoundNote || {};
const NS = window.WardRoundNote;
const {
  componentPresence,
  requiredComponents,
  recommendedComponents,
  detectFlaggedIssues,
  COMPONENTS
} = NS;

/**
 * Build the per-component presence rows for the report (all ten components).
 * @param {ReturnType<typeof componentPresence>} presence
 * @returns {ComponentStatus[]}
 */
function componentStatuses(presence) {
  const map = {
    'header': presence.header,
    'problems': presence.problems,
    'examination': presence.examination,
    'investigations': presence.investigations,
    'vte': presence.vte,
    'medication': presence.medication,
    'plan': presence.plan,
    'escalation': presence.escalation,
    'overnight-events': presence.overnightEvents,
    'estimated-discharge': presence.estimatedDischarge
  };
  return COMPONENTS.map((c) => ({
    component: c.component,
    label: c.label,
    required: c.required,
    present: !!map[c.component]
  }));
}

/**
 * Compute the completeness grade (no flags yet).
 *
 * @param {AssessmentData} data
 * @returns {{ presence: object, completenessPercent: number,
 *             required: object[], recommended: object[],
 *             documentedRequired: number, totalRequired: number,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const presence = componentPresence(data);
  const required = requiredComponents(data);
  const recommended = recommendedComponents(data);
  const totalRequired = required.length; // 8
  const documentedRequired = required.filter((c) => c.present).length;
  const completenessPercent =
    totalRequired > 0 ? Math.round((100 * documentedRequired) / totalRequired) : 0;

  // Audit trail: one row per DOCUMENTED component (required + recommended),
  // mirroring ward_round_note_grade_rule.
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const c of required.concat(recommended)) {
    if (c.present) {
      firedRules.push({
        id: c.id,
        component: c.component,
        category: c.category,
        description: c.description
      });
    }
  }

  return {
    presence,
    completenessPercent,
    required,
    recommended,
    documentedRequired,
    totalRequired,
    firedRules
  };
}

/**
 * Full grade: completeness + safety flags + derived status. Pure; no I/O.
 * This is the canonical engine entry point (spec §6).
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function assess(data) {
  const grade = calculateGrade(data);
  const { presence, completenessPercent, documentedRequired, totalRequired } = grade;

  /** @type {CompletenessStatus} */
  let status;
  if (documentedRequired === totalRequired) {
    status = 'complete';
  } else if (presence.header && presence.plan && documentedRequired >= 4) {
    status = 'partial';
  } else {
    status = 'incomplete';
  }

  const flags = detectFlaggedIssues(data, { documentedRequired, totalRequired });

  const statuses = componentStatuses(presence);
  const documentedComponents = statuses.filter((s) => s.present).map((s) => s.component);

  const firedRules = grade.firedRules.slice();
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    component: 'completeness',
    category: 'completeness',
    description:
      status === 'complete'
        ? `All ${totalRequired} required components documented — entry complete (100%)`
        : `${documentedRequired} of ${totalRequired} required components documented — entry ${status} (${completenessPercent}%)`
  });

  return {
    status,
    completenessPercent,
    componentStatuses: statuses,
    documentedComponents,
    documentedRequired,
    totalRequired,
    firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

Object.assign(NS, {
  componentStatuses,
  calculateGrade,
  assess
});
})();
