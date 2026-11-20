import type { DeathCertificate } from './types.js';

/**
 * A blank US Standard Certificate of Death with all fields at their unanswered
 * defaults: '' for text and enum fields, null for numeric, date and time fields.
 * Lives in the engine (not the store) so tests and sample data can import it
 * without pulling in `$app/env`.
 */
export function createDefaultCertificate(): DeathCertificate {
  return {
    jurisdiction: { state: '' },
    decedent: {
      decedentName: '',
      sex: '',
      dateOfBirth: null,
      ageYears: null,
      maritalStatus: '',
      veteranStatus: '',
      stateOfResidence: ''
    },
    death: {
      placeOfDeathType: '',
      placeOfDeathFacility: '',
      dateOfDeath: null,
      timeOfDeath: null
    },
    certifier: {
      certifierName: '',
      certifierType: '',
      certifierLicenseNumber: '',
      certificationDate: null,
      attendedDeceased: '',
      lastSeenAliveDate: null
    },
    partI: {
      causeIaCondition: '',
      causeIaInterval: '',
      causeIbCondition: '',
      causeIbInterval: '',
      causeIcCondition: '',
      causeIcInterval: '',
      causeIdCondition: '',
      causeIdInterval: ''
    },
    partII: {
      partIiConditions: '',
      autopsyPerformed: '',
      autopsyFindingsAvailable: ''
    },
    manner: {
      mannerOfDeath: '',
      tobaccoUseContributed: '',
      pregnancyStatus: ''
    },
    injury: {
      injuryDate: null,
      injuryTime: null,
      injuryPlace: '',
      injuryAtWork: '',
      injuryLocation: '',
      injuryDescription: '',
      transportationInjuryRole: ''
    },
    referral: {
      referredToMedicalExaminer: '',
      referralReason: '',
      certifierNote: ''
    },
    funeral: {
      funeralDirectorName: '',
      funeralDirectorLicenseNumber: '',
      dispositionMethod: '',
      dispositionDate: null,
      dispositionPlace: '',
      filedDate: null
    },
    copies: {
      certifiedCopiesRequested: null,
      requesterRelationship: '',
      requesterIdentityVerified: '',
      feePaidInUsd: null
    }
  };
}
