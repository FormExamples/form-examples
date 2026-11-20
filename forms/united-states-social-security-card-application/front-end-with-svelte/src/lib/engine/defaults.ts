import type { SocialSecurityApplication } from './types';

/** A blank Social Security card application with all fields at their unanswered defaults. */
export function createDefaultApplication(): SocialSecurityApplication {
  return {
    request: {
      applicationDate: null,
      requestType: '',
      channel: '',
      previouslyApplied: '',
      nameChange: '',
      nameChangeReason: '',
      dateOfBirthCorrection: '',
      replacementsThisYear: null,
      replacementsLifetime: null,
      limitExceptionReason: '',
      limitExceptionEvidence: ''
    },
    applicant: {
      nameOnCard: '',
      nameAtBirth: '',
      otherNamesUsed: '',
      nameOnMostRecentCard: '',
      dateOfBirth: null,
      placeOfBirthCity: '',
      placeOfBirthRegion: '',
      sex: '',
      citizenship: '',
      nonWorkReasonValid: '',
      motherNameAtBirth: '',
      fatherName: '',
      stateOfResidence: '',
      mailingAddress: '',
      phone: ''
    },
    evidence: {
      identityDocument: '',
      identityDocumentExpired: '',
      ageDocument: '',
      citizenshipDocument: '',
      citizenshipOnFile: '',
      nameChangeDocument: '',
      documentsOriginalOrCertified: ''
    },
    filer: {
      signerRelationship: '',
      signerName: '',
      signerIdentityDocument: '',
      signaturePresent: ''
    },
    tellSsa: {
      applicantDeceased: '',
      deathReportedToSsa: '',
      preparerNote: ''
    }
  };
}
