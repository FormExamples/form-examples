import { detectFlaggedIssues } from './flags.js';
import { requiredComponents, sectionPresence } from './rules.js';
import { SOAP_SECTIONS } from './types.js';

// SOAP-note documentation-completeness grader. Pure functions: take an
// `AssessmentData` object and derive the documentation outputs (spec §4).
// This is NOT a numeric clinical score. It emits:
//
//   status              = complete | partial | incomplete
//   completenessPercent = round(100 * presentRequired / totalRequired) (0..100)
//   sectionStatuses[]   = per-SOAP-section presence (Subjective/Objective/
//                         Assessment/Plan)
//   presence            = the four section-presence booleans
//   firedRules[]        = audit trail: each present required component, plus a
//                         completeness row (mirrors soap_note_grade_rule)
//   flags[]             = the safety flags (from flags.js)
//
// Classification (spec §4):
//   (!assessmentPresent || !planPresent)            -> 'incomplete'
//   (completenessPercent == 100 && no high flag)    -> 'complete'
//   (assessmentPresent && planPresent)              -> 'partial'
//   otherwise                                       -> 'incomplete'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SectionStatus} SectionStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

/**
 * Build the per-SOAP-section presence rows for the report.
 * @param {{subjectivePresent: boolean, objectivePresent: boolean,
 *          assessmentPresent: boolean, planPresent: boolean}} presence
 * @returns {SectionStatus[]}
 */
function sectionStatuses(presence) {
  const map = {
    subjective: presence.subjectivePresent,
    objective: presence.objectivePresent,
    assessment: presence.assessmentPresent,
    plan: presence.planPresent
  };
  return SOAP_SECTIONS.map((s) => ({
    section: s.section,
    label: s.label,
    present: !!map[s.section]
  }));
}

/**
 * Compute the completeness grade (no status yet — status needs the flags to
 * know whether a high-priority flag has fired).
 *
 * @param {AssessmentData} data
 * @returns {{ presence: object, completenessPercent: number,
 *             components: object[], presentCount: number, totalCount: number,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const presence = sectionPresence(data);
  const components = requiredComponents(data);
  const totalCount = components.length;
  const presentCount = components.filter((c) => c.present).length;
  const completenessPercent =
    totalCount > 0 ? Math.round((100 * presentCount) / totalCount) : 0;

  // Audit trail: one row per PRESENT required component, mirroring grade_rule.
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const c of components) {
    if (c.present) {
      firedRules.push({
        id: c.id,
        section: c.section,
        category: c.category,
        description: c.description
      });
    }
  }

  return { presence, completenessPercent, components, presentCount, totalCount, firedRules };
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
  const { presence, completenessPercent, presentCount, totalCount } = grade;

  const flags = detectFlaggedIssues(data, { presence, completenessPercent });
  const hasHighFlag = flags.some((f) => f.priority === 'high');

  /** @type {CompletenessStatus} */
  let status;
  if (!presence.assessmentPresent || !presence.planPresent) {
    status = 'incomplete';
  } else if (completenessPercent === 100 && !hasHighFlag) {
    status = 'complete';
  } else if (presence.assessmentPresent && presence.planPresent) {
    status = 'partial';
  } else {
    status = 'incomplete';
  }

  const firedRules = grade.firedRules.slice();
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    section: 'completeness',
    category: 'completeness',
    description:
      status === 'complete'
        ? `All ${totalCount} required components present — note complete (100%)`
        : `${presentCount} of ${totalCount} required components present — note ${status} (${completenessPercent}%)`
  });

  return {
    status,
    completenessPercent,
    sectionStatuses: sectionStatuses(presence),
    presence,
    firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

export { sectionStatuses, calculateGrade, assess };
