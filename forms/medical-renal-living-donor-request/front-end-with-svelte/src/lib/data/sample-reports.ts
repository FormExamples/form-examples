import type {
  AppropriatenessBand,
  DonationPathway,
  IdentitySafetyBand,
  Recommendation,
  RenalLivingDonorRequest,
  TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { selectedTests } from '#lib/engine/tests.js';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  requestedDate: string;
  data: RenalLivingDonorRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  requestedDate: string;
  donationPathway: DonationPathway;
  testCount: number;
  appropriatenessScore: number;
  appropriatenessBand: AppropriatenessBand;
  identitySafetyBand: IdentitySafetyBand;
  completenessPercent: number;
  triageTier: TriageTier;
  recommendation: Recommendation;
  flagCount: number;
}

// Fictitious donors, one per persona in ../../../examples/personas.json.
// The states below are the persona states; the dashboard rows are computed from
// them by the shared engine, so the dashboard and the persona oracle cannot
// disagree.

/** Well-formed directed donation with a full crossmatch: donor O to recipient A (compatible), three or more identifiers matching, hand-labelled tube sent, consent confirmed. Expect usually-appropriate, ok, routine, accept. */
function directedFullCrossmatchComplete(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: 'Aldridge',
      givenNames: 'Peter',
      previousName: '',
      birthDate: '1972-11-20',
      sex: 'male',
      nationalHealthIdentifier: '900 000 1002',
      medicalRecordNumber: 'R100201',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: 'directed',
      relationshipOfDonorToRecipient: 'Spouse',
      recipientTransplantCentreName: '',
      donorAboGroup: 'o',
      recipientAboGroup: 'a'
    },
    tests: {
      livingDonorFullCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
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
      samplesEdtaPurpleCount: 2,
      samplesEdtaPinkHandLabelledCount: 1,
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

/** Day-of-transplant samples for a directed donation. Expect stat triage and the day-of-transplant sample tubes. */
function dayOfTransplantStat(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: 'Aldridge',
      givenNames: 'Peter',
      previousName: '',
      birthDate: '1972-11-20',
      sex: 'male',
      nationalHealthIdentifier: '900 000 1002',
      medicalRecordNumber: 'R100201',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: 'directed',
      relationshipOfDonorToRecipient: 'Spouse',
      recipientTransplantCentreName: '',
      donorAboGroup: 'o',
      recipientAboGroup: 'a'
    },
    tests: {
      livingDonorFullCrossmatch: false,
      livingDonorVirtualCrossmatch: false,
      livingDonorMatchGrade: false,
      altruisticDonor: false,
      dayOfTransplantSamples: true,
      aboTitresOnly: false,
      redCellAntibodyFollowUp: false,
      testDetail: '',
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
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
      samplesEdtaPurpleCount: 2,
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

/** Altruistic donor with a full crossmatch requested: there is no recipient to crossmatch. Expect usually-not-appropriate and query-referrer. */
function altruisticDonorWithCrossmatch(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
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
      donationPathway: 'altruistic',
      relationshipOfDonorToRecipient: '',
      recipientTransplantCentreName: '',
      donorAboGroup: 'o',
      recipientAboGroup: ''
    },
    tests: {
      livingDonorFullCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
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
      samplesEdtaPurpleCount: 2,
      samplesEdtaPinkHandLabelledCount: 1,
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

/** Virtual crossmatch for a directed donation where the recipient ABO group is not recorded. Expect may-be-appropriate and the virtual-crossmatch flag. */
function virtualCrossmatchRecipientAboUnknown(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: 'Aldridge',
      givenNames: 'Peter',
      previousName: '',
      birthDate: '1972-11-20',
      sex: 'male',
      nationalHealthIdentifier: '900 000 1002',
      medicalRecordNumber: 'R100201',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: 'directed',
      relationshipOfDonorToRecipient: 'Spouse',
      recipientTransplantCentreName: '',
      donorAboGroup: 'o',
      recipientAboGroup: 'unknown'
    },
    tests: {
      livingDonorFullCrossmatch: false,
      livingDonorVirtualCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
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
      samplesEdtaPurpleCount: 2,
      samplesEdtaPinkHandLabelledCount: 1,
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

/** Donor A with recipient O (ABO-incompatible) and a full crossmatch but no ABO titres. Expect may-be-appropriate and the ABO-incompatible flag. */
function aboIncompatibleWithoutTitres(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: 'Aldridge',
      givenNames: 'Peter',
      previousName: '',
      birthDate: '1972-11-20',
      sex: 'male',
      nationalHealthIdentifier: '900 000 1002',
      medicalRecordNumber: 'R100201',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: 'directed',
      relationshipOfDonorToRecipient: 'Spouse',
      recipientTransplantCentreName: '',
      donorAboGroup: 'a',
      recipientAboGroup: 'o'
    },
    tests: {
      livingDonorFullCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
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
      samplesEdtaPurpleCount: 2,
      samplesEdtaPinkHandLabelledCount: 1,
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

/** Only two identifiers on the sample label. Expect reject-risk identity band and a reject recommendation. */
function tooFewIdentifiersReject(): RenalLivingDonorRequest {
  return {
    donor: {
      familyName: 'Aldridge',
      givenNames: 'Maria',
      previousName: '',
      birthDate: '1975-06-02',
      sex: 'female',
      nationalHealthIdentifier: '900 000 1001',
      medicalRecordNumber: 'D100200',
      address: '',
      postcode: ''
    },
    recipient: {
      familyName: 'Aldridge',
      givenNames: 'Peter',
      previousName: '',
      birthDate: '1972-11-20',
      sex: 'male',
      nationalHealthIdentifier: '900 000 1002',
      medicalRecordNumber: 'R100201',
      address: '',
      postcode: ''
    },
    pathway: {
      donationPathway: 'directed',
      relationshipOfDonorToRecipient: 'Spouse',
      recipientTransplantCentreName: '',
      donorAboGroup: 'o',
      recipientAboGroup: 'a'
    },
    tests: {
      livingDonorFullCrossmatch: true,
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
      clinicianName: 'Dr P Anand',
      clinicianRole: 'transplant-coordinator',
      clinicianEmail: 'p.anand@example.org',
      transplantCentreName: 'Example Transplant Centre',
      requestedBySignedAt: '2026-09-01T10:00',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'Nurse A Patel',
      sampleCollectedAt: '2026-09-01T09:30',
      identifiersOnSampleCount: 2,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      samplesEdtaPurpleCount: 2,
      samplesEdtaPinkHandLabelledCount: 1,
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

/** The sample requests behind the dashboard. */
export const sampleAssessments: SampleAssessment[] = [
  {
    id: 'LD-2026-0001',
    patientName: 'Aldridge, Maria',
    requestedDate: '2026-09-01',
    data: directedFullCrossmatchComplete()
  },
  {
    id: 'LD-2026-0002',
    patientName: 'Brennan, Thomas',
    requestedDate: '2026-09-01',
    data: dayOfTransplantStat()
  },
  {
    id: 'LD-2026-0003',
    patientName: 'Castellano, Livia',
    requestedDate: '2026-09-01',
    data: altruisticDonorWithCrossmatch()
  },
  {
    id: 'LD-2026-0004',
    patientName: 'Dhillon, Arjun',
    requestedDate: '2026-09-01',
    data: virtualCrossmatchRecipientAboUnknown()
  },
  {
    id: 'LD-2026-0005',
    patientName: 'Eriksen, Sofie',
    requestedDate: '2026-09-01',
    data: aboIncompatibleWithoutTitres()
  },
  {
    id: 'LD-2026-0006',
    patientName: 'Fofanah, Idris',
    requestedDate: '2026-09-01',
    data: tooFewIdentifiersReject()
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const g = calculateGrade(s.data);
  return {
    id: s.id,
    patientName: s.patientName,
    requestedDate: s.requestedDate,
    donationPathway: s.data.pathway.donationPathway,
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
