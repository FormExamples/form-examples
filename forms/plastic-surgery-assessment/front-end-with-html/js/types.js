// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Plastic Surgery Assessment
// form. Builds and exports the canonical empty AssessmentData shape used
// by the wizard, so newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'current' | 'ex-smoker' | 'never' | ''} SmokingStatus
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 */

/**
 * @typedef {Object} ReasonForReferral
 * @property {string} referralType
 * @property {string} referralTypeOther
 * @property {string} urgency
 * @property {string} primaryComplaint
 * @property {string} affectedBodyArea
 * @property {string} affectedBodyAreaOther
 * @property {string} laterality
 * @property {string} durationOfCondition
 * @property {YesNo} previousConsultations
 * @property {string} previousConsultationsDetails
 */

/**
 * @typedef {Object} MedicalSurgicalHistory
 * @property {YesNo} previousPlasticSurgery
 * @property {string} previousPlasticSurgeryDetails
 * @property {YesNo} previousGeneralSurgery
 * @property {string} previousGeneralSurgeryDetails
 * @property {YesNo} woundHealingProblems
 * @property {string} woundHealingDetails
 * @property {YesNo} keloidScarring
 * @property {string} scarringDetails
 * @property {'type-1' | 'type-2' | 'no' | ''} diabetes
 * @property {YesNo} diabetesControlled
 * @property {YesNo} hypertension
 * @property {YesNo} cardiacDisease
 * @property {string} cardiacDiseaseDetails
 * @property {YesNo} respiratoryDisease
 * @property {string} respiratoryDiseaseDetails
 * @property {YesNo} autoimmuneDisease
 * @property {string} autoimmuneDiseaseDetails
 * @property {YesNo} bleedingDisorder
 * @property {string} bleedingDisorderDetails
 * @property {YesNo} immunosuppressed
 * @property {string} immunosuppressedDetails
 * @property {YesNo} cancerHistory
 * @property {string} cancerHistoryDetails
 */

/**
 * @typedef {Object} CurrentCondition
 * @property {string} conditionCategory
 * @property {string} conditionDescription
 * @property {number | null} lesionLengthMm
 * @property {number | null} lesionWidthMm
 * @property {number | null} lesionDepthMm
 * @property {YesNo} tissueLoss
 * @property {number | null} tissueLossPercentage
 * @property {string} functionalImpairment
 * @property {string} functionalImpairmentDetails
 * @property {number | null} painLevel
 * @property {string} cosmeticConcern
 * @property {string} impactOnDailyActivities
 */

/**
 * @typedef {Object} WoundTissueAssessment
 * @property {YesNo} hasOpenWound
 * @property {string} woundClassification
 * @property {string} woundAge
 * @property {string} woundAetiology
 * @property {string} woundBedTissue
 * @property {string} woundExudate
 * @property {YesNo} woundInfectionSigns
 * @property {string} woundInfectionDetails
 * @property {string} tissueViability
 * @property {string} surroundingSkin
 * @property {string} vascularSupply
 * @property {string} sensoryStatus
 * @property {string} previousWoundTreatments
 */

/**
 * @typedef {Object} PsychologicalAssessment
 * @property {YesNo} bodyDysmorphicConcern
 * @property {string} bodyDysmorphicDetails
 * @property {'yes' | 'partly' | 'no' | ''} realisticExpectations
 * @property {string} expectationsDetails
 * @property {string} motivation
 * @property {string} motivationOther
 * @property {YesNo} previousMentalHealth
 * @property {string} mentalHealthDetails
 * @property {string} anxietyLevel
 * @property {YesNo} depressionScreen
 * @property {string} socialImpact
 * @property {string} socialImpactDetails
 * @property {YesNo} psychologicalReferralNeeded
 */

/**
 * @typedef {Object} AnaestheticRisk
 * @property {'1' | '2' | '3' | '4' | '5' | ''} asaClass
 * @property {YesNo} previousAnaesthetic
 * @property {YesNo} anaestheticComplications
 * @property {string} anaestheticComplicationsDetails
 * @property {YesNo} difficultAirway
 * @property {string} difficultAirwayDetails
 * @property {YesNo} malignantHyperthermiaRisk
 * @property {YesNo} familyAnaestheticProblems
 * @property {string} familyAnaestheticDetails
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} packYears
 * @property {string} alcoholConsumption
 * @property {YesNo} recreationalDrugs
 * @property {string} recreationalDrugsDetails
 * @property {YesNo} obstructiveSleepApnoea
 * @property {string} anaestheticPreference
 */

