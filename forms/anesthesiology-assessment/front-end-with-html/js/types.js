// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// engine data model for the Anesthesiology Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'minor' | 'intermediate' | 'major' | 'complex' | ''} SurgeryGrade
 * @typedef {'general' | 'regional' | 'sedation' | 'local' | 'combined' | ''} AnaesthesiaType
 * @typedef {'oral' | 'iv' | 'sc' | 'im' | 'inhaled' | 'topical' | 'other' | ''} MedicationRoute
 * @typedef {'drug' | 'latex' | 'food' | 'environmental' | ''} AllergyType
 * @typedef {'mild' | 'moderate' | 'severe' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'general' | 'regional' | 'sedation' | 'local' | 'unknown' | ''} PrevAnaesthesiaType
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'gt-4-mets' | 'le-4-mets' | 'unknown' | ''} ExerciseTolerance
 * @typedef {'not-pregnant' | 'pregnant' | 'not-applicable' | ''} PregnancyStatus
 * @typedef {'i' | 'ii' | 'iii' | 'iv' | ''} MallampatiClass
 * @typedef {'full' | 'limited' | 'fixed' | ''} NeckMobility
 * @typedef {'normal' | 'limited' | ''} JawProtrusion
 * @typedef {'normal' | 'murmur' | 'irregular' | 'added-sounds' | ''} HeartSounds
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} PeripheralEdema
 * @typedef {'normal' | 'raised' | ''} JVP
 * @typedef {'normal' | 'wheeze' | 'crackles' | 'reduced' | ''} BreathSounds
 * @typedef {'not-required' | 'ordered' | 'normal' | 'abnormal' | ''} InvestigationStatus
 * @typedef {'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | ''} AsaClass
 * @typedef {'facemask' | 'lma' | 'ett' | 'awake-fibreoptic' | 'other' | ''} AirwayPlan
 * @typedef {'ward' | 'hdu' | 'icu' | ''} PostOpDestination
 * @typedef {'low' | 'medium' | 'high' | 'critical'} RiskLevel
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AnesthesiologyAssessment`.
(function () {
'use strict';
window.AnesthesiologyAssessment = window.AnesthesiologyAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      nhsNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      phone: '',
      email: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      gpName: '',
      gpPractice: '',
      gpPhone: ''
    },
    plannedSurgery: {
      procedureName: '',
      surgeonName: '',
      surgeryDate: '',
      surgeryGrade: '',
      proposedAnaesthesia: ''
    },
    medicalHistory: {
      // Cardiovascular
      hypertension: '',
      ischaemicHeartDisease: '',
      heartFailure: '',
      valvularDisease: '',
      arrhythmia: '',
      peripheralVascularDisease: '',
      dvtPe: '',
      // Respiratory
      asthma: '',
      copd: '',
      sleepApnea: '',
      recentUrti: '',
      // Neurological
      epilepsy: '',
      strokeTia: '',
      neuromuscularDisease: '',
      // Endocrine
      diabetesType1: '',
      diabetesType2: '',
      thyroidDisease: '',
      adrenalInsufficiency: '',
      // Renal
      chronicKidneyDisease: '',
      dialysis: '',
      // Hepatic
      liverDisease: '',
      jaundice: '',
      cirrhosis: '',
      // Haematologic
      anaemia: '',
      bleedingDisorder: '',
      clottingDisorder: '',
      // Gastrointestinal
      gord: '',
      pepticUlcer: '',
      // Musculoskeletal
      rheumatoidArthritis: '',
      limitedMobility: '',
      // Psychiatric
      anxiety: '',
      depression: '',
      otherPsychiatric: '',
      otherDetails: ''
    },
    medications: {
      list: [],
      onAnticoagulants: '',
      onAntiplatelets: '',
      onInsulin: '',
      onSteroids: '',
      onMaois: ''
    },
    allergies: {
      list: [],
      latexAllergy: ''
    },
    previousAnaesthesia: {
      operations: [],
      difficultIntubation: false,
      ponv: false,
      awareness: false,
      slowRecovery: false,
      allergicReaction: false,
      otherComplication: false,
      otherComplicationDetails: '',
      malignantHyperthermia: '',
      familyAnaestheticComplications: '',
      familyAnaestheticDetails: ''
    },
    socialHistory: {
      smoking: '',
      packYears: null,
      alcoholUnitsPerWeek: null,
      recreationalDrugUse: '',
      recreationalDrugDetails: '',
      canClimbTwoFlights: '',
      exerciseTolerance: '',
      occupation: '',
      pregnancyStatus: '',
      // STOP-BANG subjective
      snoresLoudly: '',
      tiredDuringDay: '',
      observedApnea: ''
    },
    vitalSigns: {
      systolicBp: null,
      diastolicBp: null,
      heartRate: null,
      respiratoryRate: null,
      spo2: null,
      temperature: null,
      height: null,
      weight: null,
      bmi: null,
      neckCircumference: null
    },
    physicalExam: {
      mallampatiClass: '',
      mouthOpening: null,
      thyromentalDistance: null,
      neckMobility: '',
      dentitionIntact: false,
      dentitionDentures: false,
      dentitionLooseTeeth: false,
      dentitionCrowns: false,
      dentitionProminentIncisors: false,
      jawProtrusion: '',
      heartSounds: '',
      peripheralEdema: '',
      jvp: '',
      breathSounds: '',
      accessoryMuscleUse: ''
    },
    investigationsAndPlan: {
      fbcStatus: '',
      fbcNotes: '',
      ueStatus: '',
      ueNotes: '',
      lftsStatus: '',
      lftsNotes: '',
      coagStatus: '',
      coagNotes: '',
      hba1cStatus: '',
      hba1cNotes: '',
      ecgStatus: '',
      ecgNotes: '',
      cxrStatus: '',
      cxrNotes: '',
      echoStatus: '',
      echoNotes: '',
      otherInvestigation: '',
      otherInvestigationStatus: '',
      // RCRI clinician confirmations (criteria 2,3,4,6)
      rcriIschaemicHeartDisease: '',
      rcriCongestiveHeartFailure: '',
      rcriCerebrovascularDisease: '',
      rcriHighCreatinine: '',
      // ASA classification
      asaClass: '',
      emergencyCase: '',
      // Anaesthetic plan
      proposedTechnique: '',
      airwayPlan: '',
      postOpDestination: '',
      specialRequirements: ''
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

/** Compute age from a YYYY-MM-DD date-of-birth string. Returns null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

/** Friendly label for an overall perioperative risk level. */
function riskLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** CSS class hint for a risk level badge. */
function riskLevelClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Compare two risk levels; returns the worse one. */
function worstRisk(a, b) {
  const order = { low: 0, medium: 1, high: 2, critical: 3 };
  return order[a] >= order[b] ? a : b;
}

Object.assign(window.AnesthesiologyAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateAge,
  riskLevelLabel,
  riskLevelClass,
  worstRisk
});
})();
