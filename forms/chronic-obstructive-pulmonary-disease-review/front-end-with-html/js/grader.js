import { abeGroupOf, copdRules, coreComponents, exacerbationRiskOf, goldGradeOf, supportingComponents, symptomBurdenOf } from './rules.js';

// COPD-review grader. Pure functions: take a `ReviewData` object and derive the
// four independent outputs plus the audit trail of fired rules.
//
// Grading algorithm (spec §4):
//   goldGrade        = FEV₁ % predicted banded ≥80→1, ≥50→2, ≥30→3, <30→4; null when unrecorded
//   symptomBurden    = (mMRC ≥ 2) or (CAT ≥ 10)                     ? 'high' : 'low'
//   exacerbationRisk = (≥ 2 moderate) or (≥ 1 hospitalised)          ? 'high' : 'low'
//   abeGroup         = no axis data ? null : exac high ? 'E' : symptom high ? 'B' : 'A'
//   reviewStatus     = any core missing ? 'incomplete'
//                      : any supporting missing ? 'partial' : 'complete'
//
// A missing numeric input contributes nothing to its axis (treated as absent,
// not as a normal value) and lowers the completeness grade. `flags.js` raises
// clinician-facing flags separately.

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 * @typedef {import('./types.js').GoldGrade} GoldGrade
 * @typedef {import('./types.js').Axis} Axis
 * @typedef {import('./types.js').AbeGroup} AbeGroup
 * @typedef {import('./types.js').ReviewStatus} ReviewStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Evaluate the declarative classification rules and collect the ones that fired
 * (one per gold / symptom / exacerbation / abe axis).
 * @param {ReviewData} data
 * @returns {FiredRule[]}
 */
function evaluateRules(data) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of copdRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          section: rule.section,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`COPD rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Grade review completeness and append a completeness audit row per missing
 * component.
 * @param {ReviewData} data
 * @param {FiredRule[]} fired  - mutated: completeness rows are pushed here
 * @returns {ReviewStatus}
 */
function computeReviewStatus(data, fired) {
  const missingCore = coreComponents.filter((c) => !c.present(data));
  const missingSupporting = supportingComponents.filter((c) => !c.present(data));

  for (const c of missingCore) {
    fired.push({
      id: `R-COMPLETENESS-CORE-${c.id.toUpperCase()}`,
      section: 'completeness',
      category: 'required-component',
      description: `Core review element missing: ${c.label}`
    });
  }
  for (const c of missingSupporting) {
    fired.push({
      id: `R-COMPLETENESS-SUPPORTING-${c.id.toUpperCase()}`,
      section: 'completeness',
      category: 'supporting-component',
      description: `Supporting review item missing: ${c.label}`
    });
  }

  /** @type {ReviewStatus} */
  let status;
  if (missingCore.length > 0) {
    status = 'incomplete';
  } else if (missingSupporting.length > 0) {
    status = 'partial';
  } else {
    status = 'complete';
  }

  fired.push({
    id: `R-COMPLETENESS-${status.toUpperCase()}-01`,
    section: 'completeness',
    category: 'review-status',
    description:
      status === 'complete'
        ? 'All core and supporting review elements recorded — review is complete'
        : status === 'partial'
          ? 'All core elements recorded but one or more supporting items missing — review is partial'
          : 'One or more core review elements missing — review is incomplete'
  });

  return status;
}

/**
 * Compute the full COPD-review grade for the supplied review data.
 * @param {ReviewData} data
 * @returns {{ goldGrade: GoldGrade, symptomBurden: Axis, exacerbationRisk: Axis,
 *             abeGroup: AbeGroup, reviewStatus: ReviewStatus,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const firedRules = evaluateRules(data);
  const goldGrade = goldGradeOf(data);
  const symptomBurden = symptomBurdenOf(data);
  const exacerbationRisk = exacerbationRiskOf(data);
  const abeGroup = abeGroupOf(data);
  const reviewStatus = computeReviewStatus(data, firedRules);

  return {
    goldGrade,
    symptomBurden,
    exacerbationRisk,
    abeGroup,
    reviewStatus,
    firedRules
  };
}

export { evaluateRules, calculateGrade };
