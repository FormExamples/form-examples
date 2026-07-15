// Plain-JavaScript / JSDoc type definitions for the Palliative Assessment
// form. Mirrors the SvelteKit data model: ten ESAS-r symptom intensities
// (0-10) plus eight ancillary palliative-care sections covering diagnosis,
// performance status, advance-care planning, medications, psychosocial and
// spiritual concerns, carer support, and the multidisciplinary plan.
//
// Conventions:
//   - empty string ''     for unanswered text fields
//   - null                for unanswered numeric fields (including ESAS items)
//   - empty array []      for unanswered list fields

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'patient' | 'carer' | 'clinician' | 'family' | ''} ReporterRole
 * @typedef {'days' | 'weeks' | 'months' | 'years' | 'uncertain' | ''} PrognosisHorizon
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} nhsOrMrnNumber
 * @property {string} preferredLanguage
 * @property {string} ethnicity
 * @property {ReporterRole} reporterRole
 * @property {string} reporterName
 * @property {string} assessmentDate
 * @property {string} assessmentSetting
 */

/**
 * @typedef {Object} PrimaryDiagnosisPrognosis
 * @property {string} primaryDiagnosis
 * @property {string} secondaryDiagnoses
 * @property {string} dateOfDiagnosis
 * @property {string} stageOrSeverity
 * @property {YesNo} diseaseProgressing
 * @property {PrognosisHorizon} prognosisHorizon
 * @property {YesNo} surpriseQuestion
 * @property {string} prognosticIndicators
 * @property {string} relevantTreatmentHistory
 */

/**
 * Numeric ESAS-r intensity for a single symptom (0-10) or null if unanswered.
 * @typedef {number | null} ESASScore
 */

/**
 * @typedef {Object} ESASrSymptoms
 * @property {ESASScore} pain
 * @property {ESASScore} tiredness
 * @property {ESASScore} drowsiness
 * @property {ESASScore} nausea
 * @property {ESASScore} lackOfAppetite
 * @property {ESASScore} shortnessOfBreath
 * @property {ESASScore} depression
 * @property {ESASScore} anxiety
 * @property {ESASScore} wellbeing
 * @property {ESASScore} other
 * @property {string} otherLabel
 * @property {string} symptomNotes
 */

/**
 * @typedef {Object} PerformanceStatus
 * @property {number | null} ppsScore
 * @property {number | null} akpsScore
 * @property {number | null} ecogScore
 * @property {string} mobilityNotes
 * @property {string} activityLevel
 * @property {YesNo} bedBound
 * @property {YesNo} requiresAssistanceWithAdls
 * @property {string} adlNotes
 */

/**
 * @typedef {Object} GoalsOfCareACP
 * @property {string} patientPrioritiesAndWishes
 * @property {string} preferredPlaceOfCare
 * @property {string} preferredPlaceOfDeath
 * @property {YesNoUnknown} respectFormCompleted
 * @property {string} respectFormDate
 * @property {YesNoUnknown} adrtCompleted
 * @property {string} adrtDate
 * @property {YesNoUnknown} lpaHealthAndWelfare
 * @property {string} lpaName
 * @property {YesNoUnknown} dnacprDocumented
 * @property {string} dnacprDate
 * @property {YesNo} ceilingOfTreatmentDiscussed
 * @property {string} ceilingOfTreatmentNotes
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} route
 * @property {string} frequency
 * @property {string} indication
 */

/**
 * @typedef {Object} MedicationsSymptomControl
 * @property {Medication[]} regularMedications
 * @property {Medication[]} asNeededMedications
 * @property {YesNo} syringeDriverInUse
 * @property {string} syringeDriverDetails
 * @property {YesNo} anticipatoryMedsPrescribed
 * @property {string} anticipatoryMedsNotes
 * @property {'good' | 'partial' | 'poor' | ''} symptomControlOverall
 * @property {string} barriersToControl
 * @property {string} planNotes
 */

/**
 * @typedef {Object} PsychosocialSpiritualConcerns
 * @property {YesNo} moodConcerns
 * @property {string} moodNotes
 * @property {YesNo} anxietyConcerns
 * @property {string} anxietyNotes
 * @property {YesNo} existentialDistress
 * @property {string} existentialNotes
 * @property {YesNo} spiritualSupportRequested
 * @property {string} faithOrBelief
 * @property {string} chaplaincyNotes
 * @property {YesNo} unresolvedConcerns
 * @property {string} unresolvedNotes
 */

