// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pediatric Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. Also exposes a few utility helpers that
// mirror `src/lib/engine/utils.ts` (age, percentile category, gestational
// age category, dev-screen labels and colour classes).

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'vaginal' | 'caesarean-elective' | 'caesarean-emergency' | 'assisted' | ''} DeliveryType
 * @typedef {'breast' | 'formula' | 'mixed' | 'solid' | ''} FeedingType
 * @typedef {'pass' | 'concern' | 'fail' | ''} DomainResult
 * @typedef {'normal' | 'developmental-concern' | 'developmental-delay' | ''} OverallResult
 * @typedef {'above-average' | 'average' | 'below-average' | 'not-applicable' | ''} SchoolPerformance
 */

/**
 * @typedef {Object} Demographics
 * @property {string} childFirstName
 * @property {string} childLastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} headCircumference
 * @property {string} parentGuardianName
 * @property {string} parentGuardianRelationship
 * @property {string} parentGuardianPhone
 * @property {string} parentGuardianEmail
 */

/**
 * @typedef {Object} BirthHistory
 * @property {number | null} gestationalAge
 * @property {number | null} birthWeight
 * @property {DeliveryType} deliveryType
 * @property {number | null} apgarOneMinute
 * @property {number | null} apgarFiveMinutes
 * @property {YesNo} nicuStay
 * @property {number | null} nicuDuration
 * @property {YesNo} birthComplications
 * @property {string} birthComplicationDetails
 */

/**
 * @typedef {Object} GrowthNutrition
 * @property {number | null} weightPercentile
 * @property {number | null} heightPercentile
 * @property {number | null} headCircumferencePercentile
 * @property {FeedingType} feedingType
 * @property {YesNo} dietaryConcerns
 * @property {string} dietaryConcernDetails
 * @property {YesNo} failureToThrive
 */

/**
 * @typedef {Object} DevelopmentalMilestones
 * @property {DomainResult} grossMotor
 * @property {string} grossMotorNotes
 * @property {DomainResult} fineMotor
 * @property {string} fineMotorNotes
 * @property {DomainResult} language
 * @property {string} languageNotes
 * @property {DomainResult} socialEmotional
 * @property {string} socialEmotionalNotes
 * @property {DomainResult} cognitive
 * @property {string} cognitiveNotes
 */

/**
 * @typedef {Object} ImmunizationStatus
 * @property {YesNo} upToDate
 * @property {string} missingVaccinations
 * @property {YesNo} adverseReactions
 * @property {string} adverseReactionDetails
 * @property {YesNo} exemptions
 * @property {string} exemptionDetails
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} chronicConditions
 * @property {string} chronicConditionDetails
 * @property {YesNo} previousHospitalizations
 * @property {string} hospitalizationDetails
 * @property {YesNo} previousSurgeries
 * @property {string} surgeryDetails
 * @property {YesNo} recurringInfections
 * @property {string} infectionDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} prescriptions
 * @property {Medication[]} otcMedications
 * @property {Medication[]} supplements
 * @property {Allergy[]} allergies
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} geneticConditions
 * @property {string} geneticConditionDetails
 * @property {YesNo} chronicDiseases
 * @property {string} chronicDiseaseDetails
 * @property {YesNo} developmentalDisorders
 * @property {string} developmentalDisorderDetails
 * @property {YesNo} consanguinity
 */

