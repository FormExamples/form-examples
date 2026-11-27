import type {
  AppropriatenessBand,
  HlaAssociationRequest,
  IdentitySafetyBand,
  IndicationCategory,
  Recommendation,
  TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { selectedTests } from '#lib/engine/tests.js';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleAssessment {
  id: string;
  patientName: string;
  requestedDate: string;
  data: HlaAssociationRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  patientName: string;
  requestedDate: string;
  indication: IndicationCategory;
  testCount: number;
  appropriatenessScore: number;
  appropriatenessBand: AppropriatenessBand;
  identitySafetyBand: IdentitySafetyBand;
  completenessPercent: number;
  triageTier: TriageTier;
  recommendation: Recommendation;
  flagCount: number;
}

// Fictitious patients, one per persona in ../../../examples/personas.json.
// The states below are the persona states; the dashboard rows are computed from
// them by the shared engine, so the dashboard and the persona oracle cannot
// disagree.

/** Well-formed routine request: HLA-B27 for suspected axial spondyloarthritis, clinical details, report email, three or more matching identifiers, consent confirmed, 6 mL EDTA. Expect usually-appropriate, ok, routine, accept. */
function b27SuspectedSpondyloarthritisComplete(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Ashworth',
      givenNames: 'Claire',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'rheumatologist',
      clinicianEmail: 'r.menon@example.org',
      department: 'Rheumatology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: false,
      hlaB27: true,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: 'suspected-disease',
      clinicalDetails:
        'Chronic inflammatory back pain, onset under 40, suspected axial spondyloarthritis.',
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** HLA-B*57:01 before starting abacavir for HIV: a time-critical pre-prescribing test. Expect usually-appropriate, ok, urgent, accept, with the abacavir-start-pending flag. */
function b5701AbacavirPrePrescribing(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Mbeki',
      givenNames: 'Thabo',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'male',
      ethnicity: 'Black African',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr S Patel',
      clinicianRole: 'infectious-disease-physician',
      clinicianEmail: 'r.menon@example.org',
      department: 'HIV medicine',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: true,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: 'pre-treatment-drug-hypersensitivity',
      clinicalDetails:
        'Newly diagnosed HIV-1; abacavir/lamivudine proposed as part of first-line therapy.',
      plannedDrug: 'abacavir',
      previousHlaTypingKnown: false
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: false,
      highRiskDescription: ''
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
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** HLA-B27 requested although the patient has been HLA typed before; an HLA type is lifelong. Expect usually-not-appropriate (score 2), query-referrer, with the previous-hla-result flag. */
function previousTypingKnownDuplicate(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Lindgren',
      givenNames: 'Sven',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'male',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'rheumatologist',
      clinicianEmail: 'r.menon@example.org',
      department: 'Rheumatology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: false,
      hlaB27: true,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: 'suspected-disease',
      clinicalDetails:
        'Chronic inflammatory back pain, onset under 40, suspected axial spondyloarthritis.',
      plannedDrug: '',
      previousHlaTypingKnown: true
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: false,
      highRiskDescription: ''
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
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** HLA-DQ2/DQ8 with the clinical-details box left blank and no report destination. Expect may-be-appropriate (score 5), low completeness, query-referrer, with the no-clinical-details and report-destination-missing flags. */
function coeliacNoClinicalDetails(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Rossi',
      givenNames: 'Marco',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'male',
      ethnicity: '',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'general-practitioner',
      clinicianEmail: 'r.menon@example.org',
      department: '',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: ''
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: true,
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 3,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: true,
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** Other HLA association with no allele named and a high-risk sample with no description, volume under range. Expect may-be-appropriate (score 5), caution, query-referrer, with the high-risk-sample flag. */
function otherHlaHighRiskIncomplete(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Haddad',
      givenNames: 'Leila',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'rheumatologist',
      clinicianEmail: 'r.menon@example.org',
      department: 'Rheumatology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: false,
      otherHlaDiseaseAssociation: true,
      testDetail: ''
    },
    clinical: {
      indicationCategory: 'suspected-disease',
      clinicalDetails:
        'Unexplained recurrent anterior uveitis; ophthalmology suspects an HLA-associated condition.',
      plannedDrug: '',
      previousHlaTypingKnown: false
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: true,
      highRiskDescription: ''
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
      sampleVolumeMl: 3,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** HLA-DQA1*05 to predict anti-TNF response in Crohn disease: an emerging use with limited evidence. Expect may-be-appropriate (score 6), ok, routine, with the limited-evidence flag. */
function dqa105LimitedEvidence(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Okonkwo',
      givenNames: 'Ngozi',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'gastroenterologist',
      clinicianEmail: 'r.menon@example.org',
      department: 'Gastroenterology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: false,
      hlaB27: false,
      hlaB51: false,
      hlaB5701: false,
      hlaDr15Dq6: false,
      hlaDq2Dq8: false,
      hlaDqa105: true,
      otherHlaDiseaseAssociation: false,
      testDetail: ''
    },
    clinical: {
      indicationCategory: 'treatment-response',
      clinicalDetails:
        'Crohn disease, about to start infliximab; asking whether HLA-DQA1*05 carriage predicts immunogenicity.',
      plannedDrug: 'infliximab',
      previousHlaTypingKnown: false
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: '',
      highRiskSample: false,
      highRiskDescription: ''
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
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** HLA-A29 for suspected birdshot chorioretinopathy, but the sample label carries two identifiers and the form details are not confirmed to match. Expect reject-risk, reject, with the identity-mismatch-risk flag. */
function tooFewIdentifiersReject(): HlaAssociationRequest {
  return {
    patient: {
      familyName: 'Varga',
      givenNames: 'Eszter',
      previousName: '',
      birthDate: '1981-06-02',
      sex: 'female',
      ethnicity: 'White British',
      nationalHealthIdentifier: '900 000 0101',
      medicalRecordNumber: 'H101010',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: 'Dr R Menon',
      clinicianRole: 'ophthalmologist',
      clinicianEmail: 'r.menon@example.org',
      department: 'Ophthalmology',
      organization: 'Example General Hospital',
      copyOfReportTo: '',
      reportEmail: 'rheumatology.reports@example.org'
    },
    tests: {
      hlaA29: true,
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
      indicationCategory: 'suspected-disease',
      clinicalDetails:
        'Bilateral posterior uveitis with typical cream-coloured fundus lesions; birdshot chorioretinopathy suspected.',
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
      requestedBySignedAt: '2026-09-01T09:30',
      consentAndIdentityConfirmed: true
    },
    sample: {
      sampleCollectorName: 'J Okoye',
      sampleCollectedAt: '2026-09-01T10:15',
      identifiersOnSampleCount: 2,
      identifiersOnFormCount: 4,
      sampleAndFormDetailsMatch: false,
      sampleVolumeMl: 6,
      samplesOtherDescription: ''
    },
    lab: {
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

/** The sample requests behind the dashboard and the report pages. */
export const sampleAssessments: SampleAssessment[] = [
  {
    id: 'HLA-2026-000001',
    patientName: 'Ashworth, Claire',
    requestedDate: '2026-09-01',
    data: b27SuspectedSpondyloarthritisComplete()
  },
  {
    id: 'HLA-2026-000002',
    patientName: 'Mbeki, Thabo',
    requestedDate: '2026-09-01',
    data: b5701AbacavirPrePrescribing()
  },
  {
    id: 'HLA-2026-000003',
    patientName: 'Lindgren, Sven',
    requestedDate: '2026-09-01',
    data: previousTypingKnownDuplicate()
  },
  {
    id: 'HLA-2026-000004',
    patientName: 'Rossi, Marco',
    requestedDate: '2026-09-01',
    data: coeliacNoClinicalDetails()
  },
  {
    id: 'HLA-2026-000005',
    patientName: 'Haddad, Leila',
    requestedDate: '2026-09-01',
    data: otherHlaHighRiskIncomplete()
  },
  {
    id: 'HLA-2026-000006',
    patientName: 'Okonkwo, Ngozi',
    requestedDate: '2026-09-01',
    data: dqa105LimitedEvidence()
  },
  {
    id: 'HLA-2026-000007',
    patientName: 'Varga, Eszter',
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
    indication: s.data.clinical.indicationCategory,
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
