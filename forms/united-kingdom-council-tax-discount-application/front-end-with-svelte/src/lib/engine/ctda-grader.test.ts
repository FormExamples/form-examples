import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveEligibilityClass, validateApplication } from './ctda-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  ageOn,
  countedAdults,
  daysBetween,
  studentCourseQualifies,
  indicativeOutcome
} from './ctda-rules';
import type { Application } from './types';

/** A complete, likely-eligible single person application. */
function singlePerson(): Application {
  return {
    claim: {
      claimType: 'single-person-discount',
      billingAuthority: 'Leeds City Council',
      accountReference: 'CT-1',
      applicationDate: '2026-09-02',
      effectiveDate: '2026-09-02'
    },
    applicant: {
      name: 'Adaeze Okonkwo',
      birthDate: '1985-04-12',
      email: '',
      phone: '',
      status: 'counted-adult'
    },
    property: {
      addressAsFullText: '14 Mill Lane',
      postcode: 'LS6 2AB',
      band: 'C',
      mainResidence: 'yes',
      liableRole: 'owner-occupier'
    },
    household: { othersLive: 'no', occupants: [] },
    evidence: {
      smiCertificate: '',
      qualifyingBenefit: '',
      studentCertificate: '',
      studentCourseMonths: null,
      studentHoursPerWeek: null,
      disabilityAdaptation: '',
      disabledPersonMainHome: '',
      apprenticeDeclaration: '',
      careLeaverProof: '',
      careLeaverAgeYears: null,
      notes: ''
    },
    declaration: {
      declaredTrue: 'yes',
      agreesToReportChanges: 'yes',
      fraudWarningAcknowledged: 'yes',
      declarantName: 'Adaeze Okonkwo',
      declarationDate: '2026-09-02'
    }
  };
}

describe('eligibility classification', () => {
  it('classifies a complete single person application as likely-eligible', () => {
    const r = validateApplication(singlePerson());
    expect(r.eligibilityClass).toBe('likely-eligible');
    expect(r.countedAdults).toBe(1);
    expect(r.indicativeOutcome).toBe('25-percent-discount');
    expect(r.flaggedIssues).toEqual([]);
  });

  it('classifies a blank application as incomplete', () => {
    const a = singlePerson();
    a.claim.claimType = '';
    expect(deriveEligibilityClass(a)).toBe('incomplete');
  });

  it('ranks likely-ineligible above incomplete', () => {
    const a = singlePerson();
    a.household = {
      othersLive: 'yes',
      occupants: [
        { name: 'Tunde', birthDate: '1983-02-20', status: 'counted-adult', evidenceHeld: '' }
      ]
    };
    a.declaration.declaredTrue = '';
    const r = validateApplication(a);
    expect(r.eligibilityClass).toBe('likely-ineligible');
    expect(r.indicativeOutcome).toBe('none');
    expect(r.flaggedIssues.map((f) => f.category)).toContain('adult-count-mismatch');
  });

  it('ignores the roster when nobody else lives there', () => {
    const a = singlePerson();
    a.household = {
      othersLive: 'no',
      occupants: [{ name: 'Ghost', birthDate: null, status: 'counted-adult', evidenceHeld: '' }]
    };
    expect(countedAdults(a)).toBe(1);
  });

  it('does not count disregarded occupants', () => {
    const a = singlePerson();
    a.household = {
      othersLive: 'yes',
      occupants: [
        { name: 'Sam', birthDate: '2004-01-01', status: 'full-time-student', evidenceHeld: 'yes' }
      ]
    };
    expect(countedAdults(a)).toBe(1);
    expect(deriveEligibilityClass(a)).toBe('likely-eligible');
  });
});

describe('rule helpers', () => {
  it('computes whole-year ages and day differences', () => {
    expect(ageOn('2004-06-01', '2026-05-31')).toBe(21);
    expect(ageOn('2004-06-01', '2026-06-01')).toBe(22);
    expect(ageOn(null, '2026-06-01')).toBeNull();
    expect(daysBetween('2026-06-02', '2026-09-02')).toBe(92);
  });

  it('applies the 1 year and 21 hour student criteria, and the under-20 route', () => {
    const a = singlePerson();
    a.evidence.studentCourseMonths = 12;
    a.evidence.studentHoursPerWeek = 21;
    expect(studentCourseQualifies(a)).toBe(true);
    a.evidence.studentHoursPerWeek = 20;
    expect(studentCourseQualifies(a)).toBe(false);
    a.applicant.birthDate = '2008-01-01';
    a.evidence.studentCourseMonths = 3;
    a.evidence.studentHoursPerWeek = 12;
    expect(studentCourseQualifies(a)).toBe(true);
  });

  it('maps claim types to indicative outcomes', () => {
    const a = singlePerson();
    expect(indicativeOutcome(a)).toBe('25-percent-discount');
    a.claim.claimType = 'student-exemption';
    expect(indicativeOutcome(a)).toBe('full-exemption');
  });
});

describe('flags', () => {
  it('raises the backdating flag when the effective date precedes the application', () => {
    const a = singlePerson();
    a.claim.effectiveDate = '2026-06-02';
    expect(detectFlaggedIssues(a).map((f) => f.category)).toEqual(['backdating']);
  });

  it('raises the duty and fraud flags when the declarations are not accepted', () => {
    const a = singlePerson();
    a.declaration.agreesToReportChanges = '';
    a.declaration.fraudWarningAcknowledged = 'no';
    expect(detectFlaggedIssues(a).map((f) => f.category)).toEqual([
      'duty-to-report-changes',
      'fraud-warning'
    ]);
  });
});

describe('persona oracle (examples/personas.json)', () => {
  const file = resolve(process.cwd(), '../examples/personas.json');
  const doc = JSON.parse(readFileSync(file, 'utf8')) as {
    personas: {
      name: string;
      state: Application;
      expected: {
        eligibilityClass: string;
        countedAdults: number;
        indicativeOutcome: string;
        flaggedIssues: { id: string; category: string; priority: string }[];
      };
    }[];
  };

  for (const p of doc.personas) {
    it(`matches the pinned expectation: ${p.name}`, () => {
      const r = validateApplication(p.state);
      expect(r.eligibilityClass).toBe(p.expected.eligibilityClass);
      expect(r.countedAdults).toBe(p.expected.countedAdults);
      expect(r.indicativeOutcome).toBe(p.expected.indicativeOutcome);
      expect(r.flaggedIssues.map((f) => [f.id, f.category, f.priority])).toEqual(
        p.expected.flaggedIssues.map((f) => [f.id, f.category, f.priority])
      );
    });
  }
});