/**
 * @typedef {Object} PhotographyDocumentation
 * @property {YesNo} clinicalPhotosTaken
 * @property {YesNo} photoConsentObtained
 * @property {number | null} numberOfPhotos
 * @property {string} photoViewsTaken
 * @property {YesNo} standardisedViews
 * @property {YesNo} measurementsRecorded
 * @property {string} measurementDetails
 * @property {YesNo} diagramsDrawn
 * @property {string} diagramNotes
 * @property {YesNo} previousImaging
 * @property {string} previousImagingType
 * @property {string} previousImagingFindings
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} MedicationsAllergies
 * @property {YesNo} onAnticoagulants
 * @property {string} anticoagulantDetails
 * @property {YesNo} onAntiplatelets
 * @property {string} antiplateletDetails
 * @property {YesNo} onSteroids
 * @property {string} steroidDetails
 * @property {YesNo} onImmunosuppressants
 * @property {string} immunosuppressantDetails
 * @property {YesNo} onChemotherapy
 * @property {string} chemotherapyDetails
 * @property {YesNo} onHormoneTherapy
 * @property {string} hormoneTherapyDetails
 * @property {string} otherMedications
 * @property {YesNo} hasDrugAllergies
 * @property {Allergy[]} allergies
 * @property {YesNo} latexAllergy
 * @property {YesNo} adhesiveAllergy
 * @property {string} otherAllergies
 */

/**
 * @typedef {Object} ProcedurePlanningConsent
 * @property {string} proposedProcedure
 * @property {'1' | '2' | '3' | '4' | ''} procedureComplexity
 * @property {string} surgicalApproach
 * @property {number | null} expectedDurationMinutes
 * @property {string} expectedHospitalStay
 * @property {string} flapType
 * @property {YesNo} implantRequired
 * @property {string} implantDetails
 * @property {string} vteRisk
 * @property {YesNo} antibioticProphylaxis
 * @property {string} anticipatedRisks
 * @property {string} alternativeTreatments
 * @property {YesNo} consentDiscussion
 * @property {YesNo} consentFormSigned
 * @property {'yes' | 'no' | 'n-a' | ''} coolingOffPeriodOffered
 * @property {string} followUpPlan
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReasonForReferral} reasonForReferral
 * @property {MedicalSurgicalHistory} medicalSurgicalHistory
 * @property {CurrentCondition} currentCondition
 * @property {WoundTissueAssessment} woundTissueAssessment
 * @property {PsychologicalAssessment} psychologicalAssessment
 * @property {AnaestheticRisk} anaestheticRisk
 * @property {PhotographyDocumentation} photographyDocumentation
 * @property {MedicationsAllergies} medicationsAllergies
 * @property {ProcedurePlanningConsent} procedurePlanningConsent
 */

