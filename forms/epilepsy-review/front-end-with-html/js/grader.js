import { detectFlaggedIssues } from './flags.js';
import { COMPONENTS, classifyControl, componentApplicable } from './rules.js';
import { reviewStatusLabel, seizureControlLabel } from './types.js';

// Epilepsy-review seizure-control classification and completeness grader. Pure
// functions: take an `AssessmentData` object and derive the documentation
// outputs (spec §4). This is NOT a numeric severity score. It emits:
//
//   seizureControl      = seizure-free | controlled | uncontrolled (rules.js)
//   reviewStatus        = complete | partial | incomplete
//   completenessScore   = count of documented required (applicable) domains
//   componentStatuses[] = per-component documented flag (review completeness)
//   firedRules[]        = audit trail: control + completeness rows
//   flaggedIssues[]     = the safety flags (from flags.js)
//
// Completeness (spec §4.2):
//   seizure OR medication missing -> 'incomplete'
//   else all applicable domains documented -> 'complete'
//   else 'partial'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeizureControl} SeizureControl
 * @typedef {import('./types.js').ReviewStatus} ReviewStatus
 * @typedef {import('./types.js').ComponentStatus} ComponentStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

/**
 * Evaluate each applicable review component's documentation status.
 * @param {AssessmentData} data
 * @returns {ComponentStatus[]}
 */
function computeComponentStatuses(data) {
  return COMPONENTS
    .filter((c) => componentApplicable(c, data))
    .map((c) => ({
      component: c.component,
      label: c.label,
      documented: !!c.satisfied(data),
      gate: !!c.gate
    }));
}

/**
 * Grade review completeness (spec §4.2). Seizure and medication are the gates:
 * with either missing the review is incomplete; otherwise it is complete when
 * every applicable domain is documented, else partial.
 *
 * @param {ComponentStatus[]} componentStatuses
 * @returns {ReviewStatus}
 */
function gradeReviewStatus(componentStatuses) {
  const gatesMissing = componentStatuses.some((c) => c.gate && !c.documented);
  if (gatesMissing) return 'incomplete';
  const allDocumented = componentStatuses.every((c) => c.documented);
  return allDocumented ? 'complete' : 'partial';
}

/**
 * Full review: seizure-control class + completeness + safety flags. Pure; no
 * I/O. This is the canonical engine entry point (spec §6).
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function gradeEpilepsyReview(data) {
  const componentStatuses = computeComponentStatuses(data);
  const reviewStatus = gradeReviewStatus(componentStatuses);
  const seizureControl = classifyControl(data);
  const completenessScore = componentStatuses.filter((c) => c.documented).length;
  const total = componentStatuses.length;

  const flaggedIssues = detectFlaggedIssues(data, { seizureControl, reviewStatus });

  /** @type {FiredRule[]} */
  const firedRules = [];

  firedRules.push({
    id: 'R-SEIZURE-CONTROL-01',
    section: 'seizure-control',
    category: 'control-classification',
    description: `Seizure control classified ${seizureControlLabel(seizureControl)}`
  });

  if (data.injuries.statusEpilepticus === 'yes') {
    firedRules.push({
      id: 'R-SEIZURE-CONTROL-STATUS-02',
      section: 'seizure-control',
      category: 'control-classification',
      description: 'Status epilepticus since last review — forces uncontrolled'
    });
  } else if (
    data.seizures.seizureFrequency === 'weekly' ||
    data.seizures.seizureFrequency === 'daily'
  ) {
    firedRules.push({
      id: 'R-SEIZURE-CONTROL-FREQUENCY-02',
      section: 'seizure-control',
      category: 'control-classification',
      description: `Seizure frequency ${data.seizures.seizureFrequency} — forces uncontrolled`
    });
  } else if (data.seizures.seizureTrend === 'increasing') {
    firedRules.push({
      id: 'R-SEIZURE-CONTROL-TREND-02',
      section: 'seizure-control',
      category: 'control-classification',
      description: 'Increasing seizure trend — forces uncontrolled'
    });
  }

  firedRules.push({
    id: 'R-COMPLETENESS-01',
    section: 'completeness',
    category: 'required-domain',
    description:
      reviewStatus === 'complete'
        ? `All ${total} required review domains documented — review complete`
        : reviewStatus === 'incomplete'
        ? 'A core domain (seizure or medication) is missing — review incomplete'
        : `${completenessScore} of ${total} required review domains documented — review partial`
  });

  return {
    seizureControl,
    reviewStatus,
    completenessScore,
    componentStatuses,
    firedRules,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
}

export const review = gradeEpilepsyReview;

export { computeComponentStatuses, gradeReviewStatus, gradeEpilepsyReview };
