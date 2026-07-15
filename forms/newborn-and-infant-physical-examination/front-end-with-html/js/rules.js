// Declarative NIPE classification rules.
//
// Unlike an additive score, NIPE is a *classification* instrument: each of the
// four key screening components (eyes, heart, hips, testes) resolves to one of
// `satisfactory` / `refer` / `not-examined` (testes may be `not-applicable`
// for a girl). The rules below are the individual *refer* triggers — the
// abnormal or uncertain findings that force a component to `refer`. The grader
// (`grader.js`) evaluates them, then applies the not-examined / satisfactory
// fallbacks and the overall outcome roll-up. Rows here mirror the
// `newborn_and_infant_physical_examination_grade_rule` SQL table
// (rule_id, component, category, description).

/**
 * @typedef {import('./types.js').ExaminationData} ExaminationData
 *
 * @typedef {Object} NipeRule
 * @property {string} id
 * @property {'eyes' | 'heart' | 'hips' | 'testes'} component
 * @property {string} category
 * @property {string} description
 * @property {(d: ExaminationData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.NewbornAndInfantPhysicalExamination.

const LOW_SAT = 95; // percent; a saturation below this is a refer trigger.

/** @type {NipeRule[]} */
const nipeReferRules = [
  // ─── EYES ──────────────────────────────────────────────────────
  {
    id: 'R-EYES-REFER-01',
    component: 'eyes',
    category: 'component-result',
    description: 'Absent or abnormal red reflex, or abnormal external eye appearance',
    evaluate: (d) =>
      d.eyes.eyesRedReflexRight === 'absent' ||
      d.eyes.eyesRedReflexLeft === 'absent' ||
      d.eyes.eyesAppearance === 'abnormal'
  },

  // ─── HEART ─────────────────────────────────────────────────────
  {
    id: 'R-HEART-REFER-01',
    component: 'heart',
    category: 'component-result',
    description:
      'Heart murmur, weak or absent femoral pulse, central cyanosis, or oxygen saturation below 95%',
    evaluate: (d) =>
      d.heart.heartMurmur === 'present' ||
      d.heart.femoralPulsesRight === 'weak' ||
      d.heart.femoralPulsesRight === 'absent' ||
      d.heart.femoralPulsesLeft === 'weak' ||
      d.heart.femoralPulsesLeft === 'absent' ||
      d.heart.centralCyanosis === 'present' ||
      (d.heart.oxygenSaturationPreductal !== null &&
        d.heart.oxygenSaturationPreductal < LOW_SAT) ||
      (d.heart.oxygenSaturationPostductal !== null &&
        d.heart.oxygenSaturationPostductal < LOW_SAT)
  },

  // ─── HIPS ──────────────────────────────────────────────────────
  {
    id: 'R-HIPS-REFER-01',
    component: 'hips',
    category: 'component-result',
    description:
      'Positive Barlow or Ortolani, limited hip abduction, or a hip risk factor (breech or first-degree family history)',
    evaluate: (d) =>
      d.hips.barlowTest === 'positive' ||
      d.hips.ortolaniTest === 'positive' ||
      d.hips.hipAbduction === 'limited' ||
      d.riskFactors.breechPresentation === 'yes' ||
      d.riskFactors.familyHistoryHipProblems === 'yes'
  },

  // ─── TESTES (boys) ─────────────────────────────────────────────
  {
    id: 'R-TESTES-REFER-01',
    component: 'testes',
    category: 'component-result',
    description: 'One or both testes undescended or not palpable',
    evaluate: (d) =>
      d.identification.sex === 'male' &&
      (d.testes.testisRight === 'undescended' ||
        d.testes.testisRight === 'not-palpable' ||
        d.testes.testisLeft === 'undescended' ||
        d.testes.testisLeft === 'not-palpable')
  }
];

export { nipeReferRules, LOW_SAT };
