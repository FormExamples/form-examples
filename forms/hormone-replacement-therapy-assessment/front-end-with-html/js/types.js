// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Hormone Replacement Therapy
// (HRT) assessment.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'pre' | 'peri' | 'post' | ''} MenopauseStatus
 * @typedef {0 | 1 | 2 | 3 | 4 | null} MRSItemScore
 * @typedef {'oral' | 'transdermal' | 'vaginal' | ''} HRTRoute
 * @typedef {'Favourable' | 'Acceptable' | 'Cautious' | 'Contraindicated'} HRTRiskClassification
 * @typedef {'No/Minimal' | 'Mild' | 'Moderate' | 'Severe'} MRSSeverity
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
 * @typedef {Object} MenopauseStatusData
 * @property {MenopauseStatus} menopausalStatus
 * @property {string} lastMenstrualPeriod
 * @property {number | null} ageAtMenopause
 * @property {YesNo} surgicalMenopause
 * @property {string} surgicalMenopauseDetails
 * @property {YesNo} prematureOvarianInsufficiency
 */

/**
 * @typedef {Object} MRSSymptomScale
 * @property {MRSItemScore} hotFlushes
 * @property {MRSItemScore} heartDiscomfort
 * @property {MRSItemScore} sleepProblems
 * @property {MRSItemScore} jointPain
 * @property {MRSItemScore} depressiveMood
 * @property {MRSItemScore} irritability
 * @property {MRSItemScore} anxiety
 * @property {MRSItemScore} fatigue
 * @property {MRSItemScore} sexualProblems
 * @property {MRSItemScore} bladderProblems
 * @property {MRSItemScore} vaginalDryness
 */

/**
 * @typedef {Object} VasomotorSymptoms
 * @property {'none' | 'occasional' | 'frequent' | 'very-frequent' | ''} hotFlushFrequency
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} hotFlushSeverity
 * @property {YesNo} nightSweats
 * @property {'occasional' | 'most-nights' | 'every-night' | ''} nightSweatsFrequency
 * @property {string} triggers
 */

/**
 * @typedef {Object} BoneHealth
 * @property {YesNo} dexaScan
 * @property {'normal' | 'osteopenia' | 'osteoporosis' | ''} dexaResult
 * @property {string} dexaDate
 * @property {YesNo} fractureHistory
 * @property {string} fractureDetails
 * @property {YesNo} heightLoss
 * @property {number | null} heightLossCm
 * @property {string} riskFactors
 * @property {'adequate' | 'inadequate' | 'supplemented' | ''} calciumIntake
 * @property {'adequate' | 'inadequate' | 'supplemented' | ''} vitaminDIntake
 */

/**
 * @typedef {Object} CardiovascularRisk
 * @property {number | null} systolicBP
 * @property {number | null} diastolicBP
 * @property {number | null} totalCholesterol
 * @property {number | null} hdlCholesterol
 * @property {number | null} ldlCholesterol
 * @property {number | null} triglycerides
 * @property {YesNo} familyHistoryCVD
 * @property {YesNo} diabetes
 * @property {'type1' | 'type2' | ''} diabetesType
 * @property {'current' | 'ex' | 'never' | ''} smoking
 * @property {number | null} qriskScore
 */

/**
 * @typedef {Object} BreastHealth
 * @property {string} lastMammogram
 * @property {'normal' | 'abnormal' | 'not-done' | ''} mammogramResult
 * @property {YesNo} breastExamNormal
 * @property {YesNo} familyHistoryBreastCancer
 * @property {YesNo} familyHistoryOvarianCancer
 * @property {'positive' | 'negative' | 'not-tested' | ''} brcaStatus
 * @property {'BRCA1' | 'BRCA2' | ''} brcaType
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} currentHRT
 * @property {string} currentHRTDetails
 * @property {string} currentHRTDuration
 * @property {YesNo} previousHRT
 * @property {string} previousHRTDetails
 * @property {string} previousHRTReason
 * @property {Medication[]} otherMedications
 * @property {string} supplements
 */

/**
 * @typedef {Object} ContraindicationsScreen
 * @property {YesNo} vteHistory
 * @property {string} vteDetails
 * @property {YesNo} breastCancerHistory
 * @property {string} breastCancerDetails
 * @property {YesNo} liverDisease
 * @property {string} liverDiseaseDetails
 * @property {YesNo} undiagnosedVaginalBleeding
 * @property {YesNo} pregnancy
 * @property {YesNo} activeCardiovascularDisease
 * @property {string} activeCardiovascularDetails
 */

/**
 * @typedef {Object} TreatmentPreferences
 * @property {HRTRoute} routePreference
 * @property {string} routePreferenceReason
 * @property {string} concernsAboutHRT
 * @property {string} lifestyleFactors
 * @property {string} treatmentGoals
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {MenopauseStatusData} menopauseStatus
 * @property {MRSSymptomScale} mrsSymptomScale
 * @property {VasomotorSymptoms} vasomotorSymptoms
 * @property {BoneHealth} boneHealth
 * @property {CardiovascularRisk} cardiovascularRisk
 * @property {BreastHealth} breastHealth
 * @property {CurrentMedications} currentMedications
 * @property {ContraindicationsScreen} contraindicationsScreen
 * @property {TreatmentPreferences} treatmentPreferences
 */

