// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Vaccinations Checklist form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'fully-immunised' | 'partially-immunised' | 'non-compliant' | 'contraindicated'} ComplianceStatus
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
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
 * @property {string} occupation
 * @property {'healthcare' | 'education' | 'social-care' | 'laboratory' | 'travel' | 'military' | 'other' | ''} occupationCategory
 * @property {string} employer
 */

/**
 * @typedef {Object} VaccinationHistory
 * @property {YesNo} hasVaccinationRecord
 * @property {'red-book' | 'gp-records' | 'occupational-health' | 'self-reported' | 'overseas-records' | 'other' | ''} recordSource
 * @property {string} recordSourceOther
 * @property {YesNo} previousAdverseReaction
 * @property {string} adverseReactionDetails
 * @property {string} adverseReactionVaccine
 * @property {'mild' | 'moderate' | 'severe' | 'anaphylaxis' | ''} adverseReactionSeverity
 * @property {YesNo} immunocompromised
 * @property {string} immunocompromisedDetails
 * @property {'yes' | 'no' | 'not-applicable' | ''} pregnantOrPlanning
 */

/**
 * @typedef {Object} ChildhoodImmunisations
 * @property {YesNoUnknown} mmrDose1
 * @property {string} mmrDose1Date
 * @property {YesNoUnknown} mmrDose2
 * @property {string} mmrDose2Date
 * @property {YesNoUnknown} dtpPrimaryCourse
 * @property {string} dtpPrimaryDate
 * @property {YesNoUnknown} dtpBooster
 * @property {string} dtpBoosterDate
 * @property {YesNoUnknown} polioPrimaryCourse
 * @property {string} polioPrimaryDate
 * @property {YesNoUnknown} polioBooster
 * @property {string} polioBoosterDate
 * @property {YesNoUnknown} hibVaccine
 * @property {string} hibVaccineDate
 * @property {YesNoUnknown} menCVaccine
 * @property {string} menCVaccineDate
 * @property {YesNoUnknown} menACWYVaccine
 * @property {string} menACWYVaccineDate
 * @property {YesNoUnknown} pcvVaccine
 * @property {string} pcvVaccineDate
 * @property {string} notes
 */

/**
 * @typedef {Object} OccupationalVaccines
 * @property {YesNoUnknown} hepatitisBCourse
 * @property {string} hepatitisBCourseDate
 * @property {number | null} hepatitisBDosesReceived
 * @property {'adequate' | 'inadequate' | 'not-tested' | ''} hepatitisBAntiBodyLevel
 * @property {YesNoUnknown} bcgVaccine
 * @property {string} bcgVaccineDate
 * @property {YesNo} bcgScarPresent
 * @property {YesNoUnknown} varicellaVaccine
 * @property {string} varicellaVaccineDate
 * @property {YesNoUnknown} varicellaHistory
 * @property {YesNoUnknown} hepatitisAVaccine
 * @property {string} hepatitisAVaccineDate
 * @property {YesNoUnknown} typhoidVaccine
 * @property {string} typhoidVaccineDate
 * @property {YesNoUnknown} rabiesVaccine
 * @property {string} rabiesVaccineDate
 * @property {string} notes
 */

/**
 * @typedef {Object} TravelVaccines
 * @property {YesNo} travelPlanned
 * @property {string} travelDestination
 * @property {string} travelDepartureDate
 * @property {string} travelReturnDate
 * @property {YesNoUnknown} yellowFeverVaccine
 * @property {string} yellowFeverVaccineDate
 * @property {YesNo} yellowFeverCertificate
 * @property {YesNoUnknown} japaneseEncephalitisVaccine
 * @property {string} japaneseEncephalitisDate
 * @property {YesNoUnknown} tickBorneEncephalitisVaccine
 * @property {string} tickBorneEncephalitisDate
 * @property {YesNoUnknown} choleraVaccine
 * @property {string} choleraVaccineDate
 * @property {YesNoUnknown} meningococcalACWYTravel
 * @property {string} meningococcalACWYTravelDate
 * @property {'yes' | 'no' | 'not-required' | ''} malariaProphylaxis
 * @property {'atovaquone-proguanil' | 'doxycycline' | 'mefloquine' | 'chloroquine' | 'other' | ''} malariaProphylaxisDrug
 * @property {string} notes
 */

