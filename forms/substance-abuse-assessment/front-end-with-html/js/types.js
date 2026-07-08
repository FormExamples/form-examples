// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Substance Abuse Assessment
// form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} SeverityLevel
 * @typedef {'low-risk' | 'hazardous' | 'harmful' | 'dependence-likely' | ''} AuditRiskCategory
 * @typedef {'no-problems' | 'low' | 'moderate' | 'substantial' | 'severe' | ''} DastRiskCategory
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 */

(function () {
'use strict';
window.SubstanceAbuseAssessment = window.SubstanceAbuseAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * AUDIT scores default to 0 (the engine treats 0 as 'unanswered low risk').
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    alcoholUseAudit: {
      auditQ1Frequency: 0,
      auditQ2TypicalQuantity: 0,
      auditQ3BingeFrequency: 0,
      auditQ4ImpairedControl: 0,
      auditQ5FailedExpectations: 0,
      auditQ6MorningDrinking: 0,
      auditQ7Guilt: 0,
      auditQ8Blackout: 0,
      auditQ9Injury: 0,
      auditQ10Concern: 0
    },
    drugUseDast: {
      dastQ1NonMedicalUse: '',
      dastQ2PolyDrug: '',
      dastQ3AbleToStop: '',
      dastQ4Blackouts: '',
      dastQ5Guilt: '',
      dastQ6Complaints: '',
      dastQ7Neglect: '',
      dastQ8IllegalActivities: '',
      dastQ9Withdrawal: '',
      dastQ10MedicalProblems: ''
    },
    substanceUseHistory: {
      ageFirstAlcoholUse: null,
      ageFirstDrugUse: null,
      primarySubstance: '',
      primarySubstanceOther: '',
      secondarySubstances: '',
      routeOfAdministration: '',
      frequencyOfUse: '',
      durationOfUse: '',
      lastUseDate: '',
      currentUseStatus: '',
      ivDrugUse: '',
      needleSharing: ''
    },
    withdrawalAssessment: {
      currentlyInWithdrawal: '',
      withdrawalSubstance: '',
      tremor: '',
      sweating: '',
      nauseaVomiting: '',
      anxiety: '',
      agitation: '',
      seizureHistory: '',
      deliriumTremensHistory: '',
      hallucinations: '',
      lastDrinkDrugHours: null,
      withdrawalSeverity: '',
      medicallySupervisedDetoxNeeded: ''
    },
    mentalHealthComorbidities: {
      depression: '',
      depressionSeverity: '',
      anxietyDisorder: '',
      anxietyDisorderType: '',
      ptsd: '',
      ptsdDetails: '',
      bipolarDisorder: '',
      psychosis: '',
      personalityDisorder: '',
      eatingDisorder: '',
      adhd: '',
      suicidalIdeation: '',
      suicidalIdeationCurrent: '',
      selfHarmHistory: '',
      previousSuicideAttempts: '',
      psychiatricMedication: '',
      psychiatricMedicationDetails: ''
    },
    physicalHealthImpact: {
      liverDisease: '',
      liverDiseaseType: '',
      hepatitisB: '',
      hepatitisC: '',
      hivStatus: '',
      cardiovascularIssues: '',
      cardiovascularDetails: '',
      respiratoryIssues: '',
      respiratoryDetails: '',
      gastrointestinalIssues: '',
      gastrointestinalDetails: '',
      neurologicalIssues: '',
      neurologicalDetails: '',
      nutritionalDeficiency: '',
      chronicPain: '',
      chronicPainDetails: '',
      overdoseHistory: '',
      overdoseCount: null,
      lastOverdoseDate: ''
    },
    socialLegalImpact: {
      employmentStatus: '',
      occupation: '',
      employmentAffected: '',
      housingStatus: '',
      relationshipStatus: '',
      relationshipImpact: '',
      dependents: null,
      childrenSafeguardingConcerns: '',
      socialSupport: '',
      criminalRecord: '',
      criminalRecordDetails: '',
      currentLegalIssues: '',
      currentLegalDetails: '',
      duiDwiHistory: '',
      financialDifficulties: '',
      domesticViolence: '',
      domesticViolenceDetails: ''
    },
    previousTreatmentHistory: {
      previousTreatment: '',
      numberOfTreatmentEpisodes: null,
      previousDetox: '',
      detoxSetting: '',
      previousRehab: '',
      rehabType: '',
      previousCounselling: '',
      counsellingType: '',
      previousMedicationAssisted: '',
      matMedication: '',
      selfHelpGroups: '',
      selfHelpGroupType: '',
      longestPeriodAbstinent: '',
      relapseTriggers: ''
    },
    treatmentPlanningGoals: {
      treatmentGoal: '',
      readinessToChange: '',
      motivationLevel: '',
      preferredTreatmentSetting: '',
      interestedInCounselling: '',
      interestedInMedication: '',
      interestedInSelfHelp: '',
      barriersToTreatment: '',
      supportNetworkAvailable: '',
      supportNetworkDetails: '',
      riskOfRelapse: '',
      safetyPlanNeeded: '',
      naloxoneProvided: '',
      followUpPlan: ''
    }
  };
}

Object.assign(window.SubstanceAbuseAssessment, {
  emptyAssessment
});
})();
