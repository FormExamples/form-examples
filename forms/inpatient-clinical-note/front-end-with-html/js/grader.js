// Inpatient-clinical-note grader: the canonical engine entry point.
//
// Runs both engines over an `AssessmentData` object and returns a
// `GradingResult`. Pure functions; no I/O.
//
//   status              = complete | partial | incomplete   (never overridable)
//   completenessPercent = round(100 * documentedRequired / totalRequired)
//   acuityBand          = stable | watch | escalate | critical (overridable)
//   computedAcuityBand  = what the acuity engine computed, retained for audit
//   componentStatuses[] = per-component presence, all twelve components
//   firedRules[]        = audit trail from both engines, mirroring
//                         inpatient_clinical_note_grade_rule
//   flags[]             = the safety flags (from flags.js)
//
// Completeness classification (spec §4.3), where R is the required set for this
// note's type and D the documented members of R:
//
//   |D| == |R|                                              -> 'complete'
//   header && impression && plan && |D| >= ceil(|R|/2)      -> 'partial'
//   otherwise                                               -> 'incomplete'
//
// The completeness status is deliberately NOT overridable: it is a mechanical
// property of the record, not a clinical judgement. Only the acuity band can be
// overridden, and only with a recorded reason.

import { evaluateAcuity } from './acuity.js';
import { detectFlaggedIssues } from './flags.js';
import { componentPresence, componentRules } from './rules.js';
import { ACUITY_ORDER, CRITICAL_COMPONENTS } from './types.js';

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ComponentStatus} ComponentStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

/**
 * Build the per-component presence rows for the report (all twelve components),
 * with `required` resolved for this note's type.
 * @param {AssessmentData} data
 * @returns {ComponentStatus[]}
 */
function componentStatuses(data) {
  return componentRules(data).map((c) => ({
    component: c.component,
    label: c.label,
    required: c.required,
    present: c.present
  }));
}

/**
 * Compute the completeness half of the grade.
 *
 * @param {AssessmentData} data
 * @returns {{presence: object, rules: object[], completenessPercent: number,
 *            documentedRequired: number, totalRequired: number,
 *            firedRules: FiredRule[]}}
 */
function calculateCompleteness(data) {
  const presence = componentPresence(data);
  const rules = componentRules(data);
  const required = rules.filter((c) => c.required);
  const totalRequired = required.length;
  const documentedRequired = required.filter((c) => c.present).length;
  const completenessPercent =
    totalRequired > 0 ? Math.round((100 * documentedRequired) / totalRequired) : 0;

  // Audit trail: one row per DOCUMENTED component, required or recommended,
  // mirroring inpatient_clinical_note_grade_rule.
  /** @type {FiredRule[]} */
  const firedRules = rules
    .filter((c) => c.present)
    .map((c) => ({
      id: c.id,
      engine: 'completeness',
      component: c.component,
      band: '',
      category: c.category,
      description: c.description
    }));

  return {
    presence,
    rules,
    completenessPercent,
    documentedRequired,
    totalRequired,
    firedRules
  };
}

/**
 * Full grade: completeness + acuity + safety flags.
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function assess(data) {
  const completeness = calculateCompleteness(data);
  const { presence, completenessPercent, documentedRequired, totalRequired } = completeness;

  /** @type {CompletenessStatus} */
  let status;
  const criticalPresent = CRITICAL_COMPONENTS.every((k) => presence[k]);
  if (totalRequired > 0 && documentedRequired === totalRequired) {
    status = 'complete';
  } else if (criticalPresent && documentedRequired >= Math.ceil(totalRequired / 2)) {
    status = 'partial';
  } else {
    status = 'incomplete';
  }

  const acuity = evaluateAcuity(data);
  const computedAcuityBand = acuity.band;

  // The author may override the band, but only with a recorded reason: an
  // override without one is ignored rather than silently applied.
  const override = data.signOff.authorOverrideAcuity;
  const overrideReason = String(data.signOff.authorOverrideReason || '').trim();
  const acuityOverridden =
    !!override && ACUITY_ORDER.includes(override) && overrideReason !== '';
  const acuityBand = acuityOverridden ? override : computedAcuityBand;

  const flags = detectFlaggedIssues(data, {
    acuityBand,
    documentedRequired,
    totalRequired
  });

  const statuses = componentStatuses(data);
  const documentedComponents = statuses.filter((s) => s.present).map((s) => s.component);

  const firedRules = completeness.firedRules.concat(acuity.firedRules);
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    engine: 'completeness',
    component: 'completeness',
    band: '',
    category: 'completeness',
    description:
      status === 'complete'
        ? `All ${totalRequired} required components documented — entry complete (100%)`
        : `${documentedRequired} of ${totalRequired} required components documented — entry ${status} (${completenessPercent}%)`
  });

  if (acuityOverridden) {
    firedRules.push({
      id: 'A-AUTHOR-OVERRIDE',
      engine: 'acuity',
      component: 'acuity',
      band: acuityBand,
      category: 'override',
      description:
        `Author overrode the computed acuity band (${computedAcuityBand}) to ${acuityBand}: ${overrideReason}`
    });
  }

  return {
    status,
    completenessPercent,
    acuityBand,
    computedAcuityBand,
    acuityOverridden,
    news2Total: acuity.news2.effective,
    news2DerivedTotal: acuity.news2.derived,
    componentStatuses: statuses,
    documentedComponents,
    documentedRequired,
    totalRequired,
    firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

export { componentStatuses, calculateCompleteness, assess };
