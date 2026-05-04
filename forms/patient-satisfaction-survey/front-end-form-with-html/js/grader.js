// Patient Satisfaction grader. Pure functions: take an `AssessmentData`
// object and return the per-domain normalized scores (0-100), the overall
// composite score, the satisfaction category, and the list of fired rules.
//
// Mirrors src/lib/engine/grader.ts in the SvelteKit form.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainScores} DomainScores
 * @typedef {import('./types.js').SatisfactionCategory} SatisfactionCategory
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.PatientSatisfactionSurvey.
(function () {
'use strict';
window.PatientSatisfactionSurvey = window.PatientSatisfactionSurvey || {};
const {
  satisfactionRules,
  normalizeLikertScores,
  categorizeScore
} = window.PatientSatisfactionSurvey;

/**
 * Calculate normalized scores for each of the seven satisfaction domains.
 * @param {AssessmentData} data
 * @returns {DomainScores}
 */
function calculateDomainScores(data) {
  return {
    access: normalizeLikertScores([
      data.accessWaitingTimes.easeOfBooking,
      data.accessWaitingTimes.waitingTimeForAppointment,
      data.accessWaitingTimes.waitingTimeOnDay,
      data.accessWaitingTimes.receptionService,
      data.accessWaitingTimes.signageWayfinding,
      data.accessWaitingTimes.parkingTransport
    ]),
    communication: normalizeLikertScores([
      data.communicationInformation.explanationOfCondition,
      data.communicationInformation.explanationOfTreatment,
      data.communicationInformation.opportunityToAskQuestions,
      data.communicationInformation.listenedTo,
      data.communicationInformation.informedAboutMedication,
      data.communicationInformation.writtenInformationQuality
    ]),
    clinicalCare: normalizeLikertScores([
      data.clinicalCareQuality.confidenceInClinician,
      data.clinicalCareQuality.thoroughnessOfExamination,
      data.clinicalCareQuality.painManagement,
      data.clinicalCareQuality.involvementInDecisions,
      data.clinicalCareQuality.privacyDuringExamination,
      data.clinicalCareQuality.coordinationOfCare
    ]),
    staff: normalizeLikertScores([
      data.staffAttitude.doctorCourtesy,
      data.staffAttitude.nurseCourtesy,
      data.staffAttitude.receptionCourtesy,
      data.staffAttitude.respectForDignity,
      data.staffAttitude.culturalSensitivity,
      data.staffAttitude.emotionalSupport
    ]),
    environment: normalizeLikertScores([
      data.environmentFacilities.cleanliness,
      data.environmentFacilities.comfort,
      data.environmentFacilities.noiseLevels,
      data.environmentFacilities.foodQuality,
      data.environmentFacilities.toiletFacilities,
      data.environmentFacilities.temperatureComfort
    ]),
    discharge: normalizeLikertScores([
      data.dischargeFollowUp.dischargeInformation,
      data.dischargeFollowUp.medicationExplanation,
      data.dischargeFollowUp.followUpArrangements,
      data.dischargeFollowUp.knewWhoToContact,
      data.dischargeFollowUp.recoveryInformation,
      data.dischargeFollowUp.carePlanClarity
    ]),
    overall: normalizeLikertScores([
      data.overallExperience.overallSatisfaction,
      data.overallExperience.wouldRecommend,
      data.overallExperience.metExpectations,
      data.overallExperience.feltSafe,
      data.overallExperience.wouldReturn
    ])
  };
}

/**
 * Calculate the overall composite score as the mean of the per-domain
 * normalized scores. Domains with no answers are skipped. Returns 0 when
 * nothing has been answered.
 * @param {DomainScores} domains
 */
function calculateOverallScore(domains) {
  const scores = [
    domains.access,
    domains.communication,
    domains.clinicalCare,
    domains.staff,
    domains.environment,
    domains.discharge,
    domains.overall
  ].filter((s) => s !== null && s !== undefined);

  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

/**
 * Evaluate all satisfaction rules and compute scores.
 * @param {AssessmentData} data
 * @returns {{ normalizedScore: number, satisfactionCategory: SatisfactionCategory, domainScores: DomainScores, firedRules: FiredRule[] }}
 */
function calculateSatisfactionGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of satisfactionRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          domain: rule.domain,
          description: rule.description,
          severity: rule.severity
        });
      }
    } catch (e) {
      console.warn(`Satisfaction rule ${rule.id} evaluation failed:`, e);
    }
  }

  const domainScores = calculateDomainScores(data);
  const normalizedScore = calculateOverallScore(domainScores);
  const satisfactionCategory = categorizeScore(normalizedScore);

  return { normalizedScore, satisfactionCategory, domainScores, firedRules };
}

Object.assign(window.PatientSatisfactionSurvey, {
  calculateDomainScores,
  calculateOverallScore,
  calculateSatisfactionGrade
});
})();
