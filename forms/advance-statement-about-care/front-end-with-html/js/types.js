// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Advance Statement About Care
// form.
//
// This file builds and exports the canonical empty StatementData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'home' | 'hospital' | 'hospice' | 'care-home' | 'no-preference' | ''} PlaceOfCare
 * @typedef {'incomplete' | 'partial' | 'complete' | 'verified'} CompletenessLevel
 */

/**
 * @typedef {Object} PersonalInformation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 * @property {string} address
 * @property {string} postcode
 * @property {string} telephone
 * @property {string} email
 * @property {string} gpName
 * @property {string} gpPractice
 * @property {string} gpTelephone
 */

/**
 * @typedef {Object} StatementContext
 * @property {string} reasonForStatement
 * @property {string} currentDiagnosis
 * @property {string} understandingOfCondition
 * @property {string} whenStatementShouldApply
 * @property {YesNo} previousAdvanceStatements
 * @property {string} previousStatementDetails
 */

/**
 * @typedef {Object} ValuesBeliefs
 * @property {string} religiousBeliefs
 * @property {string} spiritualBeliefs
 * @property {string} culturalValues
 * @property {string} qualityOfLifePriorities
 * @property {string} whatMakesLifeMeaningful
 * @property {string} importantTraditions
 * @property {string} viewsOnDying
 */

/**
 * @typedef {Object} CarePreferences
 * @property {PlaceOfCare} preferredPlaceOfCare
 * @property {PlaceOfCare} preferredPlaceOfDeath
 * @property {string} personalComfortPreferences
 * @property {string} dailyRoutinePreferences
 * @property {string} dietaryRequirements
 * @property {string} clothingPreferences
 * @property {string} hygienePreferences
 * @property {string} environmentPreferences
 */

/**
 * @typedef {Object} MedicalTreatmentWishes
 * @property {string} painManagementPreferences
 * @property {string} nutritionHydrationWishes
 * @property {string} ventilationWishes
 * @property {string} resuscitationWishes
 * @property {string} antibioticsWishes
 * @property {string} hospitalisationWishes
 * @property {string} bloodTransfusionWishes
 * @property {string} organDonationWishes
 */

/**
 * @typedef {Object} CommunicationPreferences
 * @property {string} preferredLanguage
 * @property {string} communicationAids
 * @property {string} howToBeAddressed
 * @property {string} informationSharingPreferences
 * @property {YesNo} interpreterNeeded
 * @property {string} interpreterLanguage
 */

/**
 * @typedef {Object} PersonImportantToMe
 * @property {string} name
 * @property {string} relationship
 * @property {string} telephone
 * @property {string} email
 * @property {string} role
 */

/**
 * @typedef {Object} PeopleImportantToMe
 * @property {PersonImportantToMe[]} people
 * @property {string} petsDetails
 * @property {string} petCareArrangements
 */

/**
 * @typedef {Object} PracticalMatters
 * @property {string} financialArrangements
 * @property {string} propertyMatters
 * @property {string} petCareInstructions
 * @property {string} socialMediaWishes
 * @property {string} personalBelongings
 * @property {string} funeralWishes
 * @property {string} willDetails
 * @property {string} powerOfAttorneyDetails
 */

/**
 * @typedef {Object} SignaturesWitnesses
 * @property {string} patientSignature
 * @property {string} patientSignatureDate
 * @property {string} witnessName
 * @property {string} witnessAddress
 * @property {string} witnessSignature
 * @property {string} witnessSignatureDate
 * @property {string} reviewDate
 * @property {string} healthcareProfessionalName
 * @property {string} healthcareProfessionalRole
 * @property {string} healthcareProfessionalSignature
 * @property {string} healthcareProfessionalDate
 */

/**
 * @typedef {Object} StatementData
 * @property {PersonalInformation} personalInformation
 * @property {StatementContext} statementContext
 * @property {ValuesBeliefs} valuesBeliefs
 * @property {CarePreferences} carePreferences
 * @property {MedicalTreatmentWishes} medicalTreatmentWishes
 * @property {CommunicationPreferences} communicationPreferences
 * @property {PeopleImportantToMe} peopleImportantToMe
 * @property {PracticalMatters} practicalMatters
 * @property {SignaturesWitnesses} signaturesWitnesses
 */

