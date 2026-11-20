import { describe, it, expect } from 'vitest';
import { deriveReadinessClass, validatePetition } from './divorce-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  STATE_RULES,
  addDays,
  addMonths,
  earliestDecreeDate,
  ruleFor,
  separationShort
} from './divorce-rules';
import { createDefaultPetition } from './types';
import type { DivorcePetition } from './types';

/** Persona states and their pinned classes, copied from examples/personas.json. */
const PERSONAS: { name: string; state: DivorcePetition; cls: string; flags: string[] }[] = [
  {
    name: 'Ready to file: Illinois uncontested, no children, served by acceptance',
    state: {
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
    },
    cls: 'ready-to-file',
    flags: []
  },
  {
    name: 'Ready to file: California uncontested with children, waiting period pending',
    state: {
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
    },
    cls: 'ready-to-file',
    flags: ['F-DIV-WAITING-002']
  },
  {
    name: 'Not yet eligible: Texas residency and county residency short',
    state: {
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
    },
    cls: 'not-yet-eligible',
    flags: ['F-DIV-RESIDENCY-001', 'F-DIV-COUNTY-001', 'F-DIV-WAITING-002']
  },
  {
    name: 'Not yet eligible: Pennsylvania contested no-fault, separation too short',
    state: {
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
    },
    cls: 'not-yet-eligible',
    flags: ['F-DIV-SEPARATION-001', 'F-DIV-WAITING-002']
  },
  {
    name: 'Incomplete: Florida with a fault ground, missing names and children paperwork',
    state: {
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
    },
    cls: 'incomplete',
    flags: [
      'F-DIV-CORE-MISSING-001',
      'F-DIV-GROUND-001',
      'F-DIV-CUSTODY-001',
      'F-DIV-CHILDSUPPORT-001',
      'F-DIV-DISCLOSURE-001',
      'F-DIV-SERVICE-002',
      'F-DIV-WAITING-002'
    ]
  },
  {
    name: 'Not yet eligible: Washington decree entered before the 90-day waiting period',
    state: {
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
    },
    cls: 'not-yet-eligible',
    flags: ['F-DIV-WAITING-001', 'F-DIV-NAME-001', 'F-DIV-CERTIFICATE-001']
  },
  {
    name: 'Ready to file with flags: unknown state, UCCJEA gap, military respondent, publication',
    state: {
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
    },
    cls: 'ready-to-file',
    flags: [
      'F-DIV-HOMESTATE-001',
      'F-DIV-UNKNOWN-STATE-001',
      'F-DIV-DISCLOSURE-001',
      'F-DIV-MILITARY-001',
      'F-DIV-PUBLICATION-001'
    ]
  },
  {
    name: 'Ready to file with flag: New York with the shortened residency and a property mismatch',
    state: {
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
    },
    cls: 'ready-to-file',
    flags: ['F-DIV-PROPERTY-001']
  },
  {
    name: 'Incomplete: Ohio contested no-fault with no separation date',
    state: {
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
    },
    cls: 'incomplete',
    flags: ['F-DIV-CORE-MISSING-001', 'F-DIV-SEPARATION-002']
  },
  {
    name: 'Incomplete: blank petition',
    state: {
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
    },
    cls: 'incomplete',
    flags: ['F-DIV-CORE-MISSING-001', 'F-DIV-DISCLOSURE-001', 'F-DIV-SERVICE-002']
  }
];

describe('personas', () => {
  for (const p of PERSONAS) {
    it(`${p.name}`, () => {
      expect(deriveReadinessClass(p.state)).toBe(p.cls);
      expect(detectFlaggedIssues(p.state).map((f) => f.id)).toEqual(p.flags);
    });
  }
});

describe('date helpers', () => {
  it('adds days and months with month-end clamping', () => {
    expect(addDays('2026-07-20', 60)).toBe('2026-09-18');
    expect(addMonths('2026-08-31', 6)).toBe('2027-02-28');
    expect(addMonths('bad', 1)).toBeNull();
  });
});

describe('state rules', () => {
  it('has the verified states and falls back for others', () => {
    for (const code of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA']) {
      expect(STATE_RULES[code]).toBeDefined();
      expect(ruleFor(code).known).toBe(true);
    }
    expect(ruleFor('mn').known).toBe(false);
    expect(ruleFor('mn').rule.property).toBe('');
  });

  it('computes California six months and a day from service', () => {
    const d = createDefaultPetition();
    d.filing.state = 'CA';
    d.filing.filingDate = '2026-07-06';
    d.service.serviceDate = '2026-07-20';
    expect(earliestDecreeDate(d)).toBe('2027-01-21');
  });

  it('uses the later of filing and service for Washington', () => {
    const d = createDefaultPetition();
    d.filing.state = 'WA';
    d.filing.filingDate = '2026-07-01';
    d.service.serviceDate = '2026-07-10';
    expect(earliestDecreeDate(d)).toBe('2026-10-08');
  });

  it('has no earliest date where the state has no waiting period', () => {
    const d = createDefaultPetition();
    d.filing.state = 'IL';
    d.filing.filingDate = '2026-08-03';
    expect(earliestDecreeDate(d)).toBeNull();
  });

  it('waives the separation period for an uncontested case', () => {
    const d = createDefaultPetition();
    d.filing.state = 'PA';
    d.filing.groundType = 'no-fault';
    d.filing.filingDate = '2026-08-15';
    d.spouses.separationDate = '2026-07-01';
    d.filing.caseType = 'uncontested';
    expect(separationShort(d)).toBe(false);
    d.filing.caseType = 'contested';
    expect(separationShort(d)).toBe(true);
  });
});

describe('classification precedence', () => {
  it('a blank petition is incomplete with a result shape', () => {
    const r = validatePetition(createDefaultPetition());
    expect(r.readinessClass).toBe('incomplete');
    expect(r.propertyRegime).toBe('unknown');
    expect(r.stateRuleKnown).toBe(false);
  });

  it('not-yet-eligible beats incomplete', () => {
    const d = createDefaultPetition();
    d.filing.state = 'TX';
    d.spouses.petitionerResidencyMonths = 2;
    expect(deriveReadinessClass(d)).toBe('not-yet-eligible');
  });

  it('sorts flags high to low', () => {
    const order = { high: 0, medium: 1, low: 2 };
    const flags = detectFlaggedIssues(createDefaultPetition());
    for (let i = 1; i < flags.length; i++) {
      expect(order[flags[i - 1].priority]).toBeLessThanOrEqual(order[flags[i].priority]);
    }
  });
});
