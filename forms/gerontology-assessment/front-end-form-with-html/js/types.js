// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Gerontology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | ''} Severity
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'independent' | 'with-family' | 'assisted-living' | 'nursing-home' | 'other' | ''} LivingSituation
 * @typedef {'independent' | 'needs-assistance' | 'dependent' | ''} ADLIndependence
 * @typedef {'normal' | 'mild-impairment' | 'moderate-impairment' | 'severe-impairment' | ''} CognitiveStatus
 * @typedef {'normal' | 'unsteady' | 'unable' | ''} GaitStatus
 * @typedef {'normal' | 'impaired' | 'severely-impaired' | ''} BalanceStatus
 * @typedef {'normal' | 'reduced' | 'poor' | ''} AppetiteStatus
 * @typedef {'good' | 'fair' | 'poor' | 'edentulous' | ''} DentalStatus
 * @typedef {'good' | 'fair' | 'poor' | ''} MedicationAdherence
 * @typedef {'normal' | 'mild' | 'moderate' | 'severe' | ''} DepressionScreenResult
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} SocialIsolationLevel
 * @typedef {'none' | 'stress' | 'urge' | 'mixed' | 'functional' | ''} IncontinenceType
 * @typedef {'none' | 'occasional' | 'frequent' | 'continuous' | ''} IncontinenceFrequency
 * @typedef {'intact' | 'impaired' | 'wound-present' | ''} SkinIntegrity
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GerontologyAssessment`.
(function () {
'use strict';
window.GerontologyAssessment = window.GerontologyAssessment || {};

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
      weight: null,
      height: null,
      bmi: null,
      livingSituation: ''
    },
    functionalAssessment: {
      bathingADL: '',
      dressingADL: '',
      toiletingADL: '',
      transferringADL: '',
      feedingADL: '',
      cookingIADL: '',
      cleaningIADL: '',
      shoppingIADL: '',
      financesIADL: '',
      medicationManagementIADL: ''
    },
    cognitiveScreen: {
      mmseScore: null,
      mocaScore: null,
      orientationIntact: '',
      memoryImpairment: '',
      executiveFunctionImpairment: '',
      deliriumRisk: '',
      cognitiveStatus: ''
    },
    mobilityFalls: {
      gaitAssessment: '',
      balanceAssessment: '',
      fallHistory: '',
      fallsLastYear: null,
      fearOfFalling: '',
      mobilityAids: '',
      mobilityAidType: '',
      timedUpAndGo: null
    },
    nutrition: {
      weightChangeLastSixMonths: '',
      weightChangeKg: null,
      weightChangeDirection: '',
      appetite: '',
      swallowingDifficulties: '',
      dentalStatus: '',
      mnaScore: null
    },
    polypharmacyReview: {
      numberOfMedications: null,
      highRiskMedications: '',
      highRiskMedicationDetails: '',
      beersCriteriaFlags: '',
      beersCriteriaDetails: '',
      medicationAdherence: ''
    },
    medications: [],
    comorbidities: {
      cardiovascularDisease: '',
      cardiovascularDetails: '',
      diabetes: '',
      diabetesControl: '',
      renalDisease: '',
      renalDetails: '',
      respiratoryDisease: '',
      respiratoryDetails: '',
      musculoskeletalDisease: '',
      musculoskeletalDetails: '',
      visualDeficit: '',
      hearingDeficit: ''
    },
    psychosocial: {
      depressionScreen: '',
      gds15Score: null,
      socialIsolation: '',
      hasCaregiver: '',
      caregiverDetails: '',
      advanceDirectives: '',
      advanceDirectiveDetails: ''
    },
    continenceSkin: {
      urinaryIncontinence: '',
      urinaryIncontinenceFrequency: '',
      faecalIncontinence: '',
      faecalIncontinenceFrequency: '',
      bradenScale: null,
      pressureInjuryPresent: '',
      pressureInjuryStage: '',
      skinIntegrity: ''
    }
  };
}

window.GerontologyAssessment.emptyAssessment = emptyAssessment;
})();
