// Plain-JavaScript / JSDoc type definitions for the Knee Replacement Surgery
// Evaluation form.
//
// Builds the canonical empty `KneeReplacementSurgeryEvaluation` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end
// serde / examples convention; the section names mirror the 15 wizard steps
// in ../../index.md. This module is the plain-JS port of
// ../../front-end-with-svelte/src/lib/engine/types.ts and defaults.ts.
//
// Convention, per the monorepo: unanswered text and enum fields are `''`;
// unanswered numeric, date, and time fields are `null`; yes/no fields are the
// strings `'yes'` / `'no'` / `''` so they round-trip to the SQL CHECK
// constraints without a boolean-to-enum translation layer.

/** The 12 Oxford Knee Score fields, in publication order. */
const OKS_ITEM_KEYS = [
  'oksPainSeverity',
  'oksWashingAndDrying',
  'oksTransport',
  'oksWalkingDistance',
  'oksPainSittingOrLying',
  'oksLimping',
  'oksKneeling',
  'oksNightPainFrequency',
  'oksPainInterferingWithWork',
  'oksGivingWay',
  'oksShopping',
  'oksStairs'
];

/**
 * Build a fresh, fully-blank knee-replacement surgery evaluation.
 */
function emptyEvaluation() {
  return {
    status: 'draft',
    // Step 1 — clinician identification
    clinician: {
      clinicianName: '',
      role: '',
      registrationBody: '',
      registrationNumber: '',
      siteName: '',
      assessmentDate: '',
      assessmentTime: ''
    },
    // Step 2 — patient identification
    patient: {
      name: '',
      birthDate: '',
      sex: '',
      nhsNumber: '',
      email: '',
      phone: '',
      heightAsCm: null,
      weightAsKg: null,
      preferredLanguage: ''
    },
    // Step 3 — presenting history
    history: {
      kneeSide: '',
      symptomDurationMonths: null,
      painAtRest0To10: null,
      painOnActivity0To10: null,
      nightPain: '',
      priorKneeSurgery: '',
      priorKneeSurgeryType: '',
      priorKneeSurgeryDate: '',
      priorInjury: '',
      priorInjuryDetail: ''
    },
    // Step 4 — Oxford Knee Score (12 items, each 0 worst to 4 best)
    oks: {
      oksPainSeverity: null,
      oksWashingAndDrying: null,
      oksTransport: null,
      oksWalkingDistance: null,
      oksPainSittingOrLying: null,
      oksLimping: null,
      oksKneeling: null,
      oksNightPainFrequency: null,
      oksPainInterferingWithWork: null,
      oksGivingWay: null,
      oksShopping: null,
      oksStairs: null
    },
    // Step 5 — functional limitations
    functional: {
      walkingDistanceBeforePain: '',
      stairClimbingAbility: '',
      standFromChairUnaided: '',
      walkingAid: ''
    },
    // Step 6 — physical examination: range of motion
    rangeOfMotion: {
      flexionDegrees: null,
      extensionDeficitDegrees: null,
      fixedFlexionDeformityPresent: '',
      fixedFlexionDeformityDegrees: null
    },
    // Step 7 — physical examination: stability & alignment
    stability: {
      coronalDeformityType: '',
      coronalDeformitySeverity: '',
      ligamentAcl: '',
      ligamentPcl: '',
      ligamentMcl: '',
      ligamentLcl: '',
      patellarTracking: ''
    },
    // Step 8 — physical examination: muscle strength & effusion
    strength: {
      quadricepsStrengthMrc: null,
      effusionPresent: '',
      crepitusPresent: ''
    },
    // Step 9 — diagnostic imaging
    imaging: {
      weightBearingXrayPerformed: '',
      kellgrenLawrenceGradeMedial: null,
      kellgrenLawrenceGradeLateral: null,
      kellgrenLawrenceGradePatellofemoral: null,
      mriPerformed: '',
      mriFindings: '',
      ctPerformed: '',
      ctIndication: ''
    },
    // Step 10 — conservative treatment audit
    conservative: {
      physiotherapyTried: '',
      physiotherapyDurationWeeks: null,
      weightManagementAdviceGiven: '',
      injectionGiven: '',
      injectionType: '',
      injectionCount: null,
      injectionResponse: '',
      nsaidAnalgesicTrial: '',
      nsaidAnalgesicResponse: '',
      walkingAidTrial: '',
      conservativeMeasuresExhausted: ''
    },
    // Step 11 — general health & surgical fitness screen
    generalHealth: {
      diabetesControlled: '',
      cardiacDisease: '',
      bleedingDisorderOrAnticoagulant: '',
      smokingStatus: '',
      generalFitnessNote: ''
    },
    // Step 12 — pre-operative baseline bloods/tests (done / not done)
    preOpBloods: {
      fbcDone: '',
      renalFunctionDone: '',
      clottingDone: '',
      ecgDone: '',
      mrsaScreenDone: '',
      urinalysisDone: ''
    },
    // Step 13 — shared decision-making
    sharedDecision: {
      risksBenefitsDiscussed: '',
      realisticExpectationsDiscussed: '',
      patientDecisionAidGiven: '',
      interpreterRequired: ''
    },
    // Step 14 — management plan & recommendation
    plan: {
      planRecommendation: '',
      targetListDate: '',
      responsibleSurgeon: ''
    },
    // Step 15 — summary & sign-off
    summary: {
      overrideCandidacy: '',
      overrideReason: '',
      clinicianNotes: '',
      signedByName: ''
    }
  };
}

/** Human-readable labels for the clinician's step-14 plan recommendation. */
const PLAN_RECOMMENDATION_LABELS = {
  'total-knee-replacement': 'Total knee replacement',
  'partial-knee-replacement': 'Partial knee replacement',
  'continue-conservative-management': 'Continue conservative management',
  'mdt-review': 'Refer for multidisciplinary team review',
  'not-currently-a-candidate': 'Not currently a candidate',
  '': 'Not yet decided'
};

/** Look up a label, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export { emptyEvaluation, OKS_ITEM_KEYS, PLAN_RECOMMENDATION_LABELS, labelFor };
