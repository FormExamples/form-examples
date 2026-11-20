import type { DivorcePetition, ReadinessClass } from '#lib/engine/types.js';
import { validatePetition } from '#lib/engine/divorce-grader.js';

/** A sample petition: an identifier and the full data the engine grades. */
export interface SamplePetition {
  id: string;
  petitionerName: string;
  respondentName: string;
  filedDate: string;
  data: DivorcePetition;
}

/** A row in the petitions dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  petitionerName: string;
  respondentName: string;
  state: string;
  caseType: string;
  readinessClass: ReadinessClass;
  earliestDecreeDate: string | null;
  flagCount: number;
  filedDate: string;
}

/**
 * The sample petitions, keyed by stable id (used to seed the wizard). One per
 * persona in `examples/personas.json`.
 */
export const samplePetitions: SamplePetition[] = [
  {
    id: 'DIV-2026-0001',
    petitionerName: 'Maria L. Alvarez',
    respondentName: 'Daniel R. Alvarez',
    filedDate: '2026-08-03',
    data: {
      filing: {
        state: 'IL',
        county: 'Cook',
        filingDate: '2026-08-03',
        caseType: 'uncontested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Maria L. Alvarez',
        respondentName: 'Daniel R. Alvarez',
        marriageDate: '2015-06-20',
        marriagePlace: 'Chicago, IL',
        separationDate: '2026-01-10',
        petitionerResidencyMonths: 168,
        countyResidencyDays: 5000,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'equitable',
        settlementAgreementSigned: 'yes',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'acceptance',
        serviceDate: '2026-08-10',
        respondentResponded: 'yes'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'yes'
      }
    }
  },
  {
    id: 'DIV-2026-0002',
    petitionerName: 'Priya N. Shah',
    respondentName: 'Arjun K. Shah',
    filedDate: '2026-07-06',
    data: {
      filing: {
        state: 'CA',
        county: 'Alameda',
        filingDate: '2026-07-06',
        caseType: 'uncontested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Priya N. Shah',
        respondentName: 'Arjun K. Shah',
        marriageDate: '2016-02-14',
        marriagePlace: 'San Jose, CA',
        separationDate: '2026-03-01',
        petitionerResidencyMonths: 108,
        countyResidencyDays: 900,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'yes',
        childrenCount: 2,
        childrenHomeStateMonths: 96,
        pregnant: 'no',
        custodyPlanDocumented: 'yes',
        childSupportWorksheetCompleted: 'yes',
        childSupportMonthlyAmount: 1240
      },
      property: {
        propertyDivisionApproach: 'community',
        settlementAgreementSigned: 'yes',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'personal',
        serviceDate: '2026-07-20',
        respondentResponded: 'no'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'yes'
      }
    }
  },
  {
    id: 'DIV-2026-0003',
    petitionerName: 'Hannah J. Brooks',
    respondentName: 'Tyler M. Brooks',
    filedDate: '2026-08-10',
    data: {
      filing: {
        state: 'TX',
        county: 'Travis',
        filingDate: '2026-08-10',
        caseType: 'uncontested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Hannah J. Brooks',
        respondentName: 'Tyler M. Brooks',
        marriageDate: '2019-09-07',
        marriagePlace: 'Dallas, TX',
        separationDate: '2026-05-01',
        petitionerResidencyMonths: 4,
        countyResidencyDays: 60,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'community',
        settlementAgreementSigned: 'yes',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'acceptance',
        serviceDate: '2026-08-12',
        respondentResponded: 'yes'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0004',
    petitionerName: 'Grace E. Kowalski',
    respondentName: 'Peter J. Kowalski',
    filedDate: '2026-08-15',
    data: {
      filing: {
        state: 'PA',
        county: 'Allegheny',
        filingDate: '2026-08-15',
        caseType: 'contested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Grace E. Kowalski',
        respondentName: 'Peter J. Kowalski',
        marriageDate: '2012-10-13',
        marriagePlace: 'Pittsburgh, PA',
        separationDate: '2026-03-01',
        petitionerResidencyMonths: 240,
        countyResidencyDays: 7000,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'equitable',
        settlementAgreementSigned: 'no',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'yes'
      },
      service: {
        serviceMethod: 'personal',
        serviceDate: '2026-08-25',
        respondentResponded: 'yes'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0005',
    petitionerName: 'Carla M. Reyes',
    respondentName: '(not recorded)',
    filedDate: '2026-08-20',
    data: {
      filing: {
        state: 'FL',
        county: 'Orange',
        filingDate: '2026-08-20',
        caseType: 'contested',
        groundType: 'fault',
        faultGround: 'adultery'
      },
      spouses: {
        petitionerName: 'Carla M. Reyes',
        respondentName: '',
        marriageDate: null,
        marriagePlace: '',
        separationDate: null,
        petitionerResidencyMonths: 30,
        countyResidencyDays: 900,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'yes',
        childrenCount: 1,
        childrenHomeStateMonths: 30,
        pregnant: 'no',
        custodyPlanDocumented: 'no',
        childSupportWorksheetCompleted: 'no',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'equitable',
        settlementAgreementSigned: 'no',
        financialDisclosureFiled: 'no',
        spousalSupportRequested: 'yes'
      },
      service: {
        serviceMethod: 'none',
        serviceDate: null,
        respondentResponded: ''
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0006',
    petitionerName: 'Olivia T. Nguyen',
    respondentName: 'Ethan P. Nguyen',
    filedDate: '2026-07-01',
    data: {
      filing: {
        state: 'WA',
        county: 'King',
        filingDate: '2026-07-01',
        caseType: 'uncontested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Olivia T. Nguyen',
        respondentName: 'Ethan P. Nguyen',
        marriageDate: '2018-05-12',
        marriagePlace: 'Seattle, WA',
        separationDate: '2026-02-01',
        petitionerResidencyMonths: 96,
        countyResidencyDays: 2800,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'community',
        settlementAgreementSigned: 'yes',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'personal',
        serviceDate: '2026-07-10',
        respondentResponded: 'yes'
      },
      decree: {
        decreeEntered: 'yes',
        decreeDate: '2026-08-20',
        nameRestorationRequested: 'yes',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0007',
    petitionerName: 'Sofia A. Lindqvist',
    respondentName: 'Marcus D. Lindqvist',
    filedDate: '2026-08-05',
    data: {
      filing: {
        state: 'MN',
        county: 'Hennepin',
        filingDate: '2026-08-05',
        caseType: 'contested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Sofia A. Lindqvist',
        respondentName: 'Marcus D. Lindqvist',
        marriageDate: '2014-07-19',
        marriagePlace: 'Duluth, MN',
        separationDate: '2025-12-01',
        petitionerResidencyMonths: 48,
        countyResidencyDays: 1400,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'yes'
      },
      children: {
        hasMinorChildren: 'yes',
        childrenCount: 2,
        childrenHomeStateMonths: 4,
        pregnant: 'no',
        custodyPlanDocumented: 'yes',
        childSupportWorksheetCompleted: 'yes',
        childSupportMonthlyAmount: 980
      },
      property: {
        propertyDivisionApproach: '',
        settlementAgreementSigned: 'no',
        financialDisclosureFiled: 'no',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'publication',
        serviceDate: '2026-08-30',
        respondentResponded: 'no'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0008',
    petitionerName: 'Renee S. Dubois',
    respondentName: 'Paul A. Dubois',
    filedDate: '2026-06-01',
    data: {
      filing: {
        state: 'NY',
        county: 'Kings',
        filingDate: '2026-06-01',
        caseType: 'uncontested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Renee S. Dubois',
        respondentName: 'Paul A. Dubois',
        marriageDate: '2017-04-22',
        marriagePlace: 'Brooklyn, NY',
        separationDate: '2025-09-01',
        petitionerResidencyMonths: 14,
        countyResidencyDays: 420,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'community',
        settlementAgreementSigned: 'yes',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'acceptance',
        serviceDate: '2026-06-05',
        respondentResponded: 'yes'
      },
      decree: {
        decreeEntered: 'yes',
        decreeDate: '2026-09-01',
        nameRestorationRequested: 'yes',
        nameToRestore: 'Renee S. Martin',
        certificateRequested: 'yes'
      }
    }
  },
  {
    id: 'DIV-2026-0009',
    petitionerName: 'Kevin B. Walsh',
    respondentName: 'Laura C. Walsh',
    filedDate: '2026-08-12',
    data: {
      filing: {
        state: 'OH',
        county: 'Franklin',
        filingDate: '2026-08-12',
        caseType: 'contested',
        groundType: 'no-fault',
        faultGround: ''
      },
      spouses: {
        petitionerName: 'Kevin B. Walsh',
        respondentName: 'Laura C. Walsh',
        marriageDate: '2010-03-27',
        marriagePlace: 'Columbus, OH',
        separationDate: null,
        petitionerResidencyMonths: 7,
        countyResidencyDays: 120,
        marriedOrLivedInState: 'yes',
        respondentMilitary: 'no'
      },
      children: {
        hasMinorChildren: 'no',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: 'equitable',
        settlementAgreementSigned: 'no',
        financialDisclosureFiled: 'yes',
        spousalSupportRequested: 'no'
      },
      service: {
        serviceMethod: 'mail',
        serviceDate: '2026-08-20',
        respondentResponded: 'no'
      },
      decree: {
        decreeEntered: 'no',
        decreeDate: null,
        nameRestorationRequested: 'no',
        nameToRestore: '',
        certificateRequested: 'no'
      }
    }
  },
  {
    id: 'DIV-2026-0010',
    petitionerName: '(not recorded)',
    respondentName: '(not recorded)',
    filedDate: '',
    data: {
      filing: {
        state: '',
        county: '',
        filingDate: null,
        caseType: '',
        groundType: '',
        faultGround: ''
      },
      spouses: {
        petitionerName: '',
        respondentName: '',
        marriageDate: null,
        marriagePlace: '',
        separationDate: null,
        petitionerResidencyMonths: null,
        countyResidencyDays: null,
        marriedOrLivedInState: '',
        respondentMilitary: ''
      },
      children: {
        hasMinorChildren: '',
        childrenCount: null,
        childrenHomeStateMonths: null,
        pregnant: '',
        custodyPlanDocumented: '',
        childSupportWorksheetCompleted: '',
        childSupportMonthlyAmount: null
      },
      property: {
        propertyDivisionApproach: '',
        settlementAgreementSigned: '',
        financialDisclosureFiled: '',
        spousalSupportRequested: ''
      },
      service: {
        serviceMethod: '',
        serviceDate: null,
        respondentResponded: ''
      },
      decree: {
        decreeEntered: '',
        decreeDate: null,
        nameRestorationRequested: '',
        nameToRestore: '',
        certificateRequested: ''
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const samplePetitionRows: DashboardRow[] = samplePetitions.map((s) => {
  const r = validatePetition(s.data);
  return {
    id: s.id,
    petitionerName: s.petitionerName,
    respondentName: s.respondentName,
    state: s.data.filing.state || '--',
    caseType: s.data.filing.caseType || 'unset',
    readinessClass: r.readinessClass,
    earliestDecreeDate: r.earliestDecreeDate,
    flagCount: r.flaggedIssues.length,
    filedDate: s.filedDate
  };
});
