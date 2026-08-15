// Plain-JavaScript / JSDoc type definitions for the Health Screening
// Questionnaire form.
//
// Builds the canonical empty `HealthScreeningQuestionnaire` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end
// serde / examples convention; the section names mirror the 14 wizard steps
// in ../../index.md. Rule and flag IDs match the SvelteKit engine under
// front-end-with-svelte/src/lib/engine/.
//
// Convention, per the monorepo: unanswered text and enum fields are `''`;
// unanswered numeric, date, and time fields are `null`; yes/no fields are the
// strings `'yes'` / `'no'` / `''` so they round-trip to the SQL CHECK
// constraints without a boolean-to-enum translation layer.

/**
 * Build a fresh, fully-blank health screening questionnaire.
 */
function emptyQuestionnaire() {
  return {
    status: 'draft',
    // Step 1 — assessment context
    context: {
      screeningPurpose: '',
      siteName: '',
      assessmentDate: '',
      assessmentMode: ''
    },
    assessor: {
      name: '',
      email: '',
      phone: '',
      role: '',
      registrationBody: '',
      registrationNumber: '',
      employer: ''
    },
    // Step 2 — personal details
    patient: {
      name: '',
      birthDate: '',
      sex: '',
      identifierType: '',
      identifierValue: '',
      email: '',
      phone: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: ''
    },
    // Step 3 — lifestyle: activity and diet
    activityDiet: {
      usualActivityLevel: '',
      moderateExerciseDaysPerWeek: null,
      fruitAndVegetablePortionsPerDay: null,
      dietNotes: ''
    },
    // Step 4 — lifestyle: smoking and alcohol (AUDIT-C)
    smokingAlcohol: {
      smokingStatus: '',
      cigarettesPerDay: null,
      auditCFrequency: null,
      auditCTypicalQuantity: null,
      auditCBingeFrequency: null
    },
    // Step 5 — medical history
    medicalHistory: {
      conditionDiabetes: '',
      conditionHypertension: '',
      conditionAsthma: '',
      conditionCopd: '',
      conditionHeartDisease: '',
      conditionKidneyDisease: '',
      conditionThyroid: '',
      conditionOther: '',
      pastSurgeries: '',
      currentMedications: '',
      knownDrugAllergies: ''
    },
    // Step 6 — family history
    familyHistory: {
      familyHistoryPrematureCardiacEvent: '',
      familyHistoryOther: ''
    },
    // Step 7 — symptom review
    symptoms: {
      symptomUnexplainedChestPain: '',
      symptomDizzySpellsOrFainting: '',
      symptomPersistentCoughOver3Weeks: '',
      symptomUnexplainedWeightLoss: '',
      symptomJointPainRestrictingMovement: '',
      symptomShortnessOfBreathOnExertion: '',
      symptomPalpitations: ''
    },
    // Step 8 — PAR-Q+ general health screen
    parq: {
      parqDiagnosedHeartCondition: '',
      parqChestPainAtRest: '',
      parqChestPainDuringActivity: '',
      parqDizzinessOrLossOfConsciousness: '',
      parqOtherChronicMedicalCondition: '',
      parqPrescribedMedicationForChronicCondition: '',
      parqBoneOrJointProblem: ''
    },
    // Step 9 — vital signs / basic measurements
    vitals: {
      heightAsCm: null,
      weightAsKg: null,
      restingBloodPressureSystolic: null,
      restingBloodPressureDiastolic: null,
      restingHeartRate: null
    },
    // Step 10 — occupational / role-specific factors (conditional)
    occupational: {
      jobRole: '',
      physicalDemandsOfRole: '',
      exposureNoise: '',
      exposureChemicals: '',
      exposureManualHandling: '',
      exposureOther: '',
      exposureOtherDetail: ''
    },
    // Step 11 — mental health and wellbeing check
    wellbeing: {
      stressLevel: null,
      sleepQuality: null,
      mentalHealthConcern: '',
      mentalHealthConcernNote: ''
    },
    // Step 12 — vaccination status
    vaccination: {
      vaccinationUpToDate: '',
      vaccinationGapsNote: ''
    },
    // Step 13 — consent and data
    consent: {
      consentToScreening: '',
      informationAccurateConfirmed: '',
      interpreterRequired: ''
    },
    // Step 14 — summary and recommendation
    summary: {
      overrideRiskBand: '',
      overrideReason: '',
      notes: '',
      signedByName: ''
    }
  };
}

/** Human-readable labels for the composite risk bands. */
const RISK_BAND_LABELS = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'refer-urgently': 'Refer urgently'
};

/** Human-readable labels for the PAR-Q+ clearance status. */
const PARQ_CLEARANCE_LABELS = {
  'cleared': 'Cleared for general physical activity',
  'further-assessment-required': 'Further assessment required'
};

/** Human-readable labels for the AUDIT-C band. */
const AUDIT_C_BAND_LABELS = {
  'low': 'Low',
  'increasing-risk': 'Increasing risk',
  'higher-risk': 'Higher risk'
};

/** Human-readable labels for the referral recommendation. */
const RECOMMENDATION_LABELS = {
  'clear-to-proceed': 'Clear to proceed',
  'routine-review': 'Routine review',
  'gp-review-required': 'GP review required',
  'refer-urgently': 'Refer urgently — same-day medical attention',
  'paediatric-pathway': 'Redirect to paediatric pathway'
};

/** Look up a label, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export {
  emptyQuestionnaire,
  labelFor,
  RISK_BAND_LABELS,
  PARQ_CLEARANCE_LABELS,
  AUDIT_C_BAND_LABELS,
  RECOMMENDATION_LABELS
};
