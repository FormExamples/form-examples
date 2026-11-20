import { describe, it, expect } from 'vitest';
import { validateApplication } from './divorce-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  addDays,
  addYears,
  jurisdictionGrounds,
  oneYearRuleMet,
  reflectionPeriodMet,
  finalOrderWaitMet
} from './divorce-rules';
import type { DivorceApplication } from './types';

// Pins the engine against the shared persona oracle (examples/personas.json) and
// the boundaries of each time gate. Personas are inlined so the test has no file
// dependency; the oracle test in `bin/test-personas` keeps the two in step.

const personas: {
  name: string;
  state: DivorceApplication;
  expected: {
    applicationClass: string;
    earliestEligibleDate: string;
    jurisdictionMet: boolean;
    ruleIds: string[];
    flagIds: string[];
  };
}[] = [
  {
    name: 'Ready sole application, no flags',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'ready-to-apply',
      earliestEligibleDate: '2019-06-09',
      jurisdictionMet: true,
      ruleIds: [],
      flagIds: []
    }
  },
  {
    name: 'Ready joint dissolution with children agreed and financial order outstanding',
    state: {
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
      finances: { financialOrderIntended: 'yes', financialOrderApplied: 'no', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'ready-to-apply',
      earliestEligibleDate: '2019-06-09',
      jurisdictionMet: true,
      ruleIds: [],
      flagIds: ['F-FINANCIAL-ORDER-REMINDER-001']
    }
  },
  {
    name: 'One-year rule not met',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'not-eligible-yet',
      earliestEligibleDate: '2026-11-20',
      jurisdictionMet: true,
      ruleIds: ['R-TIME-GATE-NOT-MET-01'],
      flagIds: ['F-ONE-YEAR-RULE-001']
    }
  },
  {
    name: 'Exactly one year: boundary is eligible',
    state: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'sole',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'no'
      },
      marriage: {
        marriageDate: '2025-09-03',
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
        applicantResidenceMonths: 12,
        applicantDomiciled: 'no',
        respondentHabitualResident: 'no',
        respondentDomiciled: 'no',
        lastHabituallyResidentTogether: 'no'
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'ready-to-apply',
      earliestEligibleDate: '2026-09-03',
      jurisdictionMet: true,
      ruleIds: [],
      flagIds: []
    }
  },
  {
    name: 'Foreign certificate, no translation, address unknown, fee unpaid',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'unpaid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'incomplete',
      earliestEligibleDate: '2019-06-09',
      jurisdictionMet: true,
      ruleIds: [
        'R-TRANSLATION-MISSING-01',
        'R-NAME-PROOF-MISSING-01',
        'R-SERVICE-ADDRESS-UNUSABLE-01',
        'R-FEE-OUTSTANDING-01'
      ],
      flagIds: [
        'F-TRANSLATION-MISSING-001',
        'F-SERVICE-ADDRESS-001',
        'F-CHILDREN-ARRANGEMENTS-001',
        'F-FEE-001',
        'F-NAME-CHANGE-PROOF-001'
      ]
    }
  },
  {
    name: 'Certificate not held and no jurisdiction ground',
    state: {
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
        marriageCertificateType: 'not-held',
        certificateInEnglish: '',
        certifiedTranslation: '',
        nameChanged: 'no',
        nameChangeProof: ''
      },
      jurisdiction: {
        applicantHabitualResident: 'no',
        applicantResidenceMonths: 0,
        applicantDomiciled: 'no',
        respondentHabitualResident: 'no',
        respondentDomiciled: 'no',
        lastHabituallyResidentTogether: 'no'
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'incomplete',
      earliestEligibleDate: '2019-06-09',
      jurisdictionMet: false,
      ruleIds: ['R-JURISDICTION-NOT-MET-01', 'R-CERTIFICATE-MISSING-01'],
      flagIds: ['F-JURISDICTION-NOT-MET-001', 'F-CERTIFICATE-MISSING-001']
    }
  },
  {
    name: 'Joint application despite domestic-abuse risk, relationship not recognized',
    state: {
      application: {
        applicationType: 'divorce',
        applicationMode: 'joint',
        stage: 'application',
        asOfDate: '2026-09-03',
        domesticAbuseRisk: 'yes'
      },
      marriage: {
        marriageDate: '2018-06-09',
        marriagePlace: 'Leeds',
        marriageCountry: 'England',
        legallyRecognised: 'no',
        breakdownConfirmed: 'no',
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'incomplete',
      earliestEligibleDate: '2019-06-09',
      jurisdictionMet: true,
      ruleIds: [
        'R-RECOGNITION-NOT-CONFIRMED-01',
        'R-BREAKDOWN-NOT-CONFIRMED-01',
        'R-JOINT-DESPITE-ABUSE-01'
      ],
      flagIds: ['F-NOT-RECOGNISED-001', 'F-BREAKDOWN-NOT-STATED-001', 'F-JOINT-DOMESTIC-ABUSE-001']
    }
  },
  {
    name: 'Conditional order inside the 20-week reflection period',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: '2026-05-01',
        respondentAcknowledged: 'no',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'not-eligible-yet',
      earliestEligibleDate: '2026-09-18',
      jurisdictionMet: true,
      ruleIds: ['R-TIME-GATE-NOT-MET-01'],
      flagIds: ['F-REFLECTION-PERIOD-001', 'F-ACKNOWLEDGEMENT-001']
    }
  },
  {
    name: 'Conditional order ready after 20 weeks',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: '2026-03-01',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'ready-to-apply',
      earliestEligibleDate: '2026-07-19',
      jurisdictionMet: true,
      ruleIds: [],
      flagIds: []
    }
  },
  {
    name: 'Conditional order stage, issue date missing',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: null,
        respondentAcknowledged: '',
        conditionalOrderGrantedDate: null,
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'incomplete',
      earliestEligibleDate: '',
      jurisdictionMet: true,
      ruleIds: ['R-ISSUE-DATE-MISSING-01'],
      flagIds: []
    }
  },
  {
    name: 'Final order inside the 6 weeks and 1 day wait',
    state: {
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
      finances: { financialOrderIntended: 'yes', financialOrderApplied: 'no', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: '2026-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2026-08-10',
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'not-eligible-yet',
      earliestEligibleDate: '2026-09-22',
      jurisdictionMet: true,
      ruleIds: ['R-TIME-GATE-NOT-MET-01'],
      flagIds: ['F-FINAL-ORDER-WAIT-001', 'F-FINANCIAL-ORDER-REMINDER-001']
    }
  },
  {
    name: 'Final order ready, financial order applied',
    state: {
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
      finances: { financialOrderIntended: 'yes', financialOrderApplied: 'yes', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: '2026-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2026-06-01',
        finalOrderDelayExplained: ''
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'ready-to-apply',
      earliestEligibleDate: '2026-07-14',
      jurisdictionMet: true,
      ruleIds: [],
      flagIds: []
    }
  },
  {
    name: 'Final order delayed more than 12 months, unexplained',
    state: {
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
      finances: { financialOrderIntended: 'no', financialOrderApplied: '', feeStatus: 'paid' },
      progress: {
        applicationIssuedDate: '2025-01-05',
        respondentAcknowledged: 'yes',
        conditionalOrderGrantedDate: '2025-06-01',
        finalOrderDelayExplained: 'no'
      }
    } as DivorceApplication,
    expected: {
      applicationClass: 'incomplete',
      earliestEligibleDate: '2025-07-14',
      jurisdictionMet: true,
      ruleIds: ['R-FINAL-ORDER-DELAY-UNEXPLAINED-01'],
      flagIds: ['F-FINAL-ORDER-DELAY-001']
    }
  }
];

describe('validateApplication against the personas', () => {
  for (const p of personas) {
    it(p.name, () => {
      const r = validateApplication(p.state);
      expect(r.applicationClass).toBe(p.expected.applicationClass);
      expect(r.earliestEligibleDate).toBe(p.expected.earliestEligibleDate);
      expect(r.jurisdictionMet).toBe(p.expected.jurisdictionMet);
      expect(r.rules.map((x) => x.id)).toEqual(p.expected.ruleIds);
      expect(detectFlaggedIssues(p.state).map((x) => x.id)).toEqual(p.expected.flagIds);
    });
  }

  it('covers every class', () => {
    const classes = new Set(personas.map((p) => p.expected.applicationClass));
    expect(classes).toEqual(new Set(['ready-to-apply', 'incomplete', 'not-eligible-yet']));
  });
});

describe('date arithmetic', () => {
  it('adds days across a month end', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
  });
  it('adds a year', () => {
    expect(addYears('2025-09-03', 1)).toBe('2026-09-03');
  });
  it('rejects a malformed date', () => {
    expect(addDays('03/09/2026', 1)).toBe('');
  });
});

