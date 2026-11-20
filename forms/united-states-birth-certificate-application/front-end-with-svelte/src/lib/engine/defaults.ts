import type { BirthCertificateApplication } from './types';

/** A blank application with all fields at their unanswered defaults. */
export function createDefaultApplication(): BirthCertificateApplication {
  return {
    applicant: {
      applicantName: '',
      dateOfBirth: null,
      email: '',
      phone: '',
      postalAddress: ''
    },
    registrant: {
      registrantName: '',
      sex: '',
      dateOfBirth: null,
      placeOfBirth: '',
      countyOfBirth: '',
      state: '',
      birthFacility: '',
      motherNameBeforeFirstMarriage: '',
      fatherName: '',
      deceased: '',
      adopted: ''
    },
    purpose: {
      relationship: '',
      purpose: '',
      needsApostille: '',
      apostilleCountry: ''
    },
    order: {
      certificateType: '',
      copies: null,
      deliveryMethod: '',
      feeEnclosedUsd: null
    },
    evidence: {
      idType: '',
      idUnexpired: '',
      proofOfRelationship: '',
      authorityDocument: '',
      notarizedSwornStatement: ''
    },
    declaration: {
      declarationSigned: '',
      applicationNote: ''
    }
  };
}
