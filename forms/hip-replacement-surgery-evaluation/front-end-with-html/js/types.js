// Plain-JavaScript / JSDoc type definitions for the Hip Replacement Surgery
// Evaluation form.
//
// Builds the canonical empty `HipReplacementSurgeryEvaluation` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end
// serde / examples convention; the section names mirror the 15 wizard steps
// in ../../index.md and the TypeScript engine's
// ../../front-end-with-svelte/src/lib/engine/types.ts.
//
// Convention, per the monorepo: unanswered text and enum fields are `''`;
// unanswered numeric, date, and time fields are `null`; yes/no fields are the
// strings `'yes'` / `'no'` / `''` so they round-trip to the SQL CHECK
// constraints without a boolean-to-enum translation layer.

/**
 * Build a fresh, fully-blank hip-replacement surgery evaluation.
 */
function emptyEvaluation() {
  return {
    status: 'draft',
    // Step 1 — clinician identification
    clinician: {
      clinicianName: '',
      role: '',
      gmcNumber: '',
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
      weightAsKg: null
    },
    // Step 3 — presenting history
    history: {
      affectedSide: '',
      symptomDurationMonths: null,
      painAtRest0To10: null,
      painOnActivity0To10: null,
      nightPain: '',
      priorHipSurgery: '',
      priorHipSurgeryDetail: '',
      priorInjuryOrDysplasiaHistory: '',
      priorInjuryOrDysplasiaDetail: ''
    },
    // Step 4 — Oxford Hip Score, 12 items, each 0 (worst) to 4 (best)
    ohs: {
      painSeverity: null,
      washingAndDrying: null,
      transport: null,
      dressingSocks: null,
      shopping: null,
      walkingPain: null,
      limping: null,
      kneeling: null,
      nightPain: null,
      workInterference: null,
      givingWay: null,
      stairs: null
    },
    // Step 5 — functional limitations
    function: {
      walkingDistanceBeforePain: '',
      shoesAndSocksDifficulty: '',
      walkingAidUse: ''
    },
    // Step 6 — physical examination: gait and biomechanical
    gait: {
      limpPresent: '',
      antalgicGait: '',
      trendelenburgSign: '',
      legLengthDiscrepancyAsCm: null
    },
    // Step 7 — physical examination: range of motion
    rangeOfMotion: {
      flexionDegrees: null,
      internalRotationDegrees: null,
      externalRotationDegrees: null,
      abductionDegrees: null,
      adductionDegrees: null,
      fixedFlexionDeformityPresent: ''
    },
    // Step 8 — physical examination: stability and muscle strength
    stability: {
      hipAbductorStrengthMrc: null,
      jointStability: '',
      tendernessSite: ''
    },
    // Step 9 — diagnostic imaging
    imaging: {
      weightBearingXrayPerformed: '',
      kellgrenLawrenceGrade: null,
      jointSpaceNarrowing: '',
      subchondralSclerosisOrCystsPresent: '',
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
      steroidInjectionGiven: '',
      steroidInjectionCount: null,
      steroidInjectionResponse: '',
      analgesicTrialGiven: '',
      analgesicTrialResponse: '',
      walkingAidTrial: '',
      conservativeMeasuresExhausted: ''
    },
    // Step 11 — general health and surgical fitness screen
    fitness: {
      diabetesControlled: '',
      cardiacDiseasePresent: '',
      bleedingDisorderOrAnticoagulantUse: '',
      smokingStatus: '',
      generalFitnessNote: ''
    },
    // Step 12 — pre-operative baseline bloods and tests
    baselineTests: {
      fullBloodCountDone: '',
      renalFunctionDone: '',
      clottingOrInrDone: '',
      ecgDone: '',
      mrsaScreenDone: '',
      urinalysisDone: ''
    },
    // Step 13 — shared decision-making
    decisionMaking: {
      risksAndBenefitsDiscussed: '',
      realisticExpectationsDiscussed: '',
      patientDecisionAidGiven: '',
      interpreterRequired: '',
      interpreterLanguage: ''
    },
    // Step 14 — management plan and recommendation
    plan: {
      recommendation: '',
      targetListDate: '',
      responsibleSurgeon: ''
    },
    // Step 15 — summary and sign-off
    summary: {
      overrideCandidacy: '',
      overrideReason: '',
      clinicianNotes: '',
      additionalNotes: '',
      signedByName: ''
    }
  };
}

/** Human-readable labels for the Oxford Hip Score category bands. */
const OHS_CATEGORY_LABELS = {
  severe: 'Severe (0–19)',
  moderate: 'Moderate (20–29)',
  'mild-to-moderate': 'Mild-to-moderate (30–39)',
  satisfactory: 'Satisfactory (40–48)'
};

/** Human-readable labels for the surgical-candidacy recommendation. */
const CANDIDACY_LABELS = {
  'strong-candidate': 'Strong candidate for surgery',
  candidate: 'Candidate for surgery',
  'continue-conservative': 'Continue conservative management',
  'not-indicated': 'Not currently indicated',
  'mdt-review': 'Multidisciplinary-team review'
};

/** Look up a label, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export {
  emptyEvaluation,
  labelFor,
  OHS_CATEGORY_LABELS,
  CANDIDACY_LABELS
};
