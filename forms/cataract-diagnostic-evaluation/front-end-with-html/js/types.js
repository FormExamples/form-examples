// Plain-JavaScript / JSDoc type definitions for the Cataract Diagnostic
// Evaluation form.
//
// Builds the canonical empty `CataractDiagnosticEvaluation` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end
// serde / examples convention; the section names mirror the 15 wizard steps
// in ../../index.md. This is the vanilla-JS mirror of
// ../../front-end-with-svelte/src/lib/engine/types.ts and defaults.ts — same
// field names, same shape.
//
// Convention, per the monorepo: unanswered text and enum fields are `''`;
// unanswered numeric, date, and time fields are `null`; yes/no fields are the
// strings `'yes'` / `'no'` / `''` so they round-trip to the SQL CHECK
// constraints without a boolean-to-enum translation layer. Bilateral findings
// use paired Right / Left properties, matching the SQL _right / _left
// column-suffix convention.

/**
 * Build a fresh, fully-blank cataract diagnostic evaluation.
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
      firstName: '',
      lastName: '',
      birthDate: '',
      sex: '',
      nhsNumber: '',
      email: '',
      phone: ''
    },
    // Step 3 — presenting complaint & visual symptoms
    symptoms: {
      blurredVision: '',
      glareOrHalos: '',
      nightDrivingDifficulty: '',
      fadedColourPerception: '',
      frequentPrescriptionChanges: '',
      symptomDurationMonths: null,
      symptomLaterality: '',
      presentingComplaintNotes: ''
    },
    // Step 4 — ocular & medical history
    history: {
      historyDiabetes: '',
      historyPriorEyeSurgery: '',
      historyPriorEyeSurgeryDetail: '',
      historyOcularTrauma: '',
      historyUveitis: '',
      historySteroidUse: '',
      historyFamilyCataract: '',
      historySmokingStatus: '',
      historyHighUvExposure: '',
      historyHighMyopia: '',
      medicalHistoryNotes: ''
    },
    // Step 5 — visual acuity, per eye
    acuity: {
      unaidedVaLogmarRight: null,
      unaidedVaLogmarLeft: null,
      unaidedVaSnellenRight: '',
      unaidedVaSnellenLeft: '',
      bestCorrectedVaLogmarRight: null,
      bestCorrectedVaLogmarLeft: null,
      bestCorrectedVaSnellenRight: '',
      bestCorrectedVaSnellenLeft: '',
      pinholeVaLogmarRight: null,
      pinholeVaLogmarLeft: null,
      pinholeVaSnellenRight: '',
      pinholeVaSnellenLeft: ''
    },
    // Step 6 — refraction
    refraction: {
      refractionSphereRight: null,
      refractionSphereLeft: null,
      refractionCylinderRight: null,
      refractionCylinderLeft: null,
      refractionAxisRight: null,
      refractionAxisLeft: null,
      refractionStability: ''
    },
    // Step 7 — slit-lamp examination, including LOCS III grading
    slitLamp: {
      locsIiiNoRight: null,
      locsIiiNoLeft: null,
      locsIiiNcRight: null,
      locsIiiNcLeft: null,
      locsIiiCRight: null,
      locsIiiCLeft: null,
      locsIiiPRight: null,
      locsIiiPLeft: null,
      cataractTypeRight: '',
      cataractTypeLeft: '',
      anteriorChamberDepthRight: '',
      anteriorChamberDepthLeft: '',
      cornealClarityRight: '',
      cornealClarityLeft: '',
      pupilReactionRight: '',
      pupilReactionLeft: ''
    },
    // Step 8 — glare testing
    glare: {
      glareAcuityResultRight: '',
      glareAcuityResultLeft: '',
      glareFunctionalImpact: ''
    },
    // Step 9 — tonometry
    tonometry: {
      intraocularPressureRightMmhg: null,
      intraocularPressureLeftMmhg: null,
      tonometryMethod: ''
    },
    // Step 10 — dilated fundus examination
    fundus: {
      dilatedFundusExamPerformed: '',
      opticDiscCupDiscRatioRight: null,
      opticDiscCupDiscRatioLeft: null,
      maculaFindingsRight: '',
      maculaFindingsLeft: '',
      retinalFindingsRight: '',
      retinalFindingsLeft: '',
      viewObscuredByCataractRight: '',
      viewObscuredByCataractLeft: ''
    },
    // Step 11 — differential / competing-pathology screen
    differential: {
      glaucomaSuspected: '',
      glaucomaNotes: '',
      amdSuspected: '',
      amdNotes: '',
      diabeticRetinopathySuspected: '',
      diabeticRetinopathyNotes: ''
    },
    // Step 12 — biometry (surgical planning)
    biometry: {
      biometryPerformed: '',
      axialLengthRightMm: null,
      axialLengthLeftMm: null,
      keratometryK1Right: null,
      keratometryK1Left: null,
      keratometryK2Right: null,
      keratometryK2Left: null,
      octPerformed: '',
      octFindings: '',
      calculatedIolPowerRight: null,
      calculatedIolPowerLeft: null
    },
    // Step 13 — functional & quality-of-life impact
    functional: {
      functionalDifficultyReading: null,
      functionalDifficultyDriving: null,
      functionalDifficultyDailyActivities: null,
      functionalImpactNotes: ''
    },
    // Step 14 — management plan
    management: {
      managementRecommendation: '',
      eyeForSurgery: '',
      risksBenefitsCounselled: '',
      consentDiscussed: '',
      managementNotes: ''
    },
    // Step 15 — summary, override, and sign-off
    summary: {
      overrideSurgicalCandidacy: '',
      overrideReason: '',
      clinicianNotes: '',
      signedByName: ''
    }
  };
}

/** Human-readable labels for the LOCS III severity bands. */
const LOCS_III_SEVERITY_LABELS = {
  '': 'Not graded',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe'
};

/** Human-readable labels for the surgical-candidacy recommendation. */
const SURGICAL_CANDIDACY_LABELS = {
  '': 'Not computed',
  'not-indicated': 'Surgery not indicated',
  consider: 'Consider surgical referral',
  indicated: 'Surgery indicated',
  'urgent-referral': 'Urgent referral'
};

/** Look up a label, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export {
  emptyEvaluation,
  labelFor,
  LOCS_III_SEVERITY_LABELS,
  SURGICAL_CANDIDACY_LABELS
};