/**
 * @typedef {Object} Covid19Vaccination
 * @property {YesNoUnknown} covidPrimaryCourse
 * @property {'pfizer' | 'moderna' | 'astrazeneca' | 'novavax' | 'janssen' | 'other' | ''} covidPrimaryVaccineType
 * @property {string} covidDose1Date
 * @property {string} covidDose2Date
 * @property {YesNo} covidBooster1
 * @property {string} covidBooster1Date
 * @property {'pfizer' | 'moderna' | 'astrazeneca' | 'novavax' | 'other' | ''} covidBooster1Type
 * @property {YesNo} covidBooster2
 * @property {string} covidBooster2Date
 * @property {'pfizer' | 'moderna' | 'novavax' | 'other' | ''} covidBooster2Type
 * @property {YesNo} covidAutumnBooster
 * @property {string} covidAutumnBoosterDate
 * @property {number | null} totalCovidDoses
 * @property {YesNo} covidAdverseReaction
 * @property {string} covidAdverseReactionDetails
 * @property {string} notes
 */

/**
 * @typedef {Object} InfluenzaVaccination
 * @property {YesNo} fluVaccineCurrentSeason
 * @property {string} fluVaccineCurrentDate
 * @property {'standard' | 'adjuvanted' | 'cell-based' | 'recombinant' | 'nasal-spray' | 'other' | ''} fluVaccineType
 * @property {YesNoUnknown} fluVaccinePreviousSeason
 * @property {YesNo} fluVaccineAnnualRecipient
 * @property {YesNo} fluHighRiskGroup
 * @property {'age-65-plus' | 'chronic-respiratory' | 'chronic-heart' | 'chronic-kidney' | 'chronic-liver' | 'diabetes' | 'immunosuppressed' | 'pregnant' | 'healthcare-worker' | 'carer' | 'other' | ''} fluHighRiskReason
 * @property {YesNo} fluAdverseReaction
 * @property {string} fluAdverseReactionDetails
 * @property {string} notes
 */

/**
 * @typedef {Object} ContraindicationsAllergies
 * @property {YesNo} eggAllergy
 * @property {'mild' | 'moderate' | 'severe' | 'anaphylaxis' | ''} eggAllergySeverity
 * @property {YesNo} gelatinAllergy
 * @property {YesNo} neomycinAllergy
 * @property {YesNo} latexAllergy
 * @property {YesNo} yeastAllergy
 * @property {YesNo} pegPolysorbateAllergy
 * @property {string} otherVaccineAllergies
 * @property {YesNo} historyOfGBS
 * @property {string} gbsDetails
 * @property {YesNo} onImmunosuppressants
 * @property {string} immunosuppressantDetails
 * @property {YesNo} onBloodProductsRecent
 * @property {string} bloodProductsDetails
 * @property {YesNo} liveVaccineContraindicated
 * @property {string} liveVaccineContraindicationReason
 * @property {string} notes
 */

/**
 * @typedef {Object} SerologyImmunityTesting
 * @property {'positive' | 'negative' | 'not-tested' | ''} hepBSurfaceAntibody
 * @property {number | null} hepBSurfaceAntibodyLevel
 * @property {string} hepBSurfaceAntibodyDate
 * @property {'positive' | 'negative' | 'equivocal' | 'not-tested' | ''} varicellaIgG
 * @property {string} varicellaIgGDate
 * @property {'positive' | 'negative' | 'equivocal' | 'not-tested' | ''} measlesIgG
 * @property {string} measlesIgGDate
 * @property {'positive' | 'negative' | 'equivocal' | 'not-tested' | ''} rubellaIgG
 * @property {string} rubellaIgGDate
 * @property {'positive' | 'negative' | 'equivocal' | 'not-tested' | ''} mumpsIgG
 * @property {string} mumpsIgGDate
 * @property {'positive' | 'negative' | 'not-tested' | ''} hepAIgG
 * @property {string} hepAIgGDate
 * @property {'positive' | 'negative' | 'not-tested' | ''} tetanusAntibody
 * @property {string} tetanusAntibodyDate
 * @property {'positive' | 'negative' | 'indeterminate' | 'not-tested' | ''} tbIGRAResult
 * @property {string} tbIGRADate
 * @property {'positive' | 'negative' | 'not-tested' | ''} mantouxResult
 * @property {number | null} mantouxIndurationMm
 * @property {string} notes
 */

