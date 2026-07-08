// First Responder grader. Pure functions: take an `AssessmentData` object
// and produce a `GradingResult` (overall competency, fitness decision,
// risk level, domain breakdown, fired rules, additional flags, timestamp).
//
// Ported directly from `responder-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').CompetencyLevel} CompetencyLevel
 * @typedef {import('./types.js').FitnessDecision} FitnessDecision
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.FirstResponderAssessment.
(function () {
'use strict';
window.FirstResponderAssessment = window.FirstResponderAssessment || {};

const NS = window.FirstResponderAssessment;
const { responderRules, aggregateCompetency } = NS;

/**
 * Pure function: evaluates all first responder rules against assessment data.
 * Returns domain competency levels, overall fitness decision, and all fired rules.
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateResponderGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of responderRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          domain: rule.domain,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue grading
      console.warn(`Responder rule ${rule.id} evaluation failed:`, e);
    }
  }

  // Determine domain competency levels
  const domainLevels = deriveDomainLevels(data);

  // Determine overall competency (worst domain)
  const overallCompetency = deriveOverallCompetency(domainLevels);

  // Determine overall fitness decision
  const overallFitness = deriveOverallFitness(data, firedRules, overallCompetency);

  // Determine overall risk from worst fired rule grade
  const overallRisk = deriveOverallRisk(firedRules, overallCompetency);

  const additionalFlags = NS.detectAdditionalFlags(data);

  return {
    overallCompetency,
    overallFitness,
    overallRisk,
    domainLevels,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

/** Derive domain competency levels from assessment data. */
function deriveDomainLevels(data) {
  return {
    physicalFitness: aggregateCompetency([
      data.physicalFitness.cardiovascularFitness,
      data.physicalFitness.muscularStrength,
      data.physicalFitness.manualHandlingCompetency,
      data.physicalFitness.flexibilityMobility,
      data.physicalFitness.balanceCoordination
    ]),
    clinicalSkills: aggregateCompetency([
      data.clinicalSkills.basicLifeSupport,
      data.clinicalSkills.advancedLifeSupport,
      data.clinicalSkills.airwayManagement,
      data.clinicalSkills.patientAssessment,
      data.clinicalSkills.traumaAssessment,
      data.clinicalSkills.triageCompetency,
      data.clinicalSkills.drugAdministration
    ]),
    equipmentVehicle: aggregateCompetency([
      data.equipmentVehicle.defibrillatorCompetency,
      data.equipmentVehicle.monitorCompetency,
      data.equipmentVehicle.stretcherCompetency,
      data.equipmentVehicle.ambulanceDriving,
      data.equipmentVehicle.equipmentCheckCompetency
    ]),
    communication: aggregateCompetency([
      data.communicationSkills.patientCommunication,
      data.communicationSkills.handoverCompetency,
      data.communicationSkills.documentationCompetency,
      data.communicationSkills.safeguardingAwareness
    ]),
    psychological: aggregateCompetency([
      data.psychologicalReadiness.stressManagement,
      data.psychologicalReadiness.decisionMakingUnderPressure,
      data.psychologicalReadiness.emotionalRegulation
    ])
  };
}

/** Derive overall competency from the worst domain level. */
function deriveOverallCompetency(domainLevels) {
  const levels = Object.values(domainLevels).filter((l) => l !== '');
  if (levels.length === 0) return '';
  return aggregateCompetency(levels);
}

/** Derive overall fitness decision. */
function deriveOverallFitness(data, firedRules, overallCompetency) {
  // If assessor has already set a decision, use it
  if (data.fitnessDecision.overallFitness !== '') {
    return data.fitnessDecision.overallFitness;
  }

  // Auto-derive based on rules and competency
  const maxGrade = firedRules.length > 0 ? Math.max.apply(null, firedRules.map((r) => r.grade)) : 0;

  // Any grade 4 rule = permanently or temporarily unfit
  if (maxGrade >= 4) return 'permanently-unfit';

  // Any grade 3 rule or not-competent = temporarily unfit
  if (maxGrade >= 3 || overallCompetency === 'not-competent') return 'temporarily-unfit';

  // Any grade 2 rule or developing = fit with restrictions
  if (maxGrade >= 2 || overallCompetency === 'developing') return 'fit-with-restrictions';

  // Otherwise = fit for duty
  return 'fit-for-duty';
}

/** Derive overall risk from fired rules and competency. */
function deriveOverallRisk(firedRules, overallCompetency) {
  const maxGrade = firedRules.length > 0 ? Math.max.apply(null, firedRules.map((r) => r.grade)) : 0;

  if (maxGrade >= 4 || overallCompetency === 'not-competent') return 'critical';
  if (maxGrade >= 3) return 'high';
  if (maxGrade >= 2 || overallCompetency === 'developing') return 'moderate';
  return 'low';
}

Object.assign(window.FirstResponderAssessment, {
  calculateResponderGrade
});
})();
