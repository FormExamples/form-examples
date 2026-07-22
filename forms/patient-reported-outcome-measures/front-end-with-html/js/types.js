// Plain-JavaScript / JSDoc type definitions for the Patient-Reported
// Outcome Measures battery (SF-36v2, NDI, mJOA, EQ-5D-3L).
//
// Builds the canonical empty state so newly-added fields default
// correctly. All instrument items are nullable numeric enums; only the
// visit header uses text fields.

/**
 * Build a fresh, fully-blank PRO-measures battery.
 */
function emptyAssessment() {
  return {
    visitDetails: {
      subjectId: '',
      visit: '',
      assessmentDate: ''
    },
    sf36: {
      generalHealth: null,
      healthChangeVsYearAgo: null,
      vigorousActivities: null,
      moderateActivities: null,
      liftingCarryingGroceries: null,
      climbingSeveralFlights: null,
      climbingOneFlight: null,
      bendingKneelingStooping: null,
      walkingMoreThanMile: null,
      walkingSeveralHundredYards: null,
      walkingOneHundredYards: null,
      bathingDressing: null,
      cutDownTimePhysical: null,
      accomplishedLessPhysical: null,
      limitedInKindPhysical: null,
      difficultyPerformingPhysical: null,
      cutDownTimeEmotional: null,
      accomplishedLessEmotional: null,
      lessCarefulThanUsual: null,
      socialActivitiesInterference: null,
      bodilyPain: null,
      painInterferenceWithWork: null,
      feltFullOfLife: null,
      veryNervous: null,
      soDownInDumps: null,
      feltCalmPeaceful: null,
      lotOfEnergy: null,
      downheartedDepressed: null,
      feltWornOut: null,
      beenHappy: null,
      feltTired: null,
      socialActivitiesInterferenceTime: null,
      getSickEasier: null,
      asHealthyAsAnybody: null,
      expectHealthWorse: null,
      healthExcellent: null
    },
    ndi: {
      painIntensity: null,
      personalCare: null,
      lifting: null,
      reading: null,
      headache: null,
      concentration: null,
      work: null,
      driving: null,
      sleeping: null,
      recreation: null
    },
    mjoa: {
      motorArms: null,
      motorLegs: null,
      sensationArms: null,
      sensationLegs: null,
      sensationTrunk: null,
      bladderFunction: null
    },
    eq5d: {
      mobility: null,
      selfCare: null,
      usualActivities: null,
      painDiscomfort: null,
      anxietyDepression: null,
      vasScore: null
    }
  };
}

export { emptyAssessment };
