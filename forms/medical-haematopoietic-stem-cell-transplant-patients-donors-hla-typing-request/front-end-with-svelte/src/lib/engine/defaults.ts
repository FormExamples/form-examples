import type { HsctTypingRequest } from './types';

/**
 * Build a fresh, fully-blank HSCT HLA typing request. Strings default to
 * `''`; volumes and counts default to `null` (unanswered is not the same as
 * none); booleans default to `false`. Ported verbatim from the HTML
 * front-end's `emptyRequest()` source of truth.
 */
export function createDefaultRequest(): HsctTypingRequest {
  return {
    subject: {
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
    request: {
      subjectRole: '',
      donorType: '',
      hlaTypingResolution: '',
      clinicalDetails: ''
    },
    recipient: {
      recipientFamilyName: '',
      recipientGivenNames: '',
      recipientMedicalRecordNumber: '',
      recipientBirthDate: '',
      relationshipToRecipient: ''
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: ''
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
      edtaPurpleVolumeMl: null,
      edtaPinkVolumeMl: null,
      clottedRedVolumeMl: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratoryRecipientIdentifier: '',
      laboratoryDonorIdentifier: '',
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}
