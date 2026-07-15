// Plain-JavaScript / JSDoc type definitions for the Blood Donation
// Assessment form, mirroring the SvelteKit reference data model.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'whole-blood' | 'plasma' | 'platelets' | 'red-cells' | ''} DonationType
 * @typedef {'first-time' | 'regular' | 'lapsed' | ''} DonorType
 */

/**
 * @typedef {Object} DonorDemographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight       Kilograms
 * @property {number | null} height       Centimetres
 * @property {DonorType} donorType
 * @property {string} lastDonationDate
 */

/**
 * @typedef {Object} GeneralHealth
 * @property {YesNo} feelingWellToday
 * @property {YesNo} adequateSleep
 * @property {YesNo} adequateMealAndFluids
 * @property {YesNo} feelingFaintOrUnwell
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} reason
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} heartOrCirculatoryDisease
 * @property {YesNo} cancer
 * @property {YesNo} bleedingOrClottingDisorder
 * @property {YesNo} diabetesOnInsulin
 * @property {YesNo} epilepsyOrSeizures
 * @property {YesNo} hivPositive
 * @property {YesNo} hepatitisBOrC
 * @property {YesNo} htlv
 * @property {YesNo} cjdFamilyHistory
 * @property {YesNo} receivedPituitaryHormone
 * @property {YesNo} receivedDuraMaterGraft
 * @property {Medication[]} currentMedications
 */

/**
 * @typedef {Object} RecentIllness
 * @property {YesNo} feverPastTwoWeeks
 * @property {YesNo} infectionPastTwoWeeks
 * @property {YesNo} antibioticsPastSevenDays
 * @property {YesNo} dentalWorkPastWeek
 * @property {YesNo} surgeryPastSixMonths
 * @property {YesNo} covidPositivePastTwentyEightDays
 * @property {YesNo} vaccinationPastFourWeeks
 * @property {string} vaccinationDetails
 */

/**
 * @typedef {Object} TravelEntry
 * @property {string} country
 * @property {string} returnDate
 * @property {string} duration
 */

/**
 * @typedef {Object} TravelHistory
 * @property {TravelEntry[]} recentTravel
 * @property {YesNo} malariaAreaPastTwelveMonths
 * @property {YesNo} westNileVirusAreaPastTwentyEightDays
 * @property {YesNo} ukResidence1980To1996Over12Months
 * @property {YesNo} bloodTransfusionInUk
 */

/**
 * @typedef {Object} LifestyleRisk
 * @property {YesNo} ivDrugUseEver
 * @property {YesNo} sexWithIvDrugUser
 * @property {YesNo} sexInExchangePastTwelveMonths
 * @property {YesNo} sexWithNewPartnerPastThreeMonths
 * @property {YesNo} multipleSexualPartnersPastThreeMonths
 * @property {YesNo} tattooOrPiercingPastFourMonths
 * @property {YesNo} acupuncturePastFourMonths
 * @property {YesNo} bodyOrEarPiercingPastFourMonths
 * @property {YesNo} incarceratedPastTwelveMonths
 */

/**
 * @typedef {Object} PregnancyTransfusion
 * @property {YesNo} currentlyPregnant
 * @property {YesNo} pregnancyPastSixMonths
 * @property {YesNo} breastfeeding
 * @property {YesNo} receivedTransfusionEver
 * @property {string} lastTransfusionDate
 * @property {YesNo} receivedTransplantEver
 */

/**
 * @typedef {Object} VitalSigns
 * @property {number | null} hemoglobin       g/dL
 * @property {number | null} systolicBp       mmHg
 * @property {number | null} diastolicBp      mmHg
 * @property {number | null} pulseBpm
 * @property {number | null} temperatureCelsius
 */

/**
 * @typedef {Object} InformedConsent
 * @property {YesNo} understoodInformation
 * @property {YesNo} consentToDonate
 * @property {YesNo} consentToTesting
 * @property {YesNo} consentToContact
 */

