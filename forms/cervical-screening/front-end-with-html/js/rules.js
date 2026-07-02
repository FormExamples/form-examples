// Declarative cervical-screening classification rules.
//
// Unlike an additive score, cervical screening is a *classification* pathway:
// the HPV-primary algorithm resolves a record to exactly one result class and
// one recommended management action via a gated, first-match cascade —
// eligibility first, then sample adequacy, then the primary hrHPV result
// refined by reflex cytology. The rules below are evaluated top-to-bottom by
// the grader (`grader.js`); the first whose `evaluate` returns true wins. Rows
// here mirror the `cervical_screening_grade_rule` SQL table
// (rule_id, category, result_class, management_action, description).

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').ResultClass} ResultClass
 * @typedef {import('./types.js').ManagementAction} ManagementAction
 *
 * @typedef {Object} ClassificationRule
 * @property {string} id
 * @property {string} category
 * @property {ResultClass} resultClass
 * @property {ManagementAction} managementAction
 * @property {string} description
 * @property {(d: ScreeningData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.CervicalScreening.
(function () {
'use strict';
window.CervicalScreening = window.CervicalScreening || {};

const MIN_AGE = 25;
const MAX_AGE = 64;

/**
 * True when the person is outside the routine programme: age known and below
 * 25 or above 64, or formally ceased. A null age is *not* treated as ineligible
 * (unknown age cannot exclude someone; `null < 25` is a JavaScript trap that we
 * guard against here).
 * @param {ScreeningData} d
 * @returns {boolean}
 */
function notEligible(d) {
  const age = d.identification.age;
  const ageOut = age !== null && (age < MIN_AGE || age > MAX_AGE);
  return d.eligibility.previouslyCeased === 'yes' || ageOut;
}

/** Cytology grades that are a *graded* (reportable) value. */
const GRADED = ['negative', 'borderline', 'low-grade', 'high-grade'];

/** @type {ClassificationRule[]} */
const classificationRules = [
  // ─── 1. ELIGIBILITY GATE ───────────────────────────────────────
  {
    id: 'R-CEASE-NOT-ELIGIBLE-01',
    category: 'eligibility',
    resultClass: 'cease-not-eligible',
    managementAction: 'cease-screening',
    description:
      'Age outside the routine 25-64 range, or the person has formally ceased screening — cease; no recall.',
    evaluate: (d) => notEligible(d)
  },

  // ─── 2. ADEQUACY GATE ──────────────────────────────────────────
  {
    id: 'R-INADEQUATE-01',
    category: 'adequacy',
    resultClass: 'inadequate',
    managementAction: 'repeat-sample-3-months',
    description:
      'Sample inadequate / unsatisfactory — never HPV-classified; repeat in ~3 months (3 consecutive inadequate -> colposcopy).',
    evaluate: (d) => d.adequacy.sampleAdequacy === 'inadequate'
  },

  // ─── 3. hrHPV PRIMARY — NEGATIVE ───────────────────────────────
  {
    id: 'R-HPV-NEGATIVE-01',
    category: 'hpv-primary',
    resultClass: 'hpv-negative',
    managementAction: 'routine-recall',
    description:
      'hrHPV not detected on an adequate sample — return to routine recall at the age-appropriate interval.',
    evaluate: (d) => d.hpv.hpvResult === 'negative'
  },

  // ─── 4. hrHPV POSITIVE + REFLEX CYTOLOGY NORMAL ────────────────
  {
    id: 'R-HPV-POSITIVE-CYTOLOGY-NORMAL-01',
    category: 'reflex-cytology',
    resultClass: 'hpv-positive-cytology-normal',
    managementAction: 'early-repeat-12-months',
    description:
      'hrHPV detected, reflex cytology negative — early repeat HPV test at 12 months.',
    evaluate: (d) =>
      d.hpv.hpvResult === 'positive' && d.cytology.cytologyGrade === 'negative'
  },

  // ─── 5. hrHPV POSITIVE + LOW-GRADE / BORDERLINE ────────────────
  {
    id: 'R-HPV-POSITIVE-CYTOLOGY-ABNORMAL-LOW-01',
    category: 'reflex-cytology',
    resultClass: 'hpv-positive-cytology-abnormal-low',
    managementAction: 'colposcopy-referral',
    description:
      'hrHPV detected, borderline or low-grade dyskaryosis — routine colposcopy referral.',
    evaluate: (d) =>
      d.hpv.hpvResult === 'positive' &&
      (d.cytology.cytologyGrade === 'borderline' ||
        d.cytology.cytologyGrade === 'low-grade')
  },

  // ─── 6. hrHPV POSITIVE + HIGH-GRADE ────────────────────────────
  {
    id: 'R-HPV-POSITIVE-CYTOLOGY-ABNORMAL-HIGH-01',
    category: 'reflex-cytology',
    resultClass: 'hpv-positive-cytology-abnormal-high',
    managementAction: 'urgent-colposcopy-referral',
    description:
      'hrHPV detected, high-grade dyskaryosis / ?glandular / ?invasive — urgent colposcopy referral.',
    evaluate: (d) =>
      d.hpv.hpvResult === 'positive' && d.cytology.cytologyGrade === 'high-grade'
  },

  // ─── 7. hrHPV POSITIVE + CYTOLOGY OUTSTANDING ──────────────────
  {
    id: 'R-HPV-POSITIVE-CYTOLOGY-PENDING-01',
    category: 'reflex-cytology',
    resultClass: 'hpv-positive-cytology-pending',
    managementAction: 'awaiting-cytology',
    description:
      'hrHPV detected but reflex cytology not yet a graded value — awaiting reflex cytology.',
    evaluate: (d) =>
      d.hpv.hpvResult === 'positive' &&
      GRADED.indexOf(d.cytology.cytologyGrade) === -1
  },

  // ─── 8. PENDING FALLBACK ───────────────────────────────────────
  {
    id: 'R-PENDING-01',
    category: 'pending',
    resultClass: 'pending',
    managementAction: 'awaiting-result',
    description:
      'Adequate sample but the primary hrHPV result is not yet recorded — awaiting result.',
    evaluate: () => true
  }
];

window.CervicalScreening.classificationRules = classificationRules;
window.CervicalScreening.notEligible = notEligible;
window.CervicalScreening.GRADED_CYTOLOGY = GRADED;
window.CervicalScreening.MIN_AGE = MIN_AGE;
window.CervicalScreening.MAX_AGE = MAX_AGE;
})();
