// Plain-JavaScript / JSDoc type definitions for the Seasonal Affective
// Disorder Assessment data model. The shape mirrors the SvelteKit reference
// engine (combined SPAQ Global Seasonality Score + PHQ-9 depression
// severity, with ancillary clinical sub-sections per the AGENTS.md spec).

/**
 * @typedef {'male' | 'female' | 'other' | 'prefer-not-to-say' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'no-sad' | 'mild' | 'moderate' | 'severe' | 'critical'} CombinedSeverity
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} latitude   - e.g. '54.5N' (free-text, optional)
 * @property {string} country
 * @property {number | null} yearsAtCurrentLatitude
 */

/**
 * @typedef {Object} SeasonalPatternHistory
 * @property {YesNo} symptomsRecurAnnually
 * @property {string} worstMonths             - free-text e.g. 'Nov-Feb'
 * @property {string} bestMonths               - free-text e.g. 'May-Aug'
 * @property {number | null} yearsAffected
 * @property {YesNo} familyHistorySad
 * @property {string} firstOnsetAge            - free-text age
 */

/**
 * @typedef {Object} PHQ9Items
 * @property {number | null} q1   - little interest or pleasure
 * @property {number | null} q2   - feeling down, depressed, hopeless
 * @property {number | null} q3   - sleep problems
 * @property {number | null} q4   - feeling tired / little energy
 * @property {number | null} q5   - poor appetite or overeating
 * @property {number | null} q6   - feeling bad about yourself
 * @property {number | null} q7   - trouble concentrating
 * @property {number | null} q8   - moving or speaking slowly / restless
 * @property {number | null} q9   - thoughts of self-harm
 */

/**
 * @typedef {Object} CurrentMood
 * @property {PHQ9Items} phq9
 * @property {string} difficultyLevel   - PHQ-9 functional impact item ('not-difficult'|'somewhat'|'very'|'extremely'|'')
 */

/**
 * @typedef {Object} SPAQSleep
 * @property {number | null} sleepLength    - SPAQ item: change in sleep length (0-4)
 * @property {number | null} energyLevel    - SPAQ item: change in energy level (0-4)
 */

/**
 * @typedef {Object} SleepEnergy
 * @property {SPAQSleep} spaq
 * @property {number | null} hoursSleptWinter
 * @property {number | null} hoursSleptSummer
 * @property {YesNo} hypersomnia
 * @property {YesNo} morningFatigue
 * @property {string} energyNotes
 */

/**
 * @typedef {Object} SPAQAppetite
 * @property {number | null} appetite       - SPAQ item: change in appetite (0-4)
 * @property {number | null} weight         - SPAQ item: change in weight (0-4)
 */

/**
 * @typedef {Object} AppetiteWeight
 * @property {SPAQAppetite} spaq
 * @property {YesNo} carbohydrateCraving
 * @property {number | null} winterWeightChangeKg
 * @property {string} eatingPatternChanges
 */

/**
 * @typedef {Object} SPAQSocial
 * @property {number | null} mood            - SPAQ item: change in mood (0-4)
 * @property {number | null} socialActivity  - SPAQ item: change in social activity (0-4)
 */

/**
 * @typedef {Object} SocialOccupational
 * @property {SPAQSocial} spaq
 * @property {YesNo} workImpaired
 * @property {YesNo} relationshipsImpaired
 * @property {YesNo} socialWithdrawal
 * @property {string} occupationalNotes
 */

/**
 * @typedef {Object} LightExposure
 * @property {number | null} dailyOutdoorMinutes
 * @property {YesNo} workIndoors
 * @property {YesNo} curtainsClosedDaytime
 * @property {YesNo} sunriseExposure
 * @property {YesNo} usesLightTherapyBox
 * @property {string} lightTherapyDetails
 * @property {YesNo} lightTherapyAccess         - has access if needed
 */

/**
 * @typedef {Object} PreviousTreatments
 * @property {YesNo} antidepressants
 * @property {string} antidepressantDetails
 * @property {YesNo} psychotherapy
 * @property {string} psychotherapyDetails
 * @property {YesNo} lightTherapyHistory
 * @property {string} lightTherapyHistoryDetails
 * @property {YesNo} currentTreatment
 * @property {string} currentTreatmentDetails
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {YesNo} suicidalIdeation
 * @property {YesNo} suicidalIntent
 * @property {string} suicidalPlan
 * @property {YesNo} selfHarm
 * @property {string} selfHarmDetails
 * @property {YesNo} previousAttempt
 * @property {string} protectiveFactors
 * @property {YesNo} safetyPlanInPlace
 */

