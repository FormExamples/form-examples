// Genetic Assessment risk grader.
//
// Pure functions: take an `AssessmentData` object, return the total risk
// score (0..N), the `RiskLevel`, and the list of fired rules. Mirrors the
// SvelteKit reference at
// `forms/genetic-assessment/front-end-form-with-svelte/src/lib/engine/risk-grader.ts`.
//
// Risk Stratification:
//   0-2  = Low Risk
//   3-5  = Moderate Risk
//   6+   = High Risk

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').RiskRuleDefinition} RiskRuleDefinition
 */

// Wrapped in an IIFE; published via window.GeneticAssessment.
(function () {
'use strict';
window.GeneticAssessment = window.GeneticAssessment || {};
const { riskRules, riskCategory } = window.GeneticAssessment;

/**
 * Look up a rule by id and push it onto firedRules; return its weight.
 * @param {string} id
 * @param {FiredRule[]} firedRules
 * @returns {number}
 */
function fire(id, firedRules) {
  const rule = riskRules.find((r) => r.id === id);
  if (!rule) {
    console.warn('Unknown rule id:', id);
    return 0;
  }
  firedRules.push({
    id: rule.id,
    category: rule.category,
    description: rule.description,
    weight: rule.weight
  });
  return rule.weight;
}

/**
 * Calculate the genetic risk score from the assessment data.
 *
 * @param {AssessmentData} data
 * @returns {{ riskScore: number, riskLevel: RiskLevel, firedRules: FiredRule[] }}
 */
function calculateRisk(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let riskScore = 0;

  // ─── Personal Medical History ──────────────────────────
  if (data.personalMedicalHistory.birthDefects === 'yes') {
    riskScore += fire('RISK-BIRTH-001', firedRules);
  }
  if (data.personalMedicalHistory.developmentalDelay === 'yes') {
    riskScore += fire('RISK-DELAY-001', firedRules);
  }
  if (data.personalMedicalHistory.intellectualDisability === 'yes') {
    riskScore += fire('RISK-INTEL-001', firedRules);
  }
  if (data.personalMedicalHistory.multipleAnomalies === 'yes') {
    riskScore += fire('RISK-ANOM-001', firedRules);
  }
  if (data.personalMedicalHistory.chromosomalCondition === 'yes') {
    riskScore += fire('RISK-CHROMO-001', firedRules);
  }
  if (data.personalMedicalHistory.knownGeneticCondition === 'yes') {
    riskScore += fire('RISK-GENETIC-001', firedRules);
  }

  // ─── Cancer History ─────────────────────────────────────
  if (data.cancerHistory.personalCancerHistory === 'yes') {
    riskScore += fire('RISK-CANCER-001', firedRules);
    if (
      data.cancerHistory.ageAtDiagnosis !== null &&
      data.cancerHistory.ageAtDiagnosis !== undefined &&
      data.cancerHistory.ageAtDiagnosis < 50
    ) {
      riskScore += fire('RISK-CANCER-002', firedRules);
    }
  }
  if (data.cancerHistory.multiplePrimaryCancers === 'yes') {
    riskScore += fire('RISK-CANCER-003', firedRules);
  }

  // ─── Family Pedigree ────────────────────────────────────
  const familyMembers = [
    data.familyPedigree.maternalGrandmother,
    data.familyPedigree.maternalGrandfather,
    data.familyPedigree.paternalGrandmother,
    data.familyPedigree.paternalGrandfather,
    data.familyPedigree.mother,
    data.familyPedigree.father
  ];

  const familyCancerCount = familyMembers
    .filter((m) => m && (m.cancers || '').trim() !== '')
    .length;
  if (familyCancerCount >= 2) {
    riskScore += fire('RISK-FAMILY-001', firedRules);
  }

  const familyDeceased = familyMembers
    .filter((m) => m && m.deceased === 'yes' && (m.conditions || '').trim() !== '')
    .length;
  if (familyDeceased > 0) {
    riskScore += fire('RISK-FAMILY-002', firedRules);
  }

  // ─── Cardiovascular Genetics ────────────────────────────
  if (data.cardiovascularGenetics.familialHypercholesterolemia === 'yes') {
    riskScore += fire('RISK-CVD-001', firedRules);
  }
  if (data.cardiovascularGenetics.cardiomyopathy === 'yes') {
    riskScore += fire('RISK-CVD-002', firedRules);
  }
  if (data.cardiovascularGenetics.suddenCardiacDeath === 'yes') {
    riskScore += fire('RISK-CVD-003', firedRules);
  }

  // ─── Neurogenetics ──────────────────────────────────────
  if (data.neurogenetics.huntington === 'yes') {
    riskScore += fire('RISK-NEURO-001', firedRules);
  }
  if (data.neurogenetics.alzheimersEarly === 'yes') {
    riskScore += fire('RISK-NEURO-002', firedRules);
  }
  if (data.neurogenetics.muscularDystrophy === 'yes') {
    riskScore += fire('RISK-NEURO-003', firedRules);
  }

  // ─── Reproductive Genetics ──────────────────────────────
  if (data.reproductiveGenetics.recurrentMiscarriages === 'yes') {
    riskScore += fire('RISK-REPRO-001', firedRules);
  }
  if (data.reproductiveGenetics.previousAffectedChild === 'yes') {
    riskScore += fire('RISK-REPRO-002', firedRules);
  }

  // ─── Consanguinity ──────────────────────────────────────
  if (
    data.reproductiveGenetics.consanguinity === 'yes' ||
    data.ethnicBackground.consanguinity === 'yes'
  ) {
    riskScore += fire('RISK-CONSANG-001', firedRules);
  }

  // ─── Ethnic Background ──────────────────────────────────
  if (data.ethnicBackground.ashkenaziJewish === 'yes') {
    const hasRelevantConditions =
      data.cancerHistory.personalCancerHistory === 'yes' ||
      data.reproductiveGenetics.carrierStatus === 'yes' ||
      familyCancerCount > 0;
    if (hasRelevantConditions) {
      riskScore += fire('RISK-ETHNIC-001', firedRules);
    }
  }

  // ─── Genetic Testing History ────────────────────────────
  if (data.geneticTestingHistory.variantsOfUncertainSignificance === 'yes') {
    riskScore += fire('RISK-VUS-001', firedRules);
  }
  if (data.reproductiveGenetics.carrierStatus === 'yes') {
    riskScore += fire('RISK-CARRIER-001', firedRules);
  }

  const riskLevel = riskCategory(riskScore);
  return { riskScore, riskLevel, firedRules };
}

/**
 * Convenience wrapper that mirrors the public name `gradeRisk(data)`
 * requested in this form's spec; alias of `calculateRisk`.
 * @param {AssessmentData} data
 */
function gradeRisk(data) {
  return calculateRisk(data);
}

Object.assign(window.GeneticAssessment, {
  calculateRisk,
  gradeRisk
});
})();
