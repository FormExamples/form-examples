// Plain-JavaScript / JSDoc type definitions for the Hernia Diagnostic
// Evaluation form.
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in ../../sql/04_create_table_hernia_diagnostic_evaluation.sql and
// ../../sql/05_create_table_hernia_diagnostic_evaluation_grade.sql. This is a
// plain-JS port of
// ../front-end-with-svelte/src/lib/engine/types.ts +
// ../front-end-with-svelte/src/lib/engine/defaults.ts — same field names,
// same shape, same unanswered-value convention.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric,
// date, and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer.

/**
 * Tri-state yes / no / unanswered, matching the SQL CHECK constraints.
 * @typedef {'yes' | 'no' | ''} YesNo
 */

/**
 * Hernia type, per the SQL CHECK constraint.
 * @typedef {'inguinal' | 'femoral' | 'umbilical' | 'epigastric' | 'incisional' | 'paraumbilical' | 'spigelian' | 'other' | ''} HerniaType
 */

/**
 * European Hernia Society inguinal subtype.
 * @typedef {'direct' | 'indirect' | 'pantaloon' | 'uncertain' | ''} InguinalSubtype
 */

/**
 * Laterality.
 * @typedef {'left' | 'right' | 'bilateral' | ''} Laterality
 */

/**
 * European Hernia Society size grade: 1 (< 2cm), 2 (2-4cm), 3 (> 4cm).
 * @typedef {'1' | '2' | '3' | ''} EhsSizeGrade
 */

/**
 * Clinician judgement of reducibility.
 * @typedef {'reducible' | 'irreducible' | 'incarcerated' | ''} ReducibilityStatus
 */

/**
 * Urgency band, computed red-flag-first rather than by summing a score.
 * @typedef {'routine' | 'soon' | 'urgent' | 'emergency' | ''} UrgencyBand
 */

/**
 * Imaging finding.
 * @typedef {'confirms-hernia' | 'no-hernia' | 'inconclusive' | ''} ImagingFinding
 */

/**
 * Management plan / overall recommendation.
 * @typedef {'watchful-waiting' | 'elective-repair-referral' | 'urgent-referral' | 'emergency-referral' | 'conservative' | ''} ManagementPlan
 */

/**
 * Scoring instrument a fired rule belongs to.
 * @typedef {'reducibility' | 'red-flag' | 'classification' | 'composite'} Instrument
 */

/**
 * Safety-flag priority.
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * Safety-flag category, mirroring the SQL CHECK constraint on grade_flag.
 * @typedef {'strangulation-suspected' | 'incarceration-risk' | 'emergency-surgical-referral' | 'atypical-presentation' | 'occult-hernia-suspected' | 'recurrent-hernia' | 'paediatric' | 'pregnancy' | 'capacity-concern' | 'other'} FlagCategory
 */

/**
 * One rule that fired during grading, stored as the audit trail.
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {Instrument} instrument
 * @property {string} component
 * @property {number|null} score
 * @property {string} band
 * @property {string} category
 * @property {string} description
 */

/**
 * One safety flag raised independently of the urgency band.
 * @typedef {Object} AdditionalFlag
 * @property {string} flagId
 * @property {FlagCategory} category
 * @property {FlagPriority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * The engine's output, mirroring the hernia_diagnostic_evaluation_grade table.
 * @typedef {Object} GradingResult
 * @property {HerniaType} herniaType
 * @property {InguinalSubtype|'not-applicable'|''} herniaSubtype
 * @property {string} ehsClassification
 * @property {EhsSizeGrade} ehsSizeGrade
 * @property {ReducibilityStatus} reducibilityStatus
 * @property {boolean} anyRedFlag
 * @property {UrgencyBand} computedUrgency
 * @property {UrgencyBand} finalUrgency
 * @property {string} overrideReason
 * @property {ManagementPlan} recommendation
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} flags
 */

/**
 * One evaluation row displayed in the dashboard.
 * @typedef {Object} EvaluationRow
 * @property {string} id
 * @property {string} assessmentDate
 * @property {string} patient
 * @property {string} nhs
 * @property {HerniaType} herniaType
 * @property {ReducibilityStatus} reducibilityStatus
 * @property {UrgencyBand} computedUrgency
 * @property {UrgencyBand} finalUrgency
 * @property {ManagementPlan} recommendation
 * @property {string} clinician
 * @property {string[]} flags
 */

