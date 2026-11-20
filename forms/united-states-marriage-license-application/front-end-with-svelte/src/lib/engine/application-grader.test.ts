import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  deriveApplicationClass,
  gradeApplication,
  validateApplication
} from './application-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  addDays,
  ageOn,
  daysBetween,
  minors,
  ruleFor,
  STATE_RULES,
  waitingDays,
  witnessesRequired
} from './rules';
import { createDefaultApplication } from './utils';
import type { MarriageApplication } from './types';

/** Fill every required field so the application is otherwise ready (California, adults). */
function readyCalifornia(): MarriageApplication {
  const d = createDefaultApplication();
  d.jurisdiction = {
    state: 'CA',
    county: 'Los Angeles County',
    applicationDate: '2026-08-20',
    licenseType: 'standard'
  };
  d.applicantOne = {
    name: 'Maria Garcia',
    sex: 'female',
    dateOfBirth: '1990-03-14',
    placeOfBirth: 'Fresno, California',
    residenceState: 'CA',
    idPresented: 'yes',
    ssnStatus: 'provided',
    maritalStatus: 'never-married',
    priorMarriageEndedDate: null
  };
  d.applicantTwo = {
    ...d.applicantOne,
    name: 'Jordan Lee',
    sex: 'male',
    dateOfBirth: '1988-07-02'
  };
  d.eligibility = {
    relationshipBetweenApplicants: 'not-related',
    minorConsent: 'not-applicable',
    activeDutyMilitary: 'no',
    appearInPerson: 'yes',
    proxyRequested: 'no',
    premaritalCourseCompleted: 'no',
    bloodTestEvidence: 'not-required'
  };
  return d;
}

describe('state rule table', () => {
  it('encodes at least the eight required states', () => {
    for (const code of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA']) {
      expect(STATE_RULES[code]).toBeDefined();
      expect(STATE_RULES[code].minAge).toBe(18);
    }
  });

  it('uses the verified waiting periods', () => {
    expect(STATE_RULES.NY.waitingHours).toBe(24);
    expect(STATE_RULES.TX.waitingHours).toBe(72);
    expect(STATE_RULES.WA.waitingHours).toBe(72);
    expect(STATE_RULES.CA.waitingHours).toBe(0);
  });

  it('falls back to the uniform default for an unlisted state', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'VT';
    expect(ruleFor(d).name).toBe('Unlisted state');
    expect(validateApplication(d).stateRuleKnown).toBe(false);
    expect(detectFlaggedIssues(d).some((f) => f.id === 'F-USMLA-019')).toBe(true);
  });
});

describe('dates', () => {
  it('computes ages on a reference date', () => {
    expect(ageOn('2008-09-04', '2026-09-03')).toBe(17);
    expect(ageOn('2008-09-03', '2026-09-03')).toBe(18);
    expect(ageOn(null, '2026-09-03')).toBeNull();
  });

  it('adds days and measures spans', () => {
    expect(addDays('2026-08-30', 3)).toBe('2026-09-02');
    expect(daysBetween('2026-08-30', '2026-09-02')).toBe(3);
    expect(daysBetween('2026-08-30', null)).toBeNull();
  });
});

