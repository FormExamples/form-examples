import type { DivorceApplication, ApplicationClass, Stage } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/divorce-grader.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicantName: string;
  respondentName: string;
  caseworkerName: string;
  updatedDate: string;
  data: DivorceApplication;
}

/** A row in the caseworker dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  applicantName: string;
  respondentName: string;
  stage: Stage;
  applicationClass: ApplicationClass;
  earliestEligibleDate: string;
  flagCount: number;
  caseworkerName: string;
  updatedDate: string;
}

const caseworkers = ['A. Okafor', 'L. Mensah', 'S. Patel', 'J. Hughes', 'R. Ahmed'];

/** The sample applications, one per persona, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  {
    id: 'DIV-2026-0001',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[0],
    updatedDate: '2026-09-01',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0002',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[1],
    updatedDate: '2026-09-02',
    data: {
      application: {
        applicationType: 'dissolution',
        applicationMode: 'joint',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'yes',
        childrenCount: 2,
        childrenArrangements: 'agreed',
        childrenNote: 'Children live with Margaret; shared weekends.'
      },
      finances: {
        financialOrderIntended: 'yes',
        financialOrderApplied: 'no',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0003',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[2],
    updatedDate: '2026-09-03',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2025-11-20',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0004',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[3],
    updatedDate: '2026-09-04',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Krakow',
        marriageCountry: 'Poland',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'no',
        certifiedTranslation: 'no',
        nameChanged: 'yes',
        nameChangeProof: 'none'
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '',
        respondentEmail: '',
        respondentAddressKnown: 'no',
        serviceMethod: 'alternative-service'
      },
      children: {
        childrenUnder18: 'yes',
        childrenCount: 1,
        childrenArrangements: 'not-agreed',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'unpaid'
      },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0005',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[4],
    updatedDate: '2026-09-05',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'conditional-order',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: '2026-05-01',
        respondentAcknowledged: 'no',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0006',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[0],
    updatedDate: '2026-09-06',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'conditional-order',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: '2026-03-01',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0007',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[1],
    updatedDate: '2026-09-07',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'final-order',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'yes',
        financialOrderApplied: 'no',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: '2026-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2026-08-10',
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0008',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[2],
    updatedDate: '2026-09-08',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'final-order',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'yes',
        financialOrderApplied: 'yes',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: '2026-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2026-06-01',
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication
  },
  {
    id: 'DIV-2026-0009',
    applicantName: 'Margaret Ellis',
    respondentName: 'Peter Ellis',
    caseworkerName: caseworkers[3],
    updatedDate: '2026-09-09',
    data: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'final-order',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'yes',
        breakdownConfirmed: 'yes',
        marriageCertificateType: 'original',
        certificateInEnglish: 'yes',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'yes',
        applicantResidenceMonths: 120,
        applicantDomiciled: 'yes',
        respondentHabitualResident: 'yes',
        respondentDomiciled: 'yes',
        lastHabituallyResidentTogether: 'yes'
      },
      parties: {
        applicantName: 'Margaret Ellis',
        applicantAddress: '12 Park Road, Leeds LS6 1AB',
        applicantEmail: 'margaret.ellis@example.com',
        respondentName: 'Peter Ellis',
        respondentAddress: '4 Mill Lane, Bradford BD1 2CD',
        respondentEmail: 'peter.ellis@example.com',
        respondentAddressKnown: 'yes',
        serviceMethod: 'email'
      },
      children: {
        childrenUnder18: 'no',
        childrenCount: null,
        childrenArrangements: '',
        childrenNote: ''
      },
      finances: {
        financialOrderIntended: 'no',
        financialOrderApplied: '',
        feeStatus: 'paid'
      },
      progress: {
        applicationIssuedDate: '2025-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2025-06-01',
        finalOrderDelayExplained: 'no'
      }
    } as DivorceApplication
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    applicantName: s.applicantName,
    respondentName: s.respondentName,
    stage: s.data.application.stage,
    applicationClass: r.applicationClass,
    earliestEligibleDate: r.earliestEligibleDate,
    flagCount: r.flaggedIssues.length,
    caseworkerName: s.caseworkerName,
    updatedDate: s.updatedDate
  };
});