/**
 * @typedef {Object} ScheduleCompliance
 * @property {ComplianceStatus | ''} complianceStatus
 * @property {string} vaccinesDue
 * @property {string} vaccinesOverdue
 * @property {YesNo} catchUpPlanRequired
 * @property {string} catchUpPlanDetails
 * @property {string} nextVaccinationDate
 * @property {string} nextVaccinationType
 * @property {'yes' | 'no' | 'pending' | ''} occupationalHealthClearance
 * @property {string} occupationalHealthClearanceDate
 * @property {RiskLevel | ''} exposureRiskLevel
 * @property {YesNo} activeExposureIncident
 * @property {string} activeExposureDetails
 * @property {YesNo} consentForVaccination
 * @property {string} consentDate
 * @property {string} notes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {VaccinationHistory} vaccinationHistory
 * @property {ChildhoodImmunisations} childhoodImmunisations
 * @property {OccupationalVaccines} occupationalVaccines
 * @property {TravelVaccines} travelVaccines
 * @property {Covid19Vaccination} covid19Vaccination
 * @property {InfluenzaVaccination} influenzaVaccination
 * @property {ContraindicationsAllergies} contraindicationsAllergies
 * @property {SerologyImmunityTesting} serologyImmunityTesting
 * @property {ScheduleCompliance} scheduleCompliance
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} grade
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
 * @property {ComplianceStatus} complianceStatus
 * @property {RiskLevel} overallRisk
 * @property {boolean} childhoodComplete
 * @property {boolean} occupationalComplete
 * @property {boolean} covidComplete
 * @property {boolean} fluCurrent
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string[]} missingVaccinations
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.VaccinationsChecklist`.

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
      weight: null,
      height: null,
      bmi: null,
      occupation: '',
      occupationCategory: '',
      employer: ''
    },
    vaccinationHistory: {
      hasVaccinationRecord: '',
      recordSource: '',
      recordSourceOther: '',
      previousAdverseReaction: '',
      adverseReactionDetails: '',
      adverseReactionVaccine: '',
      adverseReactionSeverity: '',
      immunocompromised: '',
      immunocompromisedDetails: '',
      pregnantOrPlanning: ''
    },
    childhoodImmunisations: {
      mmrDose1: '',
      mmrDose1Date: '',
      mmrDose2: '',
      mmrDose2Date: '',
      dtpPrimaryCourse: '',
      dtpPrimaryDate: '',
      dtpBooster: '',
      dtpBoosterDate: '',
      polioPrimaryCourse: '',
      polioPrimaryDate: '',
      polioBooster: '',
      polioBoosterDate: '',
      hibVaccine: '',
      hibVaccineDate: '',
      menCVaccine: '',
      menCVaccineDate: '',
      menACWYVaccine: '',
      menACWYVaccineDate: '',
      pcvVaccine: '',
      pcvVaccineDate: '',
      notes: ''
    },
    occupationalVaccines: {
      hepatitisBCourse: '',
      hepatitisBCourseDate: '',
      hepatitisBDosesReceived: null,
      hepatitisBAntiBodyLevel: '',
      bcgVaccine: '',
      bcgVaccineDate: '',
      bcgScarPresent: '',
      varicellaVaccine: '',
      varicellaVaccineDate: '',
      varicellaHistory: '',
      hepatitisAVaccine: '',
      hepatitisAVaccineDate: '',
      typhoidVaccine: '',
      typhoidVaccineDate: '',
      rabiesVaccine: '',
      rabiesVaccineDate: '',
      notes: ''
    },
    travelVaccines: {
      travelPlanned: '',
      travelDestination: '',
      travelDepartureDate: '',
      travelReturnDate: '',
      yellowFeverVaccine: '',
      yellowFeverVaccineDate: '',
      yellowFeverCertificate: '',
      japaneseEncephalitisVaccine: '',
      japaneseEncephalitisDate: '',
      tickBorneEncephalitisVaccine: '',
      tickBorneEncephalitisDate: '',
      choleraVaccine: '',
      choleraVaccineDate: '',
      meningococcalACWYTravel: '',
      meningococcalACWYTravelDate: '',
      malariaProphylaxis: '',
      malariaProphylaxisDrug: '',
      notes: ''
    },
    covid19Vaccination: {
      covidPrimaryCourse: '',
      covidPrimaryVaccineType: '',
      covidDose1Date: '',
      covidDose2Date: '',
      covidBooster1: '',
      covidBooster1Date: '',
      covidBooster1Type: '',
      covidBooster2: '',
      covidBooster2Date: '',
      covidBooster2Type: '',
      covidAutumnBooster: '',
      covidAutumnBoosterDate: '',
      totalCovidDoses: null,
      covidAdverseReaction: '',
      covidAdverseReactionDetails: '',
      notes: ''
    },
    influenzaVaccination: {
      fluVaccineCurrentSeason: '',
      fluVaccineCurrentDate: '',
      fluVaccineType: '',
      fluVaccinePreviousSeason: '',
      fluVaccineAnnualRecipient: '',
      fluHighRiskGroup: '',
      fluHighRiskReason: '',
      fluAdverseReaction: '',
      fluAdverseReactionDetails: '',
      notes: ''
    },
    contraindicationsAllergies: {
      eggAllergy: '',
      eggAllergySeverity: '',
      gelatinAllergy: '',
      neomycinAllergy: '',
      latexAllergy: '',
      yeastAllergy: '',
      pegPolysorbateAllergy: '',
      otherVaccineAllergies: '',
      historyOfGBS: '',
      gbsDetails: '',
      onImmunosuppressants: '',
      immunosuppressantDetails: '',
      onBloodProductsRecent: '',
      bloodProductsDetails: '',
      liveVaccineContraindicated: '',
      liveVaccineContraindicationReason: '',
      notes: ''
    },
    serologyImmunityTesting: {
      hepBSurfaceAntibody: '',
      hepBSurfaceAntibodyLevel: null,
      hepBSurfaceAntibodyDate: '',
      varicellaIgG: '',
      varicellaIgGDate: '',
      measlesIgG: '',
      measlesIgGDate: '',
      rubellaIgG: '',
      rubellaIgGDate: '',
      mumpsIgG: '',
      mumpsIgGDate: '',
      hepAIgG: '',
      hepAIgGDate: '',
      tetanusAntibody: '',
      tetanusAntibodyDate: '',
      tbIGRAResult: '',
      tbIGRADate: '',
      mantouxResult: '',
      mantouxIndurationMm: null,
      notes: ''
    },
    scheduleCompliance: {
      complianceStatus: '',
      vaccinesDue: '',
      vaccinesOverdue: '',
      catchUpPlanRequired: '',
      catchUpPlanDetails: '',
      nextVaccinationDate: '',
      nextVaccinationType: '',
      occupationalHealthClearance: '',
      occupationalHealthClearanceDate: '',
      exposureRiskLevel: '',
      activeExposureIncident: '',
      activeExposureDetails: '',
      consentForVaccination: '',
      consentDate: '',
      notes: ''
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

/** Friendly label for a ComplianceStatus. */
function complianceStatusLabel(status) {
  switch (status) {
    case 'fully-immunised':     return 'Fully Immunised';
    case 'partially-immunised': return 'Partially Immunised';
    case 'non-compliant':       return 'Non-Compliant';
    case 'contraindicated':     return 'Contraindicated';
    default: return '';
  }
}

/** CSS modifier for the compliance badge. */
function complianceStatusClass(status) {
  switch (status) {
    case 'fully-immunised':     return 'compliant';
    case 'partially-immunised': return 'partial';
    case 'non-compliant':       return 'non-compliant';
    case 'contraindicated':     return 'contraindicated';
    default: return '';
  }
}

/** Friendly label for a RiskLevel. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low':      return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high':     return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** CSS modifier for the risk badge. */
function riskLevelClass(risk) {
  return risk ? `risk-${risk}` : '';
}

/** Grade -> label. */
function gradeLabel(grade) {
  switch (grade) {
    case 1: return 'Low';
    case 2: return 'Moderate';
    case 3: return 'Significant';
    case 4: return 'Critical';
    default: return `Grade ${grade}`;
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, complianceStatusLabel, complianceStatusClass, riskLevelLabel, riskLevelClass, gradeLabel };
