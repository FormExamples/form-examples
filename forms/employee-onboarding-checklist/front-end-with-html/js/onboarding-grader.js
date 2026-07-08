// Onboarding-checklist grader. Pure functions: take an `AssessmentData`
// object, return the completion percentage (0-100), the
// `CompletionStatus` (not-started / in-progress / mostly-complete /
// complete), the overall `RiskLevel` (low / moderate / high / critical),
// items completed / total counts, and the list of fired rules.
// Ported 1-to-1 from `src/lib/engine/onboarding-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').CompletionStatus} CompletionStatus
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.EmployeeOnboardingChecklist.
(function () {
'use strict';
window.EmployeeOnboardingChecklist = window.EmployeeOnboardingChecklist || {};
const NS = window.EmployeeOnboardingChecklist;

/**
 * Pure function: evaluates all onboarding rules against employee data.
 * Returns completion percentage, status, risk level, and all fired rules.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   completionPercentage: number,
 *   completionStatus: CompletionStatus,
 *   overallRisk: RiskLevel,
 *   itemsCompleted: number,
 *   itemsTotal: number,
 *   firedRules: FiredRule[]
 * }}
 */
function calculateOnboardingGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of NS.onboardingRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue grading
      console.warn(`Onboarding rule ${rule.id} evaluation failed:`, e);
    }
  }

  // Calculate completion percentage
  const { completed, total } = countCompletedItems(data);
  const completionPercentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

  // Derive status from percentage
  const completionStatus = NS.deriveCompletionStatus(completionPercentage);

  // Derive overall risk from worst fired rule grade
  const overallRisk = deriveOverallRisk(firedRules, completionPercentage);

  return {
    completionPercentage,
    completionStatus,
    overallRisk,
    itemsCompleted: completed,
    itemsTotal: total,
    firedRules
  };
}

/**
 * Count completed checklist items across all sections.
 * Mirrors `countCompletedItems` from onboarding-grader.ts.
 *
 * @param {AssessmentData} data
 * @returns {{ completed: number, total: number, byCategory: Object }}
 */
function countCompletedItems(data) {
  let completed = 0;
  let total = 0;
  /** @type {Object<string, {completed: number, total: number, items: Array<{label:string, done:boolean}>}>} */
  const byCategory = {
    'Pre-Employment': { completed: 0, total: 0, items: [] },
    'Occupational Health': { completed: 0, total: 0, items: [] },
    'Mandatory Training': { completed: 0, total: 0, items: [] },
    'Professional Registration': { completed: 0, total: 0, items: [] },
    'IT Systems': { completed: 0, total: 0, items: [] },
    'Uniform & ID': { completed: 0, total: 0, items: [] },
    'Induction': { completed: 0, total: 0, items: [] },
    'Probation': { completed: 0, total: 0, items: [] },
    'Sign-off': { completed: 0, total: 0, items: [] }
  };

  function track(category, label, done) {
    total++;
    if (done) completed++;
    byCategory[category].total++;
    if (done) byCategory[category].completed++;
    byCategory[category].items.push({ label, done });
  }

  // Pre-Employment (4 key items)
  track('Pre-Employment', 'DBS check cleared', data.preEmploymentChecks.dbsCheckStatus === 'cleared');
  track('Pre-Employment', 'Right to work verified', data.preEmploymentChecks.rightToWorkVerified === 'yes');
  track('Pre-Employment', 'References satisfactory', data.preEmploymentChecks.referencesSatisfactory === 'yes');
  track('Pre-Employment', 'Identity verified', data.preEmploymentChecks.identityVerified === 'yes');

  // Occupational Health (3 key items)
  track('Occupational Health', 'OH clearance received', data.occupationalHealth.ohClearanceReceived === 'yes');
  track('Occupational Health', 'Fit to work', data.occupationalHealth.fitToWork === 'yes');
  track('Occupational Health', 'Immunisation status complete', data.occupationalHealth.immunisationStatus === 'complete');

  // Mandatory Training (9 key items)
  track('Mandatory Training', 'Fire safety', data.mandatoryTraining.fireSafetyCompleted === 'yes');
  track('Mandatory Training', 'Manual handling', data.mandatoryTraining.manualHandlingCompleted === 'yes');
  track('Mandatory Training', 'Infection control', data.mandatoryTraining.infectionControlCompleted === 'yes');
  track('Mandatory Training', 'Safeguarding adults', data.mandatoryTraining.safeguardingAdultsCompleted === 'yes');
  track('Mandatory Training', 'Safeguarding children', data.mandatoryTraining.safeguardingChildrenCompleted === 'yes');
  track('Mandatory Training', 'Information governance', data.mandatoryTraining.informationGovernanceCompleted === 'yes');
  track('Mandatory Training', 'Basic life support', data.mandatoryTraining.basicLifeSupportCompleted === 'yes');
  track('Mandatory Training', 'Equality & diversity', data.mandatoryTraining.equalityDiversityCompleted === 'yes');
  track('Mandatory Training', 'Health & safety', data.mandatoryTraining.healthSafetyCompleted === 'yes');

  // Professional Registration (1 key item, only counted if required)
  if (data.professionalRegistration.registrationRequired === 'yes') {
    track('Professional Registration', 'Registration verified',
      data.professionalRegistration.registrationVerified === 'yes');
  }

  // IT Systems (3 key items)
  track('IT Systems', 'Email account created', data.itSystemsAccess.emailAccountCreated === 'yes');
  track('IT Systems', 'Network login created', data.itSystemsAccess.networkLoginCreated === 'yes');
  track('IT Systems', 'Clinical system access', data.itSystemsAccess.clinicalSystemAccess === 'yes');

  // Uniform & ID (2 key items)
  track('Uniform & ID', 'ID badge issued', data.uniformIDBadge.idBadgeIssued === 'yes');
  track('Uniform & ID', 'Access card issued', data.uniformIDBadge.accessCardIssued === 'yes');

  // Induction (2 key items)
  track('Induction', 'Corporate induction completed', data.inductionProgramme.corporateInductionCompleted === 'yes');
  track('Induction', 'Local induction completed', data.inductionProgramme.localInductionCompleted === 'yes');

  // Probation (1 key item)
  track('Probation', 'Objectives set', data.probationSupervision.objectivesSet === 'yes');

  // Sign-off (3 key items)
  track('Sign-off', 'Confidentiality agreement signed', data.signOffCompliance.confidentialityAgreementSigned === 'yes');
  track('Sign-off', 'GDPR training completed', data.signOffCompliance.gdprTrainingCompleted === 'yes');
  track('Sign-off', 'Manager sign-off obtained', data.signOffCompliance.managerSignedOff === 'yes');

  return { completed, total, byCategory };
}

/**
 * Derive overall risk from fired rules and completion percentage.
 * @param {FiredRule[]} firedRules
 * @param {number} completionPercentage
 * @returns {RiskLevel}
 */
function deriveOverallRisk(firedRules, completionPercentage) {
  const maxGrade =
    firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 0;

  // Critical: any grade 4 rule or very low completion
  if (maxGrade >= 4 || completionPercentage < 10) return 'critical';

  // High: any grade 3 rule or low completion
  if (maxGrade >= 3 || completionPercentage < 30) return 'high';

  // Moderate: any grade 2 rule or moderate completion
  if (maxGrade >= 2 || completionPercentage < 70) return 'moderate';

  // Low: grade 1 or no rules fired with high completion
  return 'low';
}

Object.assign(window.EmployeeOnboardingChecklist, {
  calculateOnboardingGrade,
  countCompletedItems,
  deriveOverallRisk
});
})();