/**
 * @typedef {Object} TreatmentPlan
 * @property {YesNo} planLightTherapy
 * @property {YesNo} planAntidepressant
 * @property {YesNo} planPsychotherapy
 * @property {YesNo} planLifestyle
 * @property {YesNo} planCrisisReferral
 * @property {string} followUpInterval        - e.g. '2-weeks'|'4-weeks'|'8-weeks'|''
 * @property {string} clinicianNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SeasonalPatternHistory} seasonalPatternHistory
 * @property {CurrentMood} currentMood
 * @property {SleepEnergy} sleepEnergy
 * @property {AppetiteWeight} appetiteWeight
 * @property {SocialOccupational} socialOccupational
 * @property {LightExposure} lightExposure
 * @property {PreviousTreatments} previousTreatments
 * @property {RiskAssessment} riskAssessment
 * @property {TreatmentPlan} treatmentPlan
 */

/**
 * @typedef {'no-sad' | 'subsyndromal' | 'sad-likely'} SpaqBand
 * @typedef {'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe'} Phq9Band
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
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
 * @property {number} spaqScore
 * @property {SpaqBand} spaqBand
 * @property {number} phq9Score
 * @property {Phq9Band} phq9Band
 * @property {CombinedSeverity} combinedSeverity
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SeasonalAffectiveDisorderAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      latitude: '',
      country: '',
      yearsAtCurrentLatitude: null
    },
    seasonalPatternHistory: {
      symptomsRecurAnnually: '',
      worstMonths: '',
      bestMonths: '',
      yearsAffected: null,
      familyHistorySad: '',
      firstOnsetAge: ''
    },
    currentMood: {
      phq9: {
        q1: null, q2: null, q3: null, q4: null, q5: null,
        q6: null, q7: null, q8: null, q9: null
      },
      difficultyLevel: ''
    },
    sleepEnergy: {
      spaq: {
        sleepLength: null,
        energyLevel: null
      },
      hoursSleptWinter: null,
      hoursSleptSummer: null,
      hypersomnia: '',
      morningFatigue: '',
      energyNotes: ''
    },
    appetiteWeight: {
      spaq: {
        appetite: null,
        weight: null
      },
      carbohydrateCraving: '',
      winterWeightChangeKg: null,
      eatingPatternChanges: ''
    },
    socialOccupational: {
      spaq: {
        mood: null,
        socialActivity: null
      },
      workImpaired: '',
      relationshipsImpaired: '',
      socialWithdrawal: '',
      occupationalNotes: ''
    },
    lightExposure: {
      dailyOutdoorMinutes: null,
      workIndoors: '',
      curtainsClosedDaytime: '',
      sunriseExposure: '',
      usesLightTherapyBox: '',
      lightTherapyDetails: '',
      lightTherapyAccess: ''
    },
    previousTreatments: {
      antidepressants: '',
      antidepressantDetails: '',
      psychotherapy: '',
      psychotherapyDetails: '',
      lightTherapyHistory: '',
      lightTherapyHistoryDetails: '',
      currentTreatment: '',
      currentTreatmentDetails: ''
    },
    riskAssessment: {
      suicidalIdeation: '',
      suicidalIntent: '',
      suicidalPlan: '',
      selfHarm: '',
      selfHarmDetails: '',
      previousAttempt: '',
      protectiveFactors: '',
      safetyPlanInPlace: ''
    },
    treatmentPlan: {
      planLightTherapy: '',
      planAntidepressant: '',
      planPsychotherapy: '',
      planLifestyle: '',
      planCrisisReferral: '',
      followUpInterval: '',
      clinicianNotes: ''
    }
  };
}

/** Deep-merge a partial saved state into a fresh empty shape. */
function mergeOver(fresh, parsed) {
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    if (parsed[key] && typeof parsed[key] === 'object') {
      const target = fresh[key];
      const src = parsed[key];
      for (const k of Object.keys(target)) {
        if (
          target[k] &&
          typeof target[k] === 'object' &&
          !Array.isArray(target[k]) &&
          src[k] &&
          typeof src[k] === 'object'
        ) {
          // merge nested sub-object (e.g. phq9, spaq)
          target[k] = { ...target[k], ...src[k] };
        } else if (Object.prototype.hasOwnProperty.call(src, k)) {
          target[k] = src[k];
        }
      }
    }
  }
  return fresh;
}

export { emptyAssessment, mergeOver };