describe('classification', () => {
  it('classifies a complete adult application as ready-to-apply', () => {
    expect(deriveApplicationClass(readyCalifornia())).toBe('ready-to-apply');
  });

  it('classifies a blank application as incomplete', () => {
    expect(deriveApplicationClass(createDefaultApplication())).toBe('incomplete');
  });

  it('classifies a current marriage as not-eligible, outranking incompleteness', () => {
    const d = readyCalifornia();
    d.applicantTwo.maritalStatus = 'currently-married';
    d.applicantOne.name = '';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('bars a minor in a state with no minor path', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'PA';
    d.applicantOne.dateOfBirth = '2009-04-18';
    expect(minors(d)[0].barredReason).toContain('Pennsylvania');
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('allows a minor on a court-order path only with the order', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'OH';
    d.applicantOne.dateOfBirth = '2009-05-09';
    d.applicantTwo.dateOfBirth = '2006-02-14';
    expect(deriveApplicationClass(d)).toBe('incomplete');
    d.eligibility.minorConsent = 'court-order';
    expect(deriveApplicationClass(d)).toBe('ready-to-apply');
  });

  it('closes the California minor path on 2027-01-01', () => {
    const d = readyCalifornia();
    d.applicantOne.dateOfBirth = '2009-10-05';
    d.eligibility.minorConsent = 'court-order';
    expect(deriveApplicationClass(d)).toBe('ready-to-apply');
    d.jurisdiction.applicationDate = '2027-01-15';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('enforces the Florida two-year age gap for a 17-year-old', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'FL';
    d.applicantOne.dateOfBirth = '2009-03-15';
    d.applicantTwo.dateOfBirth = '2004-01-20';
    d.eligibility.minorConsent = 'parental-consent';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('allows proxy marriage only for deployed service members in a permitting state', () => {
    const d = readyCalifornia();
    d.eligibility.proxyRequested = 'yes';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
    d.eligibility.activeDutyMilitary = 'yes';
    expect(deriveApplicationClass(d)).toBe('ready-to-apply');
    d.jurisdiction.state = 'NY';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });
});

describe('timing and ceremony', () => {
  it('waives the Texas wait for a premarital course', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'TX';
    expect(waitingDays(d).days).toBe(3);
    d.eligibility.premaritalCourseCompleted = 'yes';
    expect(waitingDays(d).days).toBe(0);
    expect(waitingDays(d).waivedBy).toBe('premarital course');
  });

  it('derives the earliest ceremony and expiry dates', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'NY';
    d.issuance.licenseIssuedDate = '2026-08-30';
    const grade = validateApplication(d);
    expect(grade.earliestCeremonyDate).toBe('2026-08-31');
    expect(grade.licenseExpiryDate).toBe('2026-10-29');
  });

  it('flags a ceremony inside the waiting period and an expired license', () => {
    const d = readyCalifornia();
    d.jurisdiction.state = 'WA';
    d.issuance.licenseIssuedDate = '2026-08-20';
    d.ceremony.ceremonyDate = '2026-08-22';
    d.ceremony.witnessCount = 2;
    d.ceremony.officiantType = 'judge';
    d.ceremony.officiantName = 'Hon. A. Judge';
    d.ceremony.officiantAuthorized = 'yes';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-USMLA-010');
    expect(deriveApplicationClass(d)).toBe('incomplete');
    d.ceremony.ceremonyDate = '2026-11-01';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-USMLA-011');
  });

  it('counts witnesses by license type', () => {
    const d = readyCalifornia();
    expect(witnessesRequired(d)).toBe(1);
    d.jurisdiction.licenseType = 'confidential';
    expect(witnessesRequired(d)).toBe(0);
  });
});

describe('grade result', () => {
  it('carries flags sorted by priority and a timestamp', () => {
    const d = readyCalifornia();
    d.applicantOne.maritalStatus = 'currently-married';
    d.applicantTwo.ssnStatus = 'declined';
    const result = gradeApplication(d);
    expect(result.applicationClass).toBe('not-eligible');
    const order = result.flaggedIssues.map((f) => f.priority);
    expect(order).toEqual(
      [...order].sort((a, b) => 'highmediumlow'.indexOf(a) - 'highmediumlow'.indexOf(b))
    );
    expect(result.timestamp).toMatch(/^\d{4}-/);
  });
});

interface Persona {
  name: string;
  state: MarriageApplication;
  expected: {
    applicationClass: string;
    earliestCeremonyDate: string | null;
    licenseExpiryDate: string | null;
    stateRuleKnown: boolean;
    flaggedIssues: { id: string; priority: string }[];
  };
}

describe('examples/personas.json (parity with the HTML engine)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-03T12:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const file = fileURLToPath(new URL('../../../../examples/personas.json', import.meta.url));
  const personas = (JSON.parse(readFileSync(file, 'utf8')) as { personas: Persona[] }).personas;

  it('has personas', () => {
    expect(personas.length).toBeGreaterThanOrEqual(6);
  });

  for (const p of personas) {
    it(p.name, () => {
      const grade = validateApplication(p.state);
      expect(grade.applicationClass).toBe(p.expected.applicationClass);
      expect(grade.earliestCeremonyDate).toBe(p.expected.earliestCeremonyDate);
      expect(grade.licenseExpiryDate).toBe(p.expected.licenseExpiryDate);
      expect(grade.stateRuleKnown).toBe(p.expected.stateRuleKnown);
      expect(detectFlaggedIssues(p.state).map((f) => f.id)).toEqual(
        p.expected.flaggedIssues.map((f) => f.id)
      );
    });
  }
});