/**
 * @typedef {Object} DonationPlan
 * @property {DonationType} plannedDonationType
 * @property {string} preferredDonationDate
 * @property {string} session
 * @property {string} notes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {DonorDemographics} donorDemographics
 * @property {GeneralHealth} generalHealth
 * @property {MedicalHistory} medicalHistory
 * @property {RecentIllness} recentIllness
 * @property {TravelHistory} travelHistory
 * @property {LifestyleRisk} lifestyleRisk
 * @property {PregnancyTransfusion} pregnancyTransfusion
 * @property {VitalSigns} vitalSigns
 * @property {InformedConsent} informedConsent
 * @property {DonationPlan} donationPlan
 */

/**
 * @typedef {'eligible' | 'temporarily-deferred' | 'permanently-deferred'} EligibilityStatus
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {EligibilityStatus} status
 * @property {string} [deferralWindow]
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {EligibilityStatus} eligibilityStatus
 * @property {string} deferralWindow
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    donorDemographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      donorType: '',
      lastDonationDate: ''
    },
    generalHealth: {
      feelingWellToday: '',
      adequateSleep: '',
      adequateMealAndFluids: '',
      feelingFaintOrUnwell: ''
    },
    medicalHistory: {
      heartOrCirculatoryDisease: '',
      cancer: '',
      bleedingOrClottingDisorder: '',
      diabetesOnInsulin: '',
      epilepsyOrSeizures: '',
      hivPositive: '',
      hepatitisBOrC: '',
      htlv: '',
      cjdFamilyHistory: '',
      receivedPituitaryHormone: '',
      receivedDuraMaterGraft: '',
      currentMedications: []
    },
    recentIllness: {
      feverPastTwoWeeks: '',
      infectionPastTwoWeeks: '',
      antibioticsPastSevenDays: '',
      dentalWorkPastWeek: '',
      surgeryPastSixMonths: '',
      covidPositivePastTwentyEightDays: '',
      vaccinationPastFourWeeks: '',
      vaccinationDetails: ''
    },
    travelHistory: {
      recentTravel: [],
      malariaAreaPastTwelveMonths: '',
      westNileVirusAreaPastTwentyEightDays: '',
      ukResidence1980To1996Over12Months: '',
      bloodTransfusionInUk: ''
    },
    lifestyleRisk: {
      ivDrugUseEver: '',
      sexWithIvDrugUser: '',
      sexInExchangePastTwelveMonths: '',
      sexWithNewPartnerPastThreeMonths: '',
      multipleSexualPartnersPastThreeMonths: '',
      tattooOrPiercingPastFourMonths: '',
      acupuncturePastFourMonths: '',
      bodyOrEarPiercingPastFourMonths: '',
      incarceratedPastTwelveMonths: ''
    },
    pregnancyTransfusion: {
      currentlyPregnant: '',
      pregnancyPastSixMonths: '',
      breastfeeding: '',
      receivedTransfusionEver: '',
      lastTransfusionDate: '',
      receivedTransplantEver: ''
    },
    vitalSigns: {
      hemoglobin: null,
      systolicBp: null,
      diastolicBp: null,
      pulseBpm: null,
      temperatureCelsius: null
    },
    informedConsent: {
      understoodInformation: '',
      consentToDonate: '',
      consentToTesting: '',
      consentToContact: ''
    },
    donationPlan: {
      plannedDonationType: '',
      preferredDonationDate: '',
      session: '',
      notes: ''
    }
  };
}

/**
 * Calculate age in years from an ISO date string. Returns null if invalid.
 * @param {string} dateOfBirth
 * @returns {number | null}
 */
function calculateAgeYears(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    years--;
  }
  return years;
}

/**
 * Friendly label for an EligibilityStatus.
 * @param {EligibilityStatus} status
 */
function eligibilityLabel(status) {
  switch (status) {
    case 'eligible': return 'Eligible to Donate';
    case 'temporarily-deferred': return 'Temporarily Deferred';
    case 'permanently-deferred': return 'Permanently Deferred';
    default: return '';
  }
}

/**
 * CSS class hint for the eligibility badge.
 * @param {EligibilityStatus} status
 */
function eligibilityClass(status) {
  switch (status) {
    case 'eligible': return 'status-eligible';
    case 'temporarily-deferred': return 'status-temporarily-deferred';
    case 'permanently-deferred': return 'status-permanently-deferred';
    default: return '';
  }
}

export { emptyAssessment, calculateAgeYears, eligibilityLabel, eligibilityClass };
