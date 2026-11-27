import type {
  AppropriatenessBand,
  HsctTypingRequest,
  IdentitySafetyBand,
  SubjectRole,
  Recommendation,
  TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  requestedDate: string;
  data: HsctTypingRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  requestedDate: string;
  role: SubjectRole;
  appropriatenessScore: number;
  appropriatenessBand: AppropriatenessBand;
  identitySafetyBand: IdentitySafetyBand;
  completenessPercent: number;
  triageTier: TriageTier;
  recommendation: Recommendation;
  flagCount: number;
}

// Fictitious people, one per persona in ../../../examples/personas.json.
// The states below are the persona states; the dashboard rows are computed from
// them by the shared engine, so the dashboard and the persona oracle cannot
// disagree.

/** Well-formed routine request for an HSCT recipient: full volumes (18 + 6 + 6 mL), three or more matching identifiers, consent confirmed. Expect usually-appropriate, ok, routine, accept. */
function recipientComplete(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Tomas',
      previousName: '',
      birthDate: '1975-04-11',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0201',
      medicalRecordNumber: 'H201010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'hsct-recipient',
      donorType: '',
      hlaTypingResolution: 'high',
      clinicalDetails: 'Acute myeloid leukaemia in first remission; allogeneic HSCT planned.'
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 18,
      edtaPinkVolumeMl: 6,
      clottedRedVolumeMl: 6,
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

/** Potential donor (matched sibling) with the recipient named, relationship given and donor volumes (10 + 6 mL). Expect usually-appropriate, ok, routine, accept. */
function matchedSiblingDonorComplete(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Aoife',
      previousName: '',
      birthDate: '1978-09-23',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0202',
      medicalRecordNumber: 'H201011',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'potential-donor',
      donorType: 'matched-sibling',
      hlaTypingResolution: 'high',
      clinicalDetails:
        'Full sibling of a recipient with AML; HLA typing to assess donor suitability.'
    },
    recipient: {
      recipientFamilyName: 'Brennan',
      recipientGivenNames: 'Tomas',
      recipientMedicalRecordNumber: 'H201010',
      recipientBirthDate: '1975-04-11',
      relationshipToRecipient: 'Sister'
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 10,
      edtaPinkVolumeMl: 6,
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

/** Potential donor with no recipient details: the laboratory cannot pair the sample. Expect usually-not-appropriate (score 3), query-referrer, with the donor-without-recipient-details flag. */
function donorWithoutRecipient(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Aoife',
      previousName: '',
      birthDate: '1978-09-23',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0202',
      medicalRecordNumber: 'H201011',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'potential-donor',
      donorType: 'matched-sibling',
      hlaTypingResolution: 'high',
      clinicalDetails:
        'Full sibling of a recipient with AML; HLA typing to assess donor suitability.'
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 10,
      edtaPinkVolumeMl: 6,
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

/** Donor type unrelated volunteer, yet a relationship to the recipient is given. Expect may-be-appropriate (score 5), with the other flag. */
function unrelatedVolunteerWithRelationship(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Aoife',
      previousName: '',
      birthDate: '1978-09-23',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0202',
      medicalRecordNumber: 'H201011',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'potential-donor',
      donorType: 'unrelated-volunteer',
      hlaTypingResolution: 'high',
      clinicalDetails:
        'Full sibling of a recipient with AML; HLA typing to assess donor suitability.'
    },
    recipient: {
      recipientFamilyName: 'Brennan',
      recipientGivenNames: 'Tomas',
      recipientMedicalRecordNumber: 'H201010',
      recipientBirthDate: '1975-04-11',
      relationshipToRecipient: 'Sister'
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 10,
      edtaPinkVolumeMl: 6,
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

/** Urgent request with no reason, no clinical details and no ethnicity. Expect may-be-appropriate (score 5), urgent, query-referrer, with urgent-without-reason, no-clinical-details and missing-ethnicity flags. */
function urgentNoReasonNoDetails(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Tomas',
      previousName: '',
      birthDate: '1975-04-11',
      sex: 'male',
      ethnicity: '',
      nationalHealthIdentifier: '900 000 0201',
      medicalRecordNumber: 'H201010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'hsct-recipient',
      donorType: '',
      hlaTypingResolution: 'high',
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
      urgentTesting: true,
      urgentTestingReason: ''
    },
    requester: {
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 18,
      edtaPinkVolumeMl: 6,
      clottedRedVolumeMl: 6,
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

/** Recipient sample with the purple EDTA at 10 mL and no clotted tube, below the 18 mL and 6 mL required. Expect caution, query-referrer, with the sample-volume-insufficient flag. */
function insufficientVolumes(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Tomas',
      previousName: '',
      birthDate: '1975-04-11',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0201',
      medicalRecordNumber: 'H201010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'hsct-recipient',
      donorType: '',
      hlaTypingResolution: 'high',
      clinicalDetails: 'Acute myeloid leukaemia in first remission; allogeneic HSCT planned.'
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      edtaPurpleVolumeMl: 10,
      edtaPinkVolumeMl: 6,
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

/** Recipient sample whose label carries two identifiers, with form details not confirmed to match. Expect reject-risk, reject, with the identity-mismatch-risk flag. */
function tooFewIdentifiersReject(): HsctTypingRequest {
  return {
    subject: {
      familyName: 'Brennan',
      givenNames: 'Tomas',
      previousName: '',
      birthDate: '1975-04-11',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0201',
      medicalRecordNumber: 'H201010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr A Rahman',
      clinicianRole: 'haematologist',
      clinicianEmail: 'a.rahman@example.org',
      department: 'Haematology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'bmt.reports@example.org'
    },
    request: {
      subjectRole: 'hsct-recipient',
      donorType: '',
      hlaTypingResolution: 'high',
      clinicalDetails: 'Acute myeloid leukaemia in first remission; allogeneic HSCT planned.'
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 2,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: false,
      edtaPurpleVolumeMl: 18,
      edtaPinkVolumeMl: 6,
      clottedRedVolumeMl: 6,
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

/** The sample requests behind the dashboard and the report pages. */
export const sampleAssessments: SampleAssessment[] = [
  {
    id: 'HSCT-2026-000001',
    patientName: 'Brennan, Tomas',
    requestedDate: '2026-09-01',
    data: recipientComplete()
  },
  {
    id: 'HSCT-2026-000002',
    patientName: 'Brennan, Aoife',
    requestedDate: '2026-09-01',
    data: matchedSiblingDonorComplete()
  },
  {
    id: 'HSCT-2026-000003',
    patientName: 'Brennan, Aoife',
    requestedDate: '2026-09-01',
    data: donorWithoutRecipient()
  },
  {
    id: 'HSCT-2026-000004',
    patientName: 'Brennan, Aoife',
    requestedDate: '2026-09-01',
    data: unrelatedVolunteerWithRelationship()
  },
  {
    id: 'HSCT-2026-000005',
    patientName: 'Brennan, Tomas',
    requestedDate: '2026-09-01',
    data: urgentNoReasonNoDetails()
  },
  {
    id: 'HSCT-2026-000006',
    patientName: 'Brennan, Tomas',
    requestedDate: '2026-09-01',
    data: insufficientVolumes()
  },
  {
    id: 'HSCT-2026-000007',
    patientName: 'Brennan, Tomas',
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
    role: s.data.request.subjectRole,
    appropriatenessScore: g.appropriatenessScore,
    appropriatenessBand: g.appropriatenessBand,
    identitySafetyBand: g.identitySafetyBand,
    completenessPercent: g.completenessPercent,
    triageTier: g.triageTier,
    recommendation: g.recommendation,
    flagCount: g.flags.length
  };
});