/**
 * @typedef {Object} SocialEnvironmental
 * @property {string} homeEnvironment
 * @property {SchoolPerformance} schoolPerformance
 * @property {YesNo} behaviouralConcerns
 * @property {string} behaviouralConcernDetails
 * @property {YesNo} safeguardingConcerns
 * @property {string} safeguardingDetails
 * @property {number | null} screenTimeHoursPerDay
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {BirthHistory} birthHistory
 * @property {GrowthNutrition} growthNutrition
 * @property {DevelopmentalMilestones} developmentalMilestones
 * @property {ImmunizationStatus} immunizationStatus
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {FamilyHistory} familyHistory
 * @property {SocialEnvironmental} socialEnvironmental
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {DomainResult} result
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
 * @property {OverallResult} overallResult
 * @property {Record<string, DomainResult>} domainResults
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
      childFirstName: '',
      childLastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      headCircumference: null,
      parentGuardianName: '',
      parentGuardianRelationship: '',
      parentGuardianPhone: '',
      parentGuardianEmail: ''
    },
    birthHistory: {
      gestationalAge: null,
      birthWeight: null,
      deliveryType: '',
      apgarOneMinute: null,
      apgarFiveMinutes: null,
      nicuStay: '',
      nicuDuration: null,
      birthComplications: '',
      birthComplicationDetails: ''
    },
    growthNutrition: {
      weightPercentile: null,
      heightPercentile: null,
      headCircumferencePercentile: null,
      feedingType: '',
      dietaryConcerns: '',
      dietaryConcernDetails: '',
      failureToThrive: ''
    },
    developmentalMilestones: {
      grossMotor: '',
      grossMotorNotes: '',
      fineMotor: '',
      fineMotorNotes: '',
      language: '',
      languageNotes: '',
      socialEmotional: '',
      socialEmotionalNotes: '',
      cognitive: '',
      cognitiveNotes: ''
    },
    immunizationStatus: {
      upToDate: '',
      missingVaccinations: '',
      adverseReactions: '',
      adverseReactionDetails: '',
      exemptions: '',
      exemptionDetails: ''
    },
    medicalHistory: {
      chronicConditions: '',
      chronicConditionDetails: '',
      previousHospitalizations: '',
      hospitalizationDetails: '',
      previousSurgeries: '',
      surgeryDetails: '',
      recurringInfections: '',
      infectionDetails: ''
    },
    currentMedications: {
      prescriptions: [],
      otcMedications: [],
      supplements: [],
      allergies: []
    },
    familyHistory: {
      geneticConditions: '',
      geneticConditionDetails: '',
      chronicDiseases: '',
      chronicDiseaseDetails: '',
      developmentalDisorders: '',
      developmentalDisorderDetails: '',
      consanguinity: ''
    },
    socialEnvironmental: {
      homeEnvironment: '',
      schoolPerformance: '',
      behaviouralConcerns: '',
      behaviouralConcernDetails: '',
      safeguardingConcerns: '',
      safeguardingDetails: '',
      screenTimeHoursPerDay: null
    }
  };
}

// ──────────────────────────────────────────────
// Utility helpers (mirrors src/lib/engine/utils.ts)
// ──────────────────────────────────────────────

/** Calculate age in months from date of birth string. */
function calculateAgeMonths(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  const months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) {
    return months - 1;
  }
  return months;
}

/** Calculate age in years from date of birth string. */
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

/** Format age for display: months if < 24 months, otherwise years. */
function formatAge(dob) {
  const months = calculateAgeMonths(dob);
  if (months === null) return '';
  if (months < 24) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years} years`;
}

/** Developmental screen overall result label. */
function devScreenLabel(result) {
  switch (result) {
    case 'normal': return 'Normal Development';
    case 'developmental-concern': return 'Developmental Concern';
    case 'developmental-delay': return 'Developmental Delay';
    default: return result;
  }
}

/** CSS class hint for the overall result badge. */
function devScreenClass(result) {
  switch (result) {
    case 'normal': return 'screen-normal';
    case 'developmental-concern': return 'screen-concern';
    case 'developmental-delay': return 'screen-delay';
    default: return '';
  }
}

/** Domain result label. */
function domainResultLabel(result) {
  switch (result) {
    case 'pass': return 'Pass';
    case 'concern': return 'Concern';
    case 'fail': return 'Fail';
    default: return 'Not Assessed';
  }
}

/** CSS class hint for a domain result badge. */
function domainResultClass(result) {
  switch (result) {
    case 'pass': return 'domain-pass';
    case 'concern': return 'domain-concern';
    case 'fail': return 'domain-fail';
    default: return '';
  }
}

/** Growth percentile category label. */
function percentileCategory(percentile) {
  if (percentile === null || percentile === undefined) return '';
  if (percentile < 3) return 'Below 3rd (Severely Low)';
  if (percentile < 10) return 'Below 10th (Low)';
  if (percentile < 25) return 'Below 25th';
  if (percentile <= 75) return 'Normal Range';
  if (percentile <= 90) return 'Above 75th';
  if (percentile <= 97) return 'Above 90th (High)';
  return 'Above 97th (Severely High)';
}

/** Gestational age category label. */
function gestationalAgeCategory(weeks) {
  if (weeks === null || weeks === undefined) return '';
  if (weeks < 28) return 'Extremely Preterm';
  if (weeks < 32) return 'Very Preterm';
  if (weeks < 37) return 'Preterm';
  if (weeks <= 41) return 'Term';
  return 'Post-term';
}

export { emptyAssessment, calculateAgeMonths, calculateAge, formatAge, devScreenLabel, devScreenClass, domainResultLabel, domainResultClass, percentileCategory, gestationalAgeCategory };