/**
 * @typedef {Object} CarerFamilySupport
 * @property {string} primaryCarerName
 * @property {string} primaryCarerRelationship
 * @property {YesNo} carerLivesWithPatient
 * @property {YesNo} carerStrainReported
 * @property {'low' | 'moderate' | 'high' | 'overwhelmed' | ''} carerStrainLevel
 * @property {string} carerStrainNotes
 * @property {YesNo} respiteRequired
 * @property {string} respiteNotes
 * @property {YesNo} childrenInHousehold
 * @property {string} childrenSupportNotes
 * @property {YesNo} bereavementRiskIdentified
 * @property {string} bereavementNotes
 */

/**
 * @typedef {Object} MultidisciplinaryPlan
 * @property {YesNo} specialistPalliativeCareInvolved
 * @property {YesNo} communityNursingInvolved
 * @property {YesNo} hospiceReferralMade
 * @property {YesNo} socialWorkReferralMade
 * @property {YesNo} occupationalTherapyReferralMade
 * @property {YesNo} physiotherapyReferralMade
 * @property {YesNo} dieticianReferralMade
 * @property {YesNo} chaplaincyReferralMade
 * @property {YesNo} psychologyReferralMade
 * @property {string} otherReferrals
 * @property {string} reviewInterval
 * @property {string} keyWorkerName
 * @property {string} planSummary
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PrimaryDiagnosisPrognosis} primaryDiagnosisPrognosis
 * @property {ESASrSymptoms} esasrSymptoms
 * @property {PerformanceStatus} performanceStatus
 * @property {GoalsOfCareACP} goalsOfCareACP
 * @property {MedicationsSymptomControl} medicationsSymptomControl
 * @property {PsychosocialSpiritualConcerns} psychosocialSpiritualConcerns
 * @property {CarerFamilySupport} carerFamilySupport
 * @property {MultidisciplinaryPlan} multidisciplinaryPlan
 */

/**
 * @typedef {'none' | 'mild' | 'moderate' | 'severe'} SeverityBand
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} IndividualFlag
 * @property {string} symptomKey
 * @property {string} symptomLabel
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
 * @property {number} esasTotal
 * @property {SeverityBand} severityBand
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {IndividualFlag[]} individualFlags
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PalliativeAssessment`.

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
      nhsOrMrnNumber: '',
      preferredLanguage: '',
      ethnicity: '',
      reporterRole: '',
      reporterName: '',
      assessmentDate: '',
      assessmentSetting: ''
    },
    primaryDiagnosisPrognosis: {
      primaryDiagnosis: '',
      secondaryDiagnoses: '',
      dateOfDiagnosis: '',
      stageOrSeverity: '',
      diseaseProgressing: '',
      prognosisHorizon: '',
      surpriseQuestion: '',
      prognosticIndicators: '',
      relevantTreatmentHistory: ''
    },
    esasrSymptoms: {
      pain: null,
      tiredness: null,
      drowsiness: null,
      nausea: null,
      lackOfAppetite: null,
      shortnessOfBreath: null,
      depression: null,
      anxiety: null,
      wellbeing: null,
      other: null,
      otherLabel: '',
      symptomNotes: ''
    },
    performanceStatus: {
      ppsScore: null,
      akpsScore: null,
      ecogScore: null,
      mobilityNotes: '',
      activityLevel: '',
      bedBound: '',
      requiresAssistanceWithAdls: '',
      adlNotes: ''
    },
    goalsOfCareACP: {
      patientPrioritiesAndWishes: '',
      preferredPlaceOfCare: '',
      preferredPlaceOfDeath: '',
      respectFormCompleted: '',
      respectFormDate: '',
      adrtCompleted: '',
      adrtDate: '',
      lpaHealthAndWelfare: '',
      lpaName: '',
      dnacprDocumented: '',
      dnacprDate: '',
      ceilingOfTreatmentDiscussed: '',
      ceilingOfTreatmentNotes: ''
    },
    medicationsSymptomControl: {
      regularMedications: [],
      asNeededMedications: [],
      syringeDriverInUse: '',
      syringeDriverDetails: '',
      anticipatoryMedsPrescribed: '',
      anticipatoryMedsNotes: '',
      symptomControlOverall: '',
      barriersToControl: '',
      planNotes: ''
    },
    psychosocialSpiritualConcerns: {
      moodConcerns: '',
      moodNotes: '',
      anxietyConcerns: '',
      anxietyNotes: '',
      existentialDistress: '',
      existentialNotes: '',
      spiritualSupportRequested: '',
      faithOrBelief: '',
      chaplaincyNotes: '',
      unresolvedConcerns: '',
      unresolvedNotes: ''
    },
    carerFamilySupport: {
      primaryCarerName: '',
      primaryCarerRelationship: '',
      carerLivesWithPatient: '',
      carerStrainReported: '',
      carerStrainLevel: '',
      carerStrainNotes: '',
      respiteRequired: '',
      respiteNotes: '',
      childrenInHousehold: '',
      childrenSupportNotes: '',
      bereavementRiskIdentified: '',
      bereavementNotes: ''
    },
    multidisciplinaryPlan: {
      specialistPalliativeCareInvolved: '',
      communityNursingInvolved: '',
      hospiceReferralMade: '',
      socialWorkReferralMade: '',
      occupationalTherapyReferralMade: '',
      physiotherapyReferralMade: '',
      dieticianReferralMade: '',
      chaplaincyReferralMade: '',
      psychologyReferralMade: '',
      otherReferrals: '',
      reviewInterval: '',
      keyWorkerName: '',
      planSummary: ''
    }
  };
}

/**
 * Static metadata about the ten ESAS-r items: keys, labels, and the
 * conventional "low pole" / "high pole" descriptions used in the patient
 * questionnaire. The "other" item is a user-labelled wildcard (often
 * constipation, sleep, or itch).
 */
