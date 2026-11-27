import type { HlaAssociationRequest } from './types';

/**
 * Build a fresh, fully-blank HLA disease association request. Strings default
 * to `''`; counts default to `null` (unanswered is not the same as none);
 * booleans default to `false`. Ported verbatim from the HTML front-end's
 * `emptyRequest()` source of truth.
 */
export function createDefaultRequest(): HlaAssociationRequest {
  return {
    patient: {
      familyName: '',
      givenNames: '',
      previousName: '',
      birthDate: '',
      sex: '',
      ethnicity: '',
      nationalHealthIdentifier: '',
      medicalRecordNumber: '',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: '',
      clinicianRole: '',
      clinicianEmail: '',
      department: '',
      organization: '',
      copyOfReportTo: '',
      reportEmail: ''
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: '',
      clinicalDetails: '',
      plannedDrug: '',
      previousHlaTypingKnown: false
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: false,
      highRiskDescription: ''
    },
    requester: {
      requestedBySignedAt: '',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: '',
      sampleCollectedAt: '',
      identifiersOnSampleCount: null,
      identifiersOnFormCount: null,
      sampleAndFormDetailsMatch: false,
      sampleVolumeMl: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}
