// Plain-JavaScript type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Occupational Therapy
// Assessment form. Builds the canonical empty AssessmentData shape used
// by the wizard so newly-added fields default correctly when older saved
// state is rehydrated from localStorage.

(function () {
  'use strict';

  /** @returns {object} */
  function emptyAssessment() {
    return {
      demographics: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        sex: ''
      },
      referralInfo: {
        referralSource: '',
        referralReason: '',
        referringClinician: '',
        referralDate: '',
        primaryDiagnosis: ''
      },
      selfCareActivities: {
        personalCare: { difficulty: '', details: '' },
        functionalMobility: { difficulty: '', details: '' },
        communityManagement: { difficulty: '', details: '' }
      },
      productivityActivities: {
        paidWork: { difficulty: '', details: '' },
        householdManagement: { difficulty: '', details: '' },
        education: { difficulty: '', details: '' }
      },
      leisureActivities: {
        quietRecreation: { difficulty: '', details: '' },
        activeRecreation: { difficulty: '', details: '' },
        socialParticipation: { difficulty: '', details: '' }
      },
      performanceRatings: {
        activity1: { name: '', importance: null, performanceScore: null },
        activity2: { name: '', importance: null, performanceScore: null },
        activity3: { name: '', importance: null, performanceScore: null },
        activity4: { name: '', importance: null, performanceScore: null },
        activity5: { name: '', importance: null, performanceScore: null }
      },
      satisfactionRatings: {
        activity1: { name: '', satisfactionScore: null },
        activity2: { name: '', satisfactionScore: null },
        activity3: { name: '', satisfactionScore: null },
        activity4: { name: '', satisfactionScore: null },
        activity5: { name: '', satisfactionScore: null }
      },
      environmentalFactors: {
        homeEnvironment: '',
        workEnvironment: '',
        communityAccess: '',
        assistiveDevices: '',
        socialSupport: ''
      },
      physicalCognitiveStatus: {
        upperExtremity: '',
        lowerExtremity: '',
        coordination: '',
        cognition: '',
        vision: '',
        fatigue: '',
        pain: ''
      },
      goalsPriorities: {
        shortTermGoals: '',
        longTermGoals: '',
        priorityAreas: '',
        dischargeGoals: ''
      }
    };
  }

  function difficultyLabel(d) {
    switch (d) {
      case 'none': return 'No difficulty';
      case 'some': return 'Some difficulty';
      case 'significant': return 'Significant difficulty';
      case 'unable': return 'Unable to perform';
      default: return '';
    }
  }

  function copmPerformanceCategory(score) {
    if (score < 5) return 'Significant issues';
    if (score <= 7) return 'Moderate concerns';
    return 'Good performance';
  }

  function copmCategoryClass(score) {
    if (score < 5) return 'copm-significant';
    if (score <= 7) return 'copm-moderate';
    return 'copm-good';
  }

  window.OccupationalTherapyAssessment = window.OccupationalTherapyAssessment || {};
  Object.assign(window.OccupationalTherapyAssessment, {
    emptyAssessment,
    difficultyLabel,
    copmPerformanceCategory,
    copmCategoryClass
  });
})();
