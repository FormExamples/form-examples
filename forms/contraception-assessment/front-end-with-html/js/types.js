// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Contraception Assessment.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'never' | 'former' | 'current-light' | 'current-heavy' | ''} SmokingStatus
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholUse
 * @typedef {'none' | 'cannabis' | 'recreational' | 'iv-drug-use' | ''} DrugUse
 * @typedef {'light' | 'moderate' | 'heavy' | 'very-heavy' | ''} FlowHeaviness
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} Dysmenorrhea
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} EfficacyPriority
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} ConveniencePriority
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} PeriodControlPriority
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} FertilityReturnPriority
 * @typedef {'no-preference' | 'prefer-hormone-free' | 'prefer-hormonal' | ''} HormoneFreePreference
 * @typedef {'yes-soon' | 'yes-future' | 'unsure' | 'no' | ''} DesireForChildren
 * @typedef {'within-1-year' | '1-3-years' | '3-5-years' | '5-plus-years' | 'not-applicable' | ''} Timeframe
 * @typedef {'involved' | 'not-involved' | 'not-applicable' | ''} PartnerInvolvement
 * @typedef {'completed' | 'partial' | 'none' | 'unsure' | ''} HPVVaccination
 * @typedef {1 | 2 | 3 | 4} UKMECCategory
 * @typedef {'combined-oral' | 'progestogen-only-pill' | 'injectable' |
 *           'implant' | 'copper-iud' | 'lng-ius' | 'patch' | 'vaginal-ring' |
 *           'barrier' | 'natural-methods' | 'sterilisation' | 'none' | ''} ContraceptiveMethod
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ContraceptionAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {Object}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: ''
    },
    reproductiveHistory: {
      gravida: null,
      para: null,
      lastDeliveryDate: '',
      breastfeeding: '',
      pregnancyIntention: ''
    },
    menstrualHistory: {
      cycleLength: null,
      cycleDuration: null,
      flowHeaviness: '',
      dysmenorrhea: '',
      lastMenstrualPeriod: ''
    },
    currentContraception: {
      currentMethod: '',
      durationOfUse: '',
      reasonForChange: '',
      sideEffects: ''
    },
    medicalHistory: {
      hypertension: '',
      migraineWithAura: '',
      dvtHistory: '',
      breastCancer: '',
      liverDisease: '',
      diabetes: '',
      epilepsy: '',
      hiv: '',
      stiHistory: ''
    },
    cardiovascularRisk: {
      bmi: null,
      smoking: '',
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      familyHistoryCVD: '',
      lipidDisorders: ''
    },
    lifestyleFactors: {
      smokingStatus: '',
      alcoholUse: '',
      drugUse: '',
      occupation: '',
      travelPlans: ''
    },
    preferencesPriorities: {
      preferredMethod: '',
      efficacyPriority: '',
      conveniencePriority: '',
      periodControlPriority: '',
      fertilityReturnPriority: '',
      hormoneFreePreference: ''
    },
    breastCervicalScreening: {
      lastBreastScreening: '',
      lastCervicalScreening: '',
      hpvVaccination: ''
    },
    familyPlanningGoals: {
      desireForChildren: '',
      timeframe: '',
      partnerInvolvement: ''
    }
  };
}

/** Calculate age from date-of-birth string (YYYY-MM-DD). Returns null if invalid. */
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

/** UKMEC category descriptive label. */
function ukmecCategoryLabel(category) {
  switch (category) {
    case 1: return 'No restriction';
    case 2: return 'Advantages outweigh risks';
    case 3: return 'Risks outweigh advantages';
    case 4: return 'Unacceptable health risk';
    default: return '';
  }
}

/** Long UKMEC label e.g. "UKMEC 3 - Risks outweigh advantages". */
function ukmecLabel(category) {
  return `UKMEC ${category} - ${ukmecCategoryLabel(category)}`;
}

/** CSS class hint for a UKMEC-category badge. */
function ukmecBadgeClass(category) {
  return `ukmec-cat-${category}`;
}

export { emptyAssessment, calculateAge, ukmecCategoryLabel, ukmecLabel, ukmecBadgeClass };