/**
 * @typedef {Object} MissingSection
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {boolean} required
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} CompletenessResult
 * @property {CompletenessLevel} level
 * @property {MissingSection[]} missingSections
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {number} completedCount
 * @property {number} totalCount
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AdvanceStatementAboutCare`.
(function () {
'use strict';
window.AdvanceStatementAboutCare = window.AdvanceStatementAboutCare || {};

/**
 * Build a fresh, fully-blank statement.
 * Strings default to `''`; lists default to `[]`.
 * @returns {StatementData}
 */
function emptyStatement() {
  return {
    personalInformation: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nhsNumber: '',
      address: '',
      postcode: '',
      telephone: '',
      email: '',
      gpName: '',
      gpPractice: '',
      gpTelephone: ''
    },
    statementContext: {
      reasonForStatement: '',
      currentDiagnosis: '',
      understandingOfCondition: '',
      whenStatementShouldApply: '',
      previousAdvanceStatements: '',
      previousStatementDetails: ''
    },
    valuesBeliefs: {
      religiousBeliefs: '',
      spiritualBeliefs: '',
      culturalValues: '',
      qualityOfLifePriorities: '',
      whatMakesLifeMeaningful: '',
      importantTraditions: '',
      viewsOnDying: ''
    },
    carePreferences: {
      preferredPlaceOfCare: '',
      preferredPlaceOfDeath: '',
      personalComfortPreferences: '',
      dailyRoutinePreferences: '',
      dietaryRequirements: '',
      clothingPreferences: '',
      hygienePreferences: '',
      environmentPreferences: ''
    },
    medicalTreatmentWishes: {
      painManagementPreferences: '',
      nutritionHydrationWishes: '',
      ventilationWishes: '',
      resuscitationWishes: '',
      antibioticsWishes: '',
      hospitalisationWishes: '',
      bloodTransfusionWishes: '',
      organDonationWishes: ''
    },
    communicationPreferences: {
      preferredLanguage: '',
      communicationAids: '',
      howToBeAddressed: '',
      informationSharingPreferences: '',
      interpreterNeeded: '',
      interpreterLanguage: ''
    },
    peopleImportantToMe: {
      people: [],
      petsDetails: '',
      petCareArrangements: ''
    },
    practicalMatters: {
      financialArrangements: '',
      propertyMatters: '',
      petCareInstructions: '',
      socialMediaWishes: '',
      personalBelongings: '',
      funeralWishes: '',
      willDetails: '',
      powerOfAttorneyDetails: ''
    },
    signaturesWitnesses: {
      patientSignature: '',
      patientSignatureDate: '',
      witnessName: '',
      witnessAddress: '',
      witnessSignature: '',
      witnessSignatureDate: '',
      reviewDate: '',
      healthcareProfessionalName: '',
      healthcareProfessionalRole: '',
      healthcareProfessionalSignature: '',
      healthcareProfessionalDate: ''
    }
  };
}

/** Friendly label for a CompletenessLevel. */
function completenessLevelLabel(level) {
  switch (level) {
    case 'incomplete': return 'Incomplete';
    case 'partial': return 'Partial';
    case 'complete': return 'Complete';
    case 'verified': return 'Verified';
    default: return String(level || '');
  }
}

/** CSS class hint for the completeness level badge. */
function completenessLevelClass(level) {
  switch (level) {
    case 'incomplete': return 'level-incomplete';
    case 'partial': return 'level-partial';
    case 'complete': return 'level-complete';
    case 'verified': return 'level-verified';
    default: return '';
  }
}

/** Place of care/death label. */
function placeLabel(place) {
  switch (place) {
    case 'home': return 'Home';
    case 'hospital': return 'Hospital';
    case 'hospice': return 'Hospice';
    case 'care-home': return 'Care Home';
    case 'no-preference': return 'No Preference';
    default: return place || 'Not specified';
  }
}

Object.assign(window.AdvanceStatementAboutCare, {
  emptyStatement,
  completenessLevelLabel,
  completenessLevelClass,
  placeLabel
});
})();
