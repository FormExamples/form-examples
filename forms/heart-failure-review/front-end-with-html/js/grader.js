import { detectFlaggedIssues } from './flags.js';
import { indicatedPillarKeys, reviewDomainRules } from './rules.js';
import { PILLARS } from './types.js';

// Heart Failure Annual Review grader. Pure functions: take a `ReviewData`
// object and derive the four documentation outputs (spec §4). This is NOT a
// numeric severity score. It emits:
//
//   functionalStatus        = stable | symptomatic | advanced | unknown
//   medicationOptimisation  = { indicatedPillars, prescribedPillars,
//                               missingPillars[], status, pillars[] }
//   reviewStatus            = complete | partial | incomplete
//   completenessScore       = round(100 * documentedDomains / 6)   (0..100)
//   flaggedIssues[]         = safety flags (from flags.js)
//   firedRules[]            = audit trail: each documented domain + summary rows
//
// Algorithm (spec §4):
//   functionalStatus = nyhaClass == null ? 'unknown'
//                    : nyhaClass <= 2     ? 'stable'
//                    : nyhaClass == 3     ? 'symptomatic'
//                    :                      'advanced'   // NYHA IV
//
//   indicatedPillars  = 4 for HFrEF, 1 (SGLT2i) for HFmrEF/HFpEF, 0 otherwise
//   prescribedPillars = indicated pillars with status 'prescribed'
//   counted           = indicated pillars with status in
//                       {prescribed, contraindicated, not-tolerated}
//   optimisation      = indicatedPillars == 0 ? 'not-applicable'
//                     : counted == indicatedPillars ? 'optimised'
//                     : prescribedPillars == 0 ? 'suboptimal' : 'partial'
//
//   reviewStatus = documented == 6 ? 'complete'
//                : documented >= 4 ? 'partial' : 'incomplete'

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 * @typedef {import('./types.js').FunctionalStatus} FunctionalStatus
 * @typedef {import('./types.js').MedicationOptimisation} MedicationOptimisation
 * @typedef {import('./types.js').ReviewStatus} ReviewStatus
 * @typedef {import('./types.js').DomainStatus} DomainStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.HeartFailureReview.

/**
 * Derive the NYHA functional status from the recorded NYHA class.
 * @param {ReviewData} data
 * @returns {FunctionalStatus}
 */
function deriveFunctionalStatus(data) {
  const nyha = data.functional.nyhaClass;
  if (nyha === null || nyha === undefined || nyha === '') return 'unknown';
  if (nyha <= 2) return 'stable';
  if (nyha === 3) return 'symptomatic';
  return 'advanced';
}

/**
 * Derive the four-pillar medication-optimisation status.
 * @param {ReviewData} data
 * @returns {MedicationOptimisation}
 */
function deriveMedicationOptimisation(data) {
  const indicatedKeys = indicatedPillarKeys(data.diagnosis.heartFailureType);
  const indicatedSet = new Set(indicatedKeys);

  const pillars = PILLARS.map((p) => ({
    key: p.key,
    label: p.short,
    status: data.medication[`${p.key}Status`] || '',
    indicated: indicatedSet.has(p.key)
  }));

  const indicatedPillars = indicatedKeys.length;
  let prescribedPillars = 0;
  let counted = 0;
  const missingPillars = [];

  for (const key of indicatedKeys) {
    const status = data.medication[`${key}Status`] || '';
    if (status === 'prescribed') {
      prescribedPillars++;
      counted++;
    } else if (status === 'contraindicated' || status === 'not-tolerated') {
      counted++;
    } else if (status === 'not-prescribed') {
      missingPillars.push(key);
    }
    // '' (unrecorded) counts as neither addressed nor missing.
  }

  /** @type {import('./types.js').OptimisationStatus} */
  let status;
  if (indicatedPillars === 0) {
    status = 'not-applicable';
  } else if (counted === indicatedPillars) {
    status = 'optimised';
  } else if (prescribedPillars === 0) {
    status = 'suboptimal';
  } else {
    status = 'partial';
  }

  return { indicatedPillars, prescribedPillars, missingPillars, status, pillars };
}

/**
 * Evaluate each review-domain rule and derive the completeness grade.
 * @param {ReviewData} data
 * @returns {{ reviewStatus: ReviewStatus, completenessScore: number,
 *             domainStatuses: DomainStatus[], documentedCount: number }}
 */
function deriveReviewCompleteness(data) {
  const domainStatuses = reviewDomainRules.map((rule) => ({
    domain: rule.domain,
    label: rule.label,
    documented: !!rule.satisfied(data)
  }));

  const total = domainStatuses.length; // 6
  const documentedCount = domainStatuses.filter((d) => d.documented).length;
  const completenessScore =
    total > 0 ? Math.round((100 * documentedCount) / total) : 0;

  /** @type {ReviewStatus} */
  const reviewStatus =
    documentedCount === total ? 'complete'
    : documentedCount >= 4 ? 'partial'
    : 'incomplete';

  return { reviewStatus, completenessScore, domainStatuses, documentedCount };
}

/**
 * Full review grade: functional status, medication optimisation, review
 * completeness, safety flags, and the audit trail. Pure; no I/O. This is the
 * canonical engine entry point (spec §6).
 *
 * @param {ReviewData} data
 * @returns {GradingResult}
 */
function gradeReview(data) {
  const functionalStatus = deriveFunctionalStatus(data);
  const medicationOptimisation = deriveMedicationOptimisation(data);
  const completeness = deriveReviewCompleteness(data);

  const flaggedIssues = detectFlaggedIssues(data, {
    functionalStatus,
    medicationOptimisation,
    reviewStatus: completeness.reviewStatus
  });

  // Audit trail: one row per documented domain, plus summary rows mirroring the
  // grade_rule table.
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (let i = 0; i < reviewDomainRules.length; i++) {
    const rule = reviewDomainRules[i];
    if (completeness.domainStatuses[i].documented) {
      firedRules.push({
        id: rule.id,
        domain: rule.domain,
        category: rule.category,
        description: rule.description
      });
    }
  }
  firedRules.push({
    id: 'R-FUNCTIONAL-STATUS-01',
    domain: 'functional-status',
    category: 'classification',
    description: `NYHA functional status derived: ${functionalStatus}`
  });
  firedRules.push({
    id: 'R-OPTIMISATION-01',
    domain: 'medication-optimisation',
    category: 'classification',
    description:
      `Medication-optimisation status: ${medicationOptimisation.status} ` +
      `(${medicationOptimisation.prescribedPillars} of ` +
      `${medicationOptimisation.indicatedPillars} indicated pillars prescribed)`
  });
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    domain: 'completeness',
    category: 'completeness',
    description:
      `Review ${completeness.reviewStatus}: ` +
      `${completeness.documentedCount} of ${reviewDomainRules.length} domains ` +
      `documented (${completeness.completenessScore}%)`
  });

  return {
    functionalStatus,
    medicationOptimisation,
    reviewStatus: completeness.reviewStatus,
    completenessScore: completeness.completenessScore,
    domainStatuses: completeness.domainStatuses,
    firedRules,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
}

export { deriveFunctionalStatus, deriveMedicationOptimisation, deriveReviewCompleteness, gradeReview };
