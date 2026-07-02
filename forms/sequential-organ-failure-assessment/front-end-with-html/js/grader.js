// SOFA grader. Pure functions: take an `AssessmentData` object, run the six
// per-system scorers in `systemScorers`, sum the non-null sub-scores into the
// total (0-24), derive delta-SOFA from the recorded baseline, band the total
// for mortality risk, and set the Sepsis-3 flag.
//
// Grading algorithm (spec §4):
//   subScores[system] = systemScorers[system](data).score   // 0..4 or null
//   totalSofa   = sum of non-null sub-scores (0..24)
//   complete    = every sub-score non-null
//   deltaSofa   = totalSofa - baselineSofaTotal, or null when no baseline
//   mortalityBand = 0-6 low, 7-9 moderate, 10-12 high, 13-14 veryHigh, 15-24 extreme
//   sepsis3     = suspectedInfection === 'yes' AND deltaSofa != null AND deltaSofa >= 2
//
// A missing input yields a null sub-score for that system, contributes 0 to the
// total, and marks the assessment incomplete; `flags.js` raises the
// completeness flag separately. The engine never guesses.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SubScores} SubScores
 * @typedef {import('./types.js').MortalityBand} MortalityBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.SequentialOrganFailureAssessment.
(function () {
'use strict';
window.SequentialOrganFailureAssessment =
  window.SequentialOrganFailureAssessment || {};
const { systemScorers } = window.SequentialOrganFailureAssessment;

const SYSTEMS = ['respiration', 'coagulation', 'liver', 'cardiovascular', 'cns', 'renal'];

/**
 * Band the total SOFA score into a mortality-risk band.
 * @param {number} total
 * @returns {MortalityBand}
 */
function deriveMortalityBand(total) {
  if (total >= 15) return 'extreme';
  if (total >= 13) return 'veryHigh';
  if (total >= 10) return 'high';
  if (total >= 7) return 'moderate';
  return 'low';
}

/**
 * Compute the full SOFA grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ subScores: SubScores, totalSofa: number, complete: boolean,
 *             deltaSofa: number | null, mortalityBand: MortalityBand,
 *             sepsis3: boolean, firedRules: FiredRule[] }}
 */
function calculateSofaGrade(data) {
  /** @type {SubScores} */
  const subScores = {
    respiration: null, coagulation: null, liver: null,
    cardiovascular: null, cns: null, renal: null
  };
  /** @type {FiredRule[]} */
  const firedRules = [];

  let totalSofa = 0;
  let complete = true;

  for (const system of SYSTEMS) {
    let result;
    try {
      result = systemScorers[system](data);
    } catch (e) {
      console.warn(`SOFA scorer ${system} failed:`, e);
      result = { score: null, ruleId: `R-${system.toUpperCase()}-ERR`,
        category: 'threshold-band', description: 'Scorer error.' };
    }
    subScores[system] = result.score;
    if (result.score === null) {
      complete = false;
    } else {
      totalSofa += result.score;
    }
    firedRules.push({
      id: result.ruleId,
      parameter: system,
      points: result.score,
      category: result.category,
      description: result.description
    });
  }

  const baseline = data.baseline.baselineSofaTotal;
  const hasBaseline = baseline !== null && baseline !== undefined && !Number.isNaN(baseline);
  const deltaSofa = hasBaseline ? totalSofa - baseline : null;

  const mortalityBand = deriveMortalityBand(totalSofa);

  const sepsis3 =
    data.baseline.suspectedInfection === 'yes' &&
    deltaSofa !== null &&
    deltaSofa >= 2;

  // Derivation audit rows, mirroring the grade_rule table's parameter enum.
  firedRules.push({
    id: 'R-TOTAL-01',
    parameter: 'total',
    points: null,
    category: 'total-score',
    description: `Total SOFA ${totalSofa} of 24${complete ? '' : ' (incomplete — one or more systems not scored)'}.`
  });
  if (deltaSofa !== null) {
    firedRules.push({
      id: 'R-DELTA-01',
      parameter: 'delta',
      points: null,
      category: 'delta-sofa',
      description: `Delta-SOFA ${deltaSofa >= 0 ? '+' : ''}${deltaSofa} versus baseline ${baseline}.`
    });
  }
  firedRules.push({
    id: 'R-BAND-01',
    parameter: 'band',
    points: null,
    category: 'mortality-band',
    description: `Total ${totalSofa} — ${mortalityBand} mortality-risk band.`
  });
  if (sepsis3) {
    firedRules.push({
      id: 'R-SEPSIS-01',
      parameter: 'sepsis',
      points: null,
      category: 'sepsis-criterion',
      description: `Suspected infection with delta-SOFA >= 2 — meets the Sepsis-3 criterion.`
    });
  }

  return {
    subScores,
    totalSofa,
    complete,
    deltaSofa,
    mortalityBand,
    sepsis3,
    firedRules
  };
}

Object.assign(window.SequentialOrganFailureAssessment, {
  SYSTEMS,
  deriveMortalityBand,
  calculateSofaGrade
});
})();
