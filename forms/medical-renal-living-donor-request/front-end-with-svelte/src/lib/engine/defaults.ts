import type { RenalLivingDonorRequest } from './types';

/**
 * Build a fresh, fully-blank renal living donor request. Strings default to
 * `''`; counts default to `null` (unanswered is not the same as none);
 * booleans default to `false`. Ported verbatim from the HTML front-end's
 * `emptyRequest()` source of truth.
 */
export function createDefaultRequest(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: '',
      givenNames: '',
      previousName: '',
      birthDate: '',
      sex: '',
      nationalHealthIdentifier: '',
      medicalRecordNumber: '',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: '',
      givenNames: '',
      previousName: '',
      birthDate: '',
      sex: '',
      nationalHealthIdentifier: '',
      medicalRecordNumber: '',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: '',
      relationshipOfDonorToRecipient: '',
      recipientTransplantCentreName: '',
      donorAboGroup: '',
      recipientAboGroup: ''
    },
    tests: {
      livingDonorFullCrossmatch: false,
      livingDonorVirtualCrossmatch: false,
      livingDonorMatchGrade: false,
      altruisticDonor: false,
      dayOfTransplantSamples: false,
      aboTitresOnly: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      clinicianName: '',
      clinicianRole: '',
      clinicianEmail: '',
      transplantCentreName: '',
      requestedBySignedAt: '',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: '',
      sampleCollectedAt: '',
      identifiersOnSampleCount: null,
      identifiersOnFormCount: null,
      sampleAndFormDetailsMatch: false,
      samplesEdtaPurpleCount: null,
      samplesEdtaPinkHandLabelledCount: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratoryDonorIdentifier: '',
      laboratoryRecipientIdentifier: '',
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}