/**
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 *
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {number | null} asaClass
 * @property {number | null} woundClass
 * @property {number | null} complexityScore
 * @property {RiskLevel} overallRisk
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
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
    reasonForReferral: {
      referralType: '',
      referralTypeOther: '',
      urgency: '',
      primaryComplaint: '',
      affectedBodyArea: '',
      affectedBodyAreaOther: '',
      laterality: '',
      durationOfCondition: '',
      previousConsultations: '',
      previousConsultationsDetails: ''
    },
    medicalSurgicalHistory: {
      previousPlasticSurgery: '',
      previousPlasticSurgeryDetails: '',
      previousGeneralSurgery: '',
      previousGeneralSurgeryDetails: '',
      woundHealingProblems: '',
      woundHealingDetails: '',
      keloidScarring: '',
      scarringDetails: '',
      diabetes: '',
      diabetesControlled: '',
      hypertension: '',
      cardiacDisease: '',
      cardiacDiseaseDetails: '',
      respiratoryDisease: '',
      respiratoryDiseaseDetails: '',
      autoimmuneDisease: '',
      autoimmuneDiseaseDetails: '',
      bleedingDisorder: '',
      bleedingDisorderDetails: '',
      immunosuppressed: '',
      immunosuppressedDetails: '',
      cancerHistory: '',
      cancerHistoryDetails: ''
    },
    currentCondition: {
      conditionCategory: '',
      conditionDescription: '',
      lesionLengthMm: null,
      lesionWidthMm: null,
      lesionDepthMm: null,
      tissueLoss: '',
      tissueLossPercentage: null,
      functionalImpairment: '',
      functionalImpairmentDetails: '',
      painLevel: null,
      cosmeticConcern: '',
      impactOnDailyActivities: ''
    },
    woundTissueAssessment: {
      hasOpenWound: '',
      woundClassification: '',
      woundAge: '',
      woundAetiology: '',
      woundBedTissue: '',
      woundExudate: '',
      woundInfectionSigns: '',
      woundInfectionDetails: '',
      tissueViability: '',
      surroundingSkin: '',
      vascularSupply: '',
      sensoryStatus: '',
      previousWoundTreatments: ''
    },
    psychologicalAssessment: {
      bodyDysmorphicConcern: '',
      bodyDysmorphicDetails: '',
      realisticExpectations: '',
      expectationsDetails: '',
      motivation: '',
      motivationOther: '',
      previousMentalHealth: '',
      mentalHealthDetails: '',
      anxietyLevel: '',
      depressionScreen: '',
      socialImpact: '',
      socialImpactDetails: '',
      psychologicalReferralNeeded: ''
    },
    anaestheticRisk: {
      asaClass: '',
      previousAnaesthetic: '',
      anaestheticComplications: '',
      anaestheticComplicationsDetails: '',
      difficultAirway: '',
      difficultAirwayDetails: '',
      malignantHyperthermiaRisk: '',
      familyAnaestheticProblems: '',
      familyAnaestheticDetails: '',
      smokingStatus: '',
      packYears: null,
      alcoholConsumption: '',
      recreationalDrugs: '',
      recreationalDrugsDetails: '',
      obstructiveSleepApnoea: '',
      anaestheticPreference: ''
    },
    photographyDocumentation: {
      clinicalPhotosTaken: '',
      photoConsentObtained: '',
      numberOfPhotos: null,
      photoViewsTaken: '',
      standardisedViews: '',
      measurementsRecorded: '',
      measurementDetails: '',
      diagramsDrawn: '',
      diagramNotes: '',
      previousImaging: '',
      previousImagingType: '',
      previousImagingFindings: ''
    },
    medicationsAllergies: {
      onAnticoagulants: '',
      anticoagulantDetails: '',
      onAntiplatelets: '',
      antiplateletDetails: '',
      onSteroids: '',
      steroidDetails: '',
      onImmunosuppressants: '',
      immunosuppressantDetails: '',
      onChemotherapy: '',
      chemotherapyDetails: '',
      onHormoneTherapy: '',
      hormoneTherapyDetails: '',
      otherMedications: '',
      hasDrugAllergies: '',
      allergies: [],
      latexAllergy: '',
      adhesiveAllergy: '',
      otherAllergies: ''
    },
    procedurePlanningConsent: {
      proposedProcedure: '',
      procedureComplexity: '',
      surgicalApproach: '',
      expectedDurationMinutes: null,
      expectedHospitalStay: '',
      flapType: '',
      implantRequired: '',
      implantDetails: '',
      vteRisk: '',
      antibioticProphylaxis: '',
      anticipatedRisks: '',
      alternativeTreatments: '',
      consentDiscussion: '',
      consentFormSigned: '',
      coolingOffPeriodOffered: '',
      followUpPlan: ''
    }
  };
}

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Calculate age (years) from a YYYY-MM-DD date-of-birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** ASA Physical Status Classification label. */
function asaClassLabel(asaClass) {
  switch (asaClass) {
    case 1: return 'ASA I - Normal healthy patient';
    case 2: return 'ASA II - Mild systemic disease';
    case 3: return 'ASA III - Severe systemic disease';
    case 4: return 'ASA IV - Severe systemic disease, constant threat to life';
    case 5: return 'ASA V - Moribund patient';
    default: return 'Not classified';
  }
}

/** Wound Classification label. */
function woundClassLabel(woundClass) {
  switch (woundClass) {
    case 1: return 'Class I - Clean';
    case 2: return 'Class II - Clean-Contaminated';
    case 3: return 'Class III - Contaminated';
    case 4: return 'Class IV - Dirty/Infected';
    default: return 'Not classified';
  }
}

/** Surgical Complexity Score label. */
function complexityLabel(score) {
  switch (score) {
    case 1: return 'Complexity 1 - Minor';
    case 2: return 'Complexity 2 - Intermediate';
    case 3: return 'Complexity 3 - Major';
    case 4: return 'Complexity 4 - Major Plus / Emergency';
    default: return 'Not classified';
  }
}

/** Overall risk level label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** Risk-level CSS class hint. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, asaClassLabel, woundClassLabel, complexityLabel, riskLevelLabel, riskLevelClass };
