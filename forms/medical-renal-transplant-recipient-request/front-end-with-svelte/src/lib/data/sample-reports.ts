import type {
  AppropriatenessBand,
  IdentitySafetyBand,
  Organ,
  Recommendation,
  RenalRecipientRequest,
  TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { selectedTests } from '#lib/engine/tests.js';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  requestedDate: string;
  data: RenalRecipientRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  requestedDate: string;
  organRequired: Organ;
  testCount: number;
  appropriatenessScore: number;
  appropriatenessBand: AppropriatenessBand;
  identitySafetyBand: IdentitySafetyBand;
  completenessPercent: number;
  triageTier: TriageTier;
  recommendation: Recommendation;
  flagCount: number;
}

// Fictitious recipients, one per persona in ../../../examples/personas.json.
// The states below are the persona states; the dashboard rows are computed from
// them by the shared engine, so the dashboard and the persona oracle cannot
// disagree.

/** Well-formed routine request: first typing and re-typing plus routine transplant-list antibody monitoring, sensitization history answered (none), ABO known, three or more identifiers matching, consent confirmed. Expect usually-appropriate, ok, routine, accept. */
function routineListRegistrationComplete(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Fenwick',
      givenNames: 'Harold',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney',
      previousTransplantCount: 0,
      previousTransplantDates: '',
      transfusionCount: 0,
      transfusionDates: '',
      pregnancyCount: 0,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: 'a',
      dialysisMode: 'unit-haemodialysis',
      dialysisUnitName: 'Unit 1'
    },
    tests: {
      listRegistrationFirstTypingAndRetyping: true,
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
      hlaMonitoringRoutineTransplantList: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 4,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** Deceased-donor day-of-transplant crossmatch for a previously transfused recipient: stat triage, day-of-transplant and sensitised flags. */
function dayOfTransplantStat(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Okonkwo',
      givenNames: 'Adaeze',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney',
      previousTransplantCount: 1,
      previousTransplantDates: '2019',
      transfusionCount: 2,
      transfusionDates: '2018',
      pregnancyCount: 0,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: 'o',
      dialysisMode: 'unit-haemodialysis',
      dialysisUnitName: ''
    },
    tests: {
      listRegistrationFirstTypingAndRetyping: false,
      listRegistrationReturningToList: false,
      listRegistrationOther: false,
      deceasedDonorFullCrossmatch: true,
      deceasedDonorDayOfTransplant: true,
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
      donorReference: 'D-4471'
    },
    requester: {
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 4,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** Living-donor virtual crossmatch with no HLA-antibody monitoring requested: appropriateness capped at may-be-appropriate with the virtual-crossmatch flag. */
function virtualCrossmatchWithoutAntibodyMonitoring(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Lindqvist',
      givenNames: 'Maja',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney-pancreas',
      previousTransplantCount: 0,
      previousTransplantDates: '',
      transfusionCount: 0,
      transfusionDates: '',
      pregnancyCount: 1,
      pregnancyDates: '2012'
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: 'b',
      dialysisMode: 'pre-dialysis',
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
      livingDonorVirtualCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 4,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** Rejection investigation for a recipient on haemodialysis with no transplant recorded: usually-not-appropriate, query the referrer. */
function rejectionInvestigationNoTransplant(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Haddad',
      givenNames: 'Samir',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney',
      previousTransplantCount: 0,
      previousTransplantDates: '',
      transfusionCount: 0,
      transfusionDates: '',
      pregnancyCount: 0,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: 'a',
      dialysisMode: 'unit-haemodialysis',
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
      hlaRejectionInvestigation: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 4,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** Sample labelled with only two identifiers, unknown ABO group and unanswered history: identity reject-risk, reject recommendation, urgent without a reason. */
function tooFewIdentifiersReject(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Whitcombe',
      givenNames: 'Eleanor',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney',
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
      recipientAboGroup: 'unknown',
      dialysisMode: 'capd',
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
      hlaMonitoringRoutinePostTransplant: true,
      hlaMonitoringPostTransfusion: false,
      hlaRejectionInvestigation: false,
      aboIncompatibleMonitoring: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: true,
      urgentTestingReason: '',
      dfppStatus: '',
      postTransfusionDatesAndNumber: '',
      donorReference: ''
    },
    requester: {
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 2,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: false,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** ABO-incompatible monitoring with no DFPP status for a failing-transplant recipient: appropriateness capped and the DFPP flag fires. */
function aboIncompatibleWithoutDfpp(): RenalRecipientRequest {
  return {
    recipient: {
      familyName: 'Tran',
      givenNames: 'Minh',
      previousName: '',
      birthDate: '1968-03-14',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0001',
      medicalRecordNumber: 'H123456',
      address: '',
      postcode: ''
    },
    history: {
      organRequired: 'kidney',
      previousTransplantCount: 1,
      previousTransplantDates: '',
      transfusionCount: 0,
      transfusionDates: '',
      pregnancyCount: 0,
      pregnancyDates: ''
    },
    clinical: {
      autoimmuneDisease: false,
      virologyRisk: false,
      immunosuppression: '',
      clinicalInformation: '',
      recipientAboGroup: 'o',
      dialysisMode: 'failing-transplant',
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
      aboIncompatibleMonitoring: true,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: '',
      dfppStatus: '',
      postTransfusionDatesAndNumber: '',
      donorReference: ''
    },
    requester: {
      clinicianName: 'Dr P Anand',
      clinicianRole: 'nephrologist',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 4,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 1,
      samplesEdtaPinkHandLabelledCount: 1,
      samplesSerumCount: 2
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

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
  {
    id: 'RN-2026-0001',
    patientName: 'Fenwick, Harold',
    requestedDate: '2026-09-01',
    data: routineListRegistrationComplete()
  },
  {
    id: 'RN-2026-0002',
    patientName: 'Okonkwo, Adaeze',
    requestedDate: '2026-09-01',
    data: dayOfTransplantStat()
  },
  {
    id: 'RN-2026-0003',
    patientName: 'Lindqvist, Maja',
    requestedDate: '2026-09-01',
    data: virtualCrossmatchWithoutAntibodyMonitoring()
  },
  {
    id: 'RN-2026-0004',
    patientName: 'Haddad, Samir',
    requestedDate: '2026-09-01',
    data: rejectionInvestigationNoTransplant()
  },
  {
    id: 'RN-2026-0005',
    patientName: 'Whitcombe, Eleanor',
    requestedDate: '2026-09-01',
    data: tooFewIdentifiersReject()
  },
  {
    id: 'RN-2026-0006',
    patientName: 'Tran, Minh',
    requestedDate: '2026-09-01',
    data: aboIncompatibleWithoutDfpp()
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const g = calculateGrade(s.data);
  return {
    id: s.id,
    patientName: s.patientName,
    requestedDate: s.requestedDate,
    organRequired: s.data.history.organRequired,
    testCount: selectedTests(s.data).length,
    appropriatenessScore: g.appropriatenessScore,
    appropriatenessBand: g.appropriatenessBand,
    identitySafetyBand: g.identitySafetyBand,
    completenessPercent: g.completenessPercent,
    triageTier: g.triageTier,
    recommendation: g.recommendation,
    flagCount: g.flags.length
  };
});