/**
 * The whole evaluation: one section per wizard step.
 * @typedef {Object} HerniaDiagnosticEvaluation
 * @property {'draft'|'submitted'|'reviewed'|'urgent'} status
 * @property {Object} clinician
 * @property {Object} patient
 * @property {Object} history
 * @property {Object} riskFactors
 * @property {Object} inspection
 * @property {Object} palpation
 * @property {Object} reducibility
 * @property {Object} redFlags
 * @property {Object} classification
 * @property {Object} imaging
 * @property {Object} differential
 * @property {Object} functionalImpact
 * @property {Object} management
 * @property {Object} summary
 */

/**
 * Build a fresh, fully-blank hernia diagnostic evaluation.
 *
 * Plain-JS port of
 * ../front-end-with-svelte/src/lib/engine/defaults.ts's
 * `createDefaultAssessment()` — identical shape, identical defaults.
 *
 * @returns {HerniaDiagnosticEvaluation}
 */
function createDefaultAssessment() {
  return {
    status: 'draft',
    // Step 1 — clinician identification
    clinician: {
      clinicianName: '',
      role: '',
      registrationBody: '',
      registrationNumber: '',
      assessmentDate: '',
      assessmentTime: '',
      siteName: ''
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
    // Step 3 — presenting complaint and history
    history: {
      durationOfBulge: '',
      painScore0To10: null,
      painOnset: '',
      aggravatedByStraining: '',
      aggravatedByLifting: '',
      aggravatedByCoughing: '',
      priorHerniaHistory: '',
      priorHerniaRepair: '',
      priorHerniaRepairMesh: '',
      priorHerniaRepairSite: '',
      historyNotes: ''
    },
    // Step 4 — risk factors
    riskFactors: {
      riskChronicCough: '',
      riskConstipationOrStraining: '',
      riskHeavyLiftingOccupation: '',
      riskObesity: '',
      riskSmoking: '',
      riskFamilyHistory: '',
      riskPriorAbdominalSurgery: '',
      riskPregnancy: '',
      riskConnectiveTissueDisorder: '',
      riskAscites: '',
      riskFactorsNotes: ''
    },
    // Step 5 — visual inspection
    inspection: {
      inspectionLocation: '',
      inspectionLocationOther: '',
      bulgeVisibleAtRest: '',
      bulgeEnlargesOnStandingOrStraining: '',
      skinChanges: '',
      inspectionNotes: ''
    },
    // Step 6 — palpation and cough impulse
    palpation: {
      palpableMass: '',
      coughImpulsePositive: '',
      tenderness: '',
      massSizeAsCm: null,
      palpationNotes: ''
    },
    // Step 7 — reducibility assessment
    reducibility: {
      reducibilityStatus: '',
      reducesSpontaneously: '',
      reducesWithManualPressure: '',
      doesNotReduce: '',
      reducibilityNotes: ''
    },
    // Step 8 — red-flag / emergency symptom screen
    redFlags: {
      redFlagSeverePain: '',
      redFlagVomiting: '',
      redFlagFever: '',
      redFlagAbsoluteConstipation: '',
      redFlagErythemaOrDiscolouration: '',
      redFlagPreviouslyReducibleNowIrreducible: '',
      redFlagTachycardia: '',
      redFlagNotes: ''
    },
    // Step 9 — clinical classification
    classification: {
      herniaType: '',
      herniaTypeOther: '',
      inguinalSubtype: '',
      laterality: '',
      ehsSizeGrade: '',
      classificationNotes: ''
    },
    // Step 10 — imaging
    imaging: {
      ultrasoundPerformed: '',
      ultrasoundFindings: '',
      ctPerformed: '',
      ctFindings: '',
      mriPerformed: '',
      mriFindings: '',
      imagingIndication: '',
      imagingNotes: ''
    },
    // Step 11 — differential diagnosis considered
    differential: {
      differentialLipoma: '',
      differentialLymphadenopathy: '',
      differentialHydrocele: '',
      differentialUndescendedTestis: '',
      differentialFemoralAneurysm: '',
      differentialAbscess: '',
      differentialOther: '',
      differentialNotes: ''
    },
    // Step 12 — functional impact
    functionalImpact: {
      painInterferesWithWorkOrActivity: '',
      functionalImpactScale0To10: null,
      activityLimitation: ''
    },
    // Step 13 — management plan
    management: {
      managementPlan: '',
      conservativeDetail: '',
      referralMade: '',
      referralTargetTimeframe: '',
      managementNotes: ''
    },
    // Step 14 — summary and sign-off
    summary: {
      overrideUrgency: '',
      overrideReason: '',
      additionalNotes: '',
      signedByName: ''
    }
  };
}

export { createDefaultAssessment };
