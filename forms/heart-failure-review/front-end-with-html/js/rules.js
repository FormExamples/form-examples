// Declarative Heart Failure Annual Review rules.
//
// This is a documentation-and-classification instrument, not a numeric score.
// Two rule sets live here:
//
//   1. reviewDomainRules — one rule per required review domain (spec §4). A
//      domain is documented when its predicate is satisfied. The grader counts
//      documented domains to derive the completeness score and the
//      complete / partial / incomplete review status.
//
//   2. indicatedPillarKeys — the medication-pillar indication logic. The four
//      pillars of guideline-directed medical therapy are all indicated in
//      HFrEF; in HFmrEF / HFpEF only the SGLT2 inhibitor is the principal
//      disease-modifying pillar; for unknown type none apply.
//
// Domain keys mirror the `heart_failure_review_grade_rule` SQL table
// (rule_id, domain, category, description).

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 *
 * @typedef {Object} DomainRule
 * @property {string} id
 * @property {string} domain
 * @property {string} category
 * @property {string} label
 * @property {string} description
 * @property {(d: ReviewData) => boolean} satisfied
 */

/** True when a text / enum value is non-blank. */
function filled(v) {
  return v !== null && v !== undefined && String(v).trim() !== '';
}

/** True when a numeric value has been recorded. */
function num(v) {
  return v !== null && v !== undefined && v !== '';
}

/**
 * The six required review domains (spec §4). Each domain is documented when its
 * predicate returns true.
 * @type {DomainRule[]}
 */
const reviewDomainRules = [
  {
    id: 'R-DOMAIN-01-FUNCTIONAL',
    domain: 'functional-status',
    category: 'domain-documentation',
    label: 'Functional status',
    description: 'NYHA functional class recorded',
    satisfied: (d) => num(d.functional.nyhaClass)
  },
  {
    id: 'R-DOMAIN-02-FLUID',
    domain: 'fluid-status',
    category: 'domain-documentation',
    label: 'Fluid status',
    description: 'Weight or a fluid-status sign (oedema / JVP) recorded',
    satisfied: (d) =>
      num(d.fluid.weightKg) ||
      filled(d.fluid.peripheralOedema) ||
      filled(d.fluid.raisedJvp)
  },
  {
    id: 'R-DOMAIN-03-BLOODS',
    domain: 'monitoring-bloods',
    category: 'domain-documentation',
    label: 'Monitoring bloods',
    description: 'Potassium and eGFR recorded',
    satisfied: (d) =>
      num(d.investigations.potassium) && num(d.investigations.egfr)
  },
  {
    id: 'R-DOMAIN-04-MEDICATION',
    domain: 'medication-review',
    category: 'domain-documentation',
    label: 'Medication review',
    description: 'All four medication pillars have a recorded status',
    satisfied: (d) =>
      filled(d.medication.raasInhibitorStatus) &&
      filled(d.medication.betaBlockerStatus) &&
      filled(d.medication.mraStatus) &&
      filled(d.medication.sglt2InhibitorStatus)
  },
  {
    id: 'R-DOMAIN-05-VACCINATIONS',
    domain: 'vaccinations',
    category: 'domain-documentation',
    label: 'Vaccinations',
    description: 'Influenza vaccination status recorded',
    satisfied: (d) => filled(d.vaccinations.influenzaVaccination)
  },
  {
    id: 'R-DOMAIN-06-SELF-MANAGEMENT',
    domain: 'self-management',
    category: 'domain-documentation',
    label: 'Self-management',
    description: 'Self-management plan status recorded',
    satisfied: (d) => filled(d.vaccinations.selfManagementPlan)
  }
];

/**
 * The indicated medication-pillar keys for a heart-failure type (spec §4).
 *
 * @param {string} heartFailureType
 * @returns {string[]}  pillar keys (subset of raasInhibitor, betaBlocker, mra,
 *                       sglt2Inhibitor); empty when the pillar set does not apply
 */
function indicatedPillarKeys(heartFailureType) {
  if (heartFailureType === 'reduced') {
    return ['raasInhibitor', 'betaBlocker', 'mra', 'sglt2Inhibitor'];
  }
  if (heartFailureType === 'mildly-reduced' || heartFailureType === 'preserved') {
    return ['sglt2Inhibitor'];
  }
  return [];
}

export const _filled = filled;
export const _num = num;

export { reviewDomainRules, indicatedPillarKeys };