/**
 * @typedef {Object} MRSSubscaleResult
 * @property {number} somatic
 * @property {number} psychological
 * @property {number} urogenital
 */

/**
 * @typedef {Object} MRSResult
 * @property {number} totalScore
 * @property {MRSSeverity} severity
 * @property {MRSSubscaleResult} subscales
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {MRSResult} mrsResult
 * @property {HRTRiskClassification} riskClassification
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HormoneReplacementTherapyAssessment`.

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
    menopauseStatus: {
      menopausalStatus: '',
      lastMenstrualPeriod: '',
      ageAtMenopause: null,
      surgicalMenopause: '',
      surgicalMenopauseDetails: '',
      prematureOvarianInsufficiency: ''
    },
    mrsSymptomScale: {
      hotFlushes: null,
      heartDiscomfort: null,
      sleepProblems: null,
      jointPain: null,
      depressiveMood: null,
      irritability: null,
      anxiety: null,
      fatigue: null,
      sexualProblems: null,
      bladderProblems: null,
      vaginalDryness: null
    },
    vasomotorSymptoms: {
      hotFlushFrequency: '',
      hotFlushSeverity: '',
      nightSweats: '',
      nightSweatsFrequency: '',
      triggers: ''
    },
    boneHealth: {
      dexaScan: '',
      dexaResult: '',
      dexaDate: '',
      fractureHistory: '',
      fractureDetails: '',
      heightLoss: '',
      heightLossCm: null,
      riskFactors: '',
      calciumIntake: '',
      vitaminDIntake: ''
    },
    cardiovascularRisk: {
      systolicBP: null,
      diastolicBP: null,
      totalCholesterol: null,
      hdlCholesterol: null,
      ldlCholesterol: null,
      triglycerides: null,
      familyHistoryCVD: '',
      diabetes: '',
      diabetesType: '',
      smoking: '',
      qriskScore: null
    },
    breastHealth: {
      lastMammogram: '',
      mammogramResult: '',
      breastExamNormal: '',
      familyHistoryBreastCancer: '',
      familyHistoryOvarianCancer: '',
      brcaStatus: '',
      brcaType: ''
    },
    currentMedications: {
      currentHRT: '',
      currentHRTDetails: '',
      currentHRTDuration: '',
      previousHRT: '',
      previousHRTDetails: '',
      previousHRTReason: '',
      otherMedications: [],
      supplements: ''
    },
    contraindicationsScreen: {
      vteHistory: '',
      vteDetails: '',
      breastCancerHistory: '',
      breastCancerDetails: '',
      liverDisease: '',
      liverDiseaseDetails: '',
      undiagnosedVaginalBleeding: '',
      pregnancy: '',
      activeCardiovascularDisease: '',
      activeCardiovascularDetails: ''
    },
    treatmentPreferences: {
      routePreference: '',
      routePreferenceReason: '',
      concernsAboutHRT: '',
      lifestyleFactors: '',
      treatmentGoals: ''
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

/** Calculate age from a date-of-birth string (YYYY-MM-DD). Returns null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** MRS severity label with score range. */
function mrsSeverityLabel(severity) {
  switch (severity) {
    case 'No/Minimal': return 'No / Minimal Symptoms (0-4)';
    case 'Mild':       return 'Mild Symptoms (5-8)';
    case 'Moderate':   return 'Moderate Symptoms (9-15)';
    case 'Severe':     return 'Severe Symptoms (16-44)';
    default:           return severity || '';
  }
}

/** CSS class hint for the MRS severity badge. */
function mrsSeverityClass(severity) {
  switch (severity) {
    case 'No/Minimal': return 'severity-no-minimal';
    case 'Mild':       return 'severity-mild';
    case 'Moderate':   return 'severity-moderate';
    case 'Severe':     return 'severity-severe';
    default:           return '';
  }
}

/** HRT risk classification label. */
function riskClassificationLabel(classification) {
  switch (classification) {
    case 'Favourable':      return 'Favourable - Benefits likely outweigh risks';
    case 'Acceptable':      return 'Acceptable - Benefits may outweigh risks with monitoring';
    case 'Cautious':        return 'Cautious - Careful risk-benefit analysis required';
    case 'Contraindicated': return 'Contraindicated - Absolute contraindication(s) present';
    default:                return classification || '';
  }
}

/** CSS class hint for the HRT risk classification badge. */
function riskClassificationClass(classification) {
  switch (classification) {
    case 'Favourable':      return 'risk-favourable';
    case 'Acceptable':      return 'risk-acceptable';
    case 'Cautious':        return 'risk-cautious';
    case 'Contraindicated': return 'risk-contraindicated';
    default:                return '';
  }
}

/** Friendly label for an MRS item score (0-4). */
function mrsScoreLabel(score) {
  switch (score) {
    case 0: return 'None (0)';
    case 1: return 'Mild (1)';
    case 2: return 'Moderate (2)';
    case 3: return 'Severe (3)';
    case 4: return 'Very Severe (4)';
    default: return score == null ? '' : String(score);
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, mrsSeverityLabel, mrsSeverityClass, riskClassificationLabel, riskClassificationClass, mrsScoreLabel };
