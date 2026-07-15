import { DOMAINS } from './types.js';

// Declarative MSE documentation rules.
//
// The Mental State Examination is a documentation-and-completeness instrument,
// not a numeric score. There is exactly one documentation rule per ASEPTIC
// domain: the rule is satisfied when ANY finding field in that domain is
// non-blank (`''` counts as blank). The grader (`grader.js`) evaluates every
// rule, counts satisfied domains, derives the completeness percentage and the
// complete/partial status, and appends completeness + risk audit rows. Rows
// here mirror the `mental_state_examination_grade_rule` SQL table
// (rule_id, domain, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} DomainRule
 * @property {string} id
 * @property {string} section     - the AssessmentData section this domain reads
 * @property {string} domain      - stable domain key (appearance-behaviour, speech, …)
 * @property {string} category
 * @property {string} label       - human-readable domain name
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} satisfied
 */

// Wrapped in an IIFE; published via window.MentalStateExamination.

/**
 * A domain is documented when at least one of its finding fields is non-blank.
 * @param {AssessmentData} data
 * @param {string} section
 * @returns {boolean}
 */
function sectionDocumented(data, section) {
  const group = data[section];
  if (!group) return false;
  return Object.keys(group).some((k) => {
    const v = group[k];
    return v !== null && v !== undefined && String(v).trim() !== '';
  });
}

/** @type {DomainRule[]} */
const domainRules = DOMAINS.map((d, idx) => ({
  id: `R-DOMAIN-${String(idx + 1).padStart(2, '0')}-${d.domain.toUpperCase()}`,
  section: d.section,
  domain: d.domain,
  category: 'domain-documentation',
  label: d.label,
  description: `${d.label} domain documented (at least one finding recorded)`,
  satisfied: (data) => sectionDocumented(data, d.section)
}));

export { domainRules, sectionDocumented };
