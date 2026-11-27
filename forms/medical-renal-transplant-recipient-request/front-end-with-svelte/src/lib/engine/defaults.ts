import type { RenalRecipientRequest } from './types';

/**
 * Build a fresh, fully-blank renal transplant recipient request. Strings
 * default to `''`; counts default to `null` (unanswered is not the same as
 * none); booleans default to `false`. Ported verbatim from the HTML
 * front-end's `emptyRequest()` source of truth.
 */
export function createDefaultRequest(): RenalRecipientRequest {
  return {
    recipient: {
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
    history: {
      organRequired: '',
      previousTransplantCount: null,
      previousTransplantDates: '',
      transfusionCount: null,
      transfusionDates: '',
      pregnancyCount: null,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: '',
      dialysisMode: '',
      dialysisUnitName: ''
    },
    tests: {
      listRegistrationFirstTypingAndRetyping: false,
      listRegistrationReturningToList: false,
      listRegistrationOther: false,
      deceasedDonorFullCrossmatch: false,
      deceasedDonorDayOfTransplant: false,
      livingDonorFullCrossmatch: false,
      livingDonorDayOfTransplant: false,
      livingDonorVirtualCrossmatch: false,
      livingDonorMatchGrade: false,
      livingDonorAboTitresOnly: false,
      autologousCrossmatch: false,
      hlaMonitoringRoutineTransplantList: false,
      hlaMonitoringRoutinePostTransplant: false,
      hlaMonitoringPostTransfusion: false,
      hlaRejectionInvestigation: false,
      aboIncompatibleMonitoring: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: '',
      dfppStatus: '',
      postTransfusionDatesAndNumber: '',
      donorReference: ''
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
      samplesSerumCount: null
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
