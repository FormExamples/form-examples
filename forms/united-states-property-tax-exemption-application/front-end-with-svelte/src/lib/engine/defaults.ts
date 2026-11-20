import type { PropertyTaxApplication } from './types.js';

/** A blank application with every field at its unanswered default. */
export function createDefaultApplication(): PropertyTaxApplication {
  return {
    applicant: {
      applicantName: '',
      dateOfBirth: null,
      ageOnAssessmentDate: null,
      mailingAddress: ''
    },
    property: {
      state: '',
      county: '',
      parcelNumber: '',
      propertyAddress: '',
      propertyType: '',
      ownershipType: '',
      ownerOnAssessmentDate: '',
      occupiedAsPrimaryResidence: '',
      occupancyStartDate: null,
      otherHomesteadClaimed: ''
    },
    exemptions: {
      claimHomestead: '',
      claimSenior: '',
      claimDisability: '',
      claimVeteran: '',
      claimCircuitBreaker: '',
      veteranDisabilityPercent: null
    },
    income: { householdIncomeDollars: null, incomeTaxYear: null },
    documents: {
      proofOfOwnership: '',
      proofOfResidency: '',
      proofOfAge: '',
      proofOfIncome: '',
      proofOfDisability: ''
    },
    filing: { assessmentYear: null, filingDate: null, applicationType: '' },
    appeal: { appealRequested: '', noticeOfValueDate: null, appealFiled: '' },
    declaration: { penaltyAcknowledged: '', signedByApplicant: '', signatureDate: null }
  };
}