function base(): DivorceApplication {
  return structuredClone(personas[0].state);
}

describe('stage gate boundaries', () => {
  it('one-year rule: the day before the anniversary is too early, the anniversary is allowed', () => {
    const s = base();
    s.marriage.marriageDate = '2025-09-03';
    s.application.asOfDate = '2026-09-02';
    expect(oneYearRuleMet(s)).toBe(false);
    s.application.asOfDate = '2026-09-03';
    expect(oneYearRuleMet(s)).toBe(true);
  });
  it('reflection period: 140 days after issue', () => {
    const s = base();
    s.application.stage = 'conditional-order';
    s.progress.applicationIssuedDate = '2026-05-01';
    s.application.asOfDate = '2026-09-17';
    expect(reflectionPeriodMet(s)).toBe(false);
    s.application.asOfDate = '2026-09-18';
    expect(reflectionPeriodMet(s)).toBe(true);
  });
  it('final order: 43 days after the conditional order', () => {
    const s = base();
    s.application.stage = 'final-order';
    s.progress.conditionalOrderGrantedDate = '2026-08-10';
    s.application.asOfDate = '2026-09-21';
    expect(finalOrderWaitMet(s)).toBe(false);
    s.application.asOfDate = '2026-09-22';
    expect(finalOrderWaitMet(s)).toBe(true);
  });
  it('a missing date is incomplete, not not-eligible-yet', () => {
    const s = base();
    s.application.stage = 'conditional-order';
    expect(validateApplication(s).applicationClass).toBe('incomplete');
  });
});

describe('jurisdiction grounds', () => {
  it('meets the 6-month domiciled-and-resident ground', () => {
    const s = base();
    s.jurisdiction = {
      applicantHabitualResident: 'yes',
      applicantResidenceMonths: 6,
      applicantDomiciled: 'yes',
      respondentHabitualResident: 'no',
      respondentDomiciled: 'no',
      lastHabituallyResidentTogether: 'no'
    };
    expect(jurisdictionGrounds(s)).toContain('applicant-domiciled-resident-6-months');
  });
  it('is not met when nothing applies', () => {
    const s = base();
    s.jurisdiction = {
      applicantHabitualResident: 'no',
      applicantResidenceMonths: 0,
      applicantDomiciled: 'no',
      respondentHabitualResident: 'no',
      respondentDomiciled: 'no',
      lastHabituallyResidentTogether: 'no'
    };
    expect(jurisdictionGrounds(s)).toEqual([]);
    expect(validateApplication(s).jurisdictionMet).toBe(false);
  });
});