const ESAS_ITEMS = [
  { key: 'pain',              label: 'Pain',                lowPole: 'No pain',           highPole: 'Worst possible pain' },
  { key: 'tiredness',         label: 'Tiredness (lack of energy)', lowPole: 'No tiredness',     highPole: 'Worst possible tiredness' },
  { key: 'drowsiness',        label: 'Drowsiness (feeling sleepy)', lowPole: 'No drowsiness',    highPole: 'Worst possible drowsiness' },
  { key: 'nausea',            label: 'Nausea',              lowPole: 'No nausea',          highPole: 'Worst possible nausea' },
  { key: 'lackOfAppetite',    label: 'Lack of appetite',    lowPole: 'No lack of appetite', highPole: 'Worst possible lack of appetite' },
  { key: 'shortnessOfBreath', label: 'Shortness of breath', lowPole: 'No shortness of breath', highPole: 'Worst possible shortness of breath' },
  { key: 'depression',        label: 'Depression (feeling sad)', lowPole: 'No depression', highPole: 'Worst possible depression' },
  { key: 'anxiety',           label: 'Anxiety (feeling nervous)', lowPole: 'No anxiety', highPole: 'Worst possible anxiety' },
  { key: 'wellbeing',         label: 'Wellbeing (how you feel overall)', lowPole: 'Best wellbeing', highPole: 'Worst wellbeing' },
  { key: 'other',             label: 'Other symptom',       lowPole: 'No symptom',         highPole: 'Worst possible' }
];

/**
 * Classify a numeric ESAS-r total (0-100) into a severity band.
 * Bands: None 0-10, Mild 11-30, Moderate 31-60, Severe 61-100.
 * @param {number} total
 * @returns {SeverityBand}
 */
function classifyESASTotal(total) {
  if (total <= 10) return 'none';
  if (total <= 30) return 'mild';
  if (total <= 60) return 'moderate';
  return 'severe';
}

/**
 * Friendly label for a severity band.
 * @param {SeverityBand} band
 */
function severityBandLabel(band) {
  switch (band) {
    case 'none':     return 'None / Minimal';
    case 'mild':     return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe':   return 'Severe';
    default:         return '';
  }
}

/**
 * CSS class hint for the severity badge.
 * @param {SeverityBand} band
 */
function severityBandClass(band) {
  switch (band) {
    case 'none':     return 'severity-none';
    case 'mild':     return 'severity-mild';
    case 'moderate': return 'severity-moderate';
    case 'severe':   return 'severity-severe';
    default:         return '';
  }
}

/**
 * Classify an individual ESAS-r symptom (0-10) into mild/moderate/severe.
 *   0     -> none
 *   1-3   -> mild
 *   4-6   -> moderate
 *   7-10  -> severe
 * @param {number | null} score
 * @returns {SeverityBand | ''}
 */
function classifyIndividualSymptom(score) {
  if (score === null || score === undefined) return '';
  if (score <= 0)  return 'none';
  if (score <= 3)  return 'mild';
  if (score <= 6)  return 'moderate';
  return 'severe';
}

export { emptyAssessment, ESAS_ITEMS, classifyESASTotal, severityBandLabel, severityBandClass, classifyIndividualSymptom };
