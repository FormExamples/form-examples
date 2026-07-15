import { detectFlaggedIssues } from './flags.js';
import { COMPONENTS, albuminuriaCategory, bloodPressureAtTarget, gfrCategory, kdigoRiskZone, selectBpTarget } from './rules.js';
import { albuminuriaCategoryLabel, gfrCategoryLabel, kdigoRiskZoneLabel, reviewStatusLabel } from './types.js';

// Chronic kidney disease review KDIGO-classification and completeness grader.
// Pure functions: take an `AssessmentData` object and derive the documentation
// outputs (spec §4). This is NOT a numeric severity score. It emits:
//
//   gfrCategory          = G1 | G2 | G3a | G3b | G4 | G5 | null   (rules.js)
//   albuminuriaCategory  = A1 | A2 | A3 | null                    (rules.js)
//   kdigoRiskZone        = low | moderate | high | very-high | null (heat-map)
//   bloodPressureTarget  = { systolic, diastolic } | null
//   bloodPressureAtTarget= boolean | null
//   reviewStatus         = complete | partial | incomplete
//   completenessScore    = integer count of bundle items present
//   componentStatuses[]  = per-component documented flag (review completeness)
//   firedCriteria[]      = audit trail: staging, heat-map, target, completeness
//   flaggedIssues[]      = the flags (from flags.js)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ComponentStatus} ComponentStatus
 * @typedef {import('./types.js').ReviewStatus} ReviewStatus
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.ChronicKidneyDiseaseReview.

/**
 * Evaluate each review component's documentation status.
 * @param {AssessmentData} data
 * @returns {ComponentStatus[]}
 */
function computeComponentStatuses(data) {
  return COMPONENTS.map((c) => ({
    component: c.component,
    label: c.label,
    documented: !!c.satisfied(data)
  }));
}

/**
 * Grade review completeness (spec §4). eGFR is the gate: with no eGFR the review
 * is incomplete; otherwise it is complete when every bundle item is documented,
 * incomplete when two or more items are missing, else partial.
 *
 * @param {ComponentStatus[]} componentStatuses
 * @returns {ReviewStatus}
 */
function gradeReviewStatus(componentStatuses) {
  const egfr = componentStatuses.find((c) => c.component === 'egfr');
  const hasEgfr = !!(egfr && egfr.documented);
  if (!hasEgfr) return 'incomplete';

  const missing = componentStatuses.filter((c) => !c.documented).length;
  if (missing === 0) return 'complete';
  if (missing >= 2) return 'incomplete';
  return 'partial';
}

/**
 * Full review: KDIGO classification + completeness + flags. Pure; no I/O. This
 * is the canonical engine entry point (spec §6).
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function review(data) {
  const g = gfrCategory(data.renal.egfr);
  const a = albuminuriaCategory(data.albuminuria.acr);
  const zone = kdigoRiskZone(g, a);

  const { target, group } = selectBpTarget(data);
  const atTarget = bloodPressureAtTarget(data, target);

  const componentStatuses = computeComponentStatuses(data);
  const reviewStatus = gradeReviewStatus(componentStatuses);
  const completenessScore = componentStatuses.filter((c) => c.documented).length;
  const total = componentStatuses.length;

  const flaggedIssues = detectFlaggedIssues(data, {
    gfrCategory: g,
    kdigoRiskZone: zone,
    reviewStatus,
    bloodPressureAtTarget: atTarget
  });

  /** @type {FiredCriterion[]} */
  const firedCriteria = [];

  firedCriteria.push({
    id: 'R-GFR-STAGE-01',
    section: 'gfr-stage',
    category: 'staging',
    description: g
      ? `eGFR ${data.renal.egfr} mL/min/1.73 m² → ${gfrCategoryLabel(g)}`
      : 'No eGFR recorded — G-stage not determined'
  });

  firedCriteria.push({
    id: 'R-ALBUMINURIA-STAGE-01',
    section: 'albuminuria-stage',
    category: 'staging',
    description: a
      ? `Urine ACR ${data.albuminuria.acr} mg/mmol → ${albuminuriaCategoryLabel(a)}`
      : 'No urine ACR recorded — albuminuria stage not determined'
  });

  firedCriteria.push({
    id: 'R-RISK-ZONE-01',
    section: 'risk-zone',
    category: 'heat-map',
    description: zone
      ? `${g} × ${a} → KDIGO ${kdigoRiskZoneLabel(zone)}`
      : 'KDIGO risk zone not determined (eGFR and/or ACR missing)'
  });

  firedCriteria.push({
    id: 'R-BP-TARGET-01',
    section: 'bp-target',
    category: 'target-selection',
    description:
      `Blood-pressure target ${target.systolic}/${target.diastolic} mmHg (${group})` +
      (atTarget === null
        ? ' — blood pressure not recorded'
        : atTarget
        ? ' — recorded blood pressure at target'
        : ' — recorded blood pressure above target')
  });

  firedCriteria.push({
    id: 'R-COMPLETENESS-01',
    section: 'completeness',
    category: 'required-component',
    description:
      reviewStatus === 'complete'
        ? `All ${total} review bundle items documented — review complete`
        : reviewStatus === 'incomplete'
        ? `${completenessScore} of ${total} bundle items documented — review incomplete`
        : `${completenessScore} of ${total} bundle items documented — review partial`
  });

  return {
    gfrCategory: g,
    albuminuriaCategory: a,
    kdigoRiskZone: zone,
    bloodPressureTarget: target,
    bloodPressureAtTarget: atTarget,
    reviewStatus,
    completenessScore,
    componentStatuses,
    firedCriteria,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
}

export { computeComponentStatuses, gradeReviewStatus, review };
