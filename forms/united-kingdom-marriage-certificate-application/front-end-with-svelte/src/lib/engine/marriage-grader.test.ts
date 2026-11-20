import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveValidityClass, validateApplication } from './marriage-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  addDays,
  addMonths,
  ageOn,
  earliestCeremonyDate,
  jointNoticeRequired,
  latestCeremonyDate,
  missingRequired,
  noticePeriodTooShort
} from './marriage-rules';
import type { Application, FlaggedIssue, Party } from './types';

/** A blank party (mirrors the store's defaults), defined locally so the engine tests never import the store. */
function blankParty(): Party {
  return {
    name: '',
    dateOfBirth: null,
    daysResidentInDistrict: null,
    nationalityStatus: '',
    maritalStatus: '',
    identityProvided: '',
    addressProofProvided: '',
    priorEndEvidenceProvided: '',
    immigrationEvidenceProvided: ''
  };
}

/** A complete, eligible, fully evidenced application. */
function ready(): Application {
  const party = (name: string, dob: string): Party => ({
    name,
    dateOfBirth: dob,
    daysResidentInDistrict: 400,
    nationalityStatus: 'british-or-irish',
    maritalStatus: 'never-married',
    identityProvided: 'yes',
    addressProofProvided: 'yes',
    priorEndEvidenceProvided: 'not-applicable',
    immigrationEvidenceProvided: 'not-applicable'
  });
  return {
    notice: {
      noticeType: 'marriage',
      noticeDate: '2026-06-01',
      registrationDistrict: 'Leeds',
      noticeGivenTogether: 'yes'
    },
    ceremony: {
      ceremonyType: 'civil-register-office',
      ceremonyDate: '2026-08-15',
      venueName: 'Leeds Register Office',
      venueConfirmed: 'yes',
      witnessCount: 2
    },
    partyOne: party('Amara Okafor', '1993-04-12'),
    partyTwo: party('Daniel Hughes', '1991-11-03'),
    relationship: { closelyRelated: 'no' },
    certificate: {
      certificateCopies: 2,
      certificateService: 'standard',
      groIndexReference: 'GRO-1',
      applicantNote: ''
    }
  };
}

const ids = (flags: FlaggedIssue[]) => flags.map((f) => f.id);

describe('date helpers', () => {
  it('adds days and months without a clock', () => {
    expect(addDays('2026-06-01', 29)).toBe('2026-06-30');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-06-01', 12)).toBe('2027-06-01');
    expect(addDays('not a date', 1)).toBeNull();
  });
  it('computes whole-year age on a reference date', () => {
    expect(ageOn('2008-08-16', '2026-08-15')).toBe(17);
    expect(ageOn('2008-08-15', '2026-08-15')).toBe(18);
    expect(ageOn(null, '2026-08-15')).toBeNull();
  });
});

describe('ceremony window', () => {
  it('is notice + 29 days to notice + 12 months', () => {
    const a = ready();
    expect(earliestCeremonyDate(a)).toBe('2026-06-30');
    expect(latestCeremonyDate(a)).toBe('2027-06-01');
  });
  it('allows the earliest date and refuses the day before', () => {
    const a = ready();
    a.ceremony.ceremonyDate = '2026-06-30';
    expect(noticePeriodTooShort(a)).toBe(false);
    a.ceremony.ceremonyDate = '2026-06-29';
    expect(noticePeriodTooShort(a)).toBe(true);
  });
});

describe('deriveValidityClass', () => {
  it('is ready-to-submit for a complete, eligible, evidenced application', () => {
    const a = ready();
    expect(deriveValidityClass(a)).toBe('ready-to-submit');
    expect(detectFlaggedIssues(a)).toEqual([]);
  });

  it('is ineligible when a party is 17 on the ceremony date', () => {
    const a = ready();
    a.partyTwo.dateOfBirth = '2009-03-01';
    expect(deriveValidityClass(a)).toBe('ineligible');
    expect(ids(detectFlaggedIssues(a))).toContain('F-PARTY-UNDER-18-001');
  });

  it('is ineligible when already married, and when closely related', () => {
    const a = ready();
    a.partyOne.maritalStatus = 'currently-married-or-civil-partnered';
    expect(deriveValidityClass(a)).toBe('ineligible');
    const b = ready();
    b.relationship.closelyRelated = 'yes';
    expect(deriveValidityClass(b)).toBe('ineligible');
  });

  it('ranks ineligible above incomplete', () => {
    const a = ready();
    a.notice.registrationDistrict = '';
    a.relationship.closelyRelated = 'yes';
    expect(deriveValidityClass(a)).toBe('ineligible');
  });

  it('is incomplete when a required field is missing', () => {
    const a = ready();
    a.partyOne.name = '';
    expect(missingRequired(a)).toEqual(['First party: name']);
    expect(deriveValidityClass(a)).toBe('incomplete');
  });

  it('is incomplete when certificate copies are requested without a service', () => {
    const a = ready();
    a.certificate.certificateService = '';
    expect(deriveValidityClass(a)).toBe('incomplete');
    expect(ids(detectFlaggedIssues(a))).toContain('F-CERTIFICATE-SERVICE-MISSING-001');
  });

  it('needs evidence for each evidence, timing and logistics shortfall', () => {
    const cases: [string, (a: Application) => void, string][] = [
      ['residence', (a) => (a.partyOne.daysResidentInDistrict = 6), 'F-RESIDENCE-UNDER-7-DAYS-001'],
      [
        'prior evidence',
        (a) => {
          a.partyTwo.maritalStatus = 'divorced';
          a.partyTwo.priorEndEvidenceProvided = 'no';
        },
        'F-PRIOR-RELATIONSHIP-EVIDENCE-MISSING-001'
      ],
      [
        'immigration',
        (a) => {
          a.partyTwo.nationalityStatus = 'eu-settlement-scheme';
          a.partyTwo.immigrationEvidenceProvided = 'no';
        },
        'F-IMMIGRATION-REFERRAL-001'
      ],
      ['identity', (a) => (a.partyOne.identityProvided = 'no'), 'F-IDENTITY-MISSING-001'],
      ['address', (a) => (a.partyTwo.addressProofProvided = ''), 'F-ADDRESS-PROOF-MISSING-001'],
      [
        'short notice',
        (a) => (a.ceremony.ceremonyDate = '2026-06-20'),
        'F-NOTICE-PERIOD-TOO-SHORT-001'
      ],
      [
        'expired',
        (a) => (a.ceremony.ceremonyDate = '2027-06-02'),
        'F-NOTICE-EXPIRES-BEFORE-CEREMONY-001'
      ],
      ['witnesses', (a) => (a.ceremony.witnessCount = 1), 'F-WITNESSES-INSUFFICIENT-001'],
      ['venue', (a) => (a.ceremony.venueConfirmed = 'no'), 'F-VENUE-NOT-CONFIRMED-001']
    ];
    for (const [label, edit, flag] of cases) {
      const a = ready();
      edit(a);
      expect(deriveValidityClass(a), label).toBe('needs-evidence');
      expect(ids(detectFlaggedIssues(a)), label).toContain(flag);
    }
  });

  it('needs joint notice when a party is from outside the UK and Ireland', () => {
    const a = ready();
    a.partyTwo.nationalityStatus = 'other';
    a.partyTwo.immigrationEvidenceProvided = 'yes';
    a.notice.noticeGivenTogether = 'no';
    expect(jointNoticeRequired(a)).toBe(true);
    expect(deriveValidityClass(a)).toBe('needs-evidence');
    expect(ids(detectFlaggedIssues(a))).toContain('F-JOINT-NOTICE-REQUIRED-001');
    a.notice.noticeGivenTogether = 'yes';
    expect(deriveValidityClass(a)).toBe('ready-to-submit');
  });

  it('does not require joint notice for EU Settlement Scheme holders', () => {
    const a = ready();
    a.partyTwo.nationalityStatus = 'eu-settlement-scheme';
    a.partyTwo.immigrationEvidenceProvided = 'yes';
    a.notice.noticeGivenTogether = 'no';
    expect(jointNoticeRequired(a)).toBe(false);
    expect(deriveValidityClass(a)).toBe('ready-to-submit');
  });
});

describe('blank application', () => {
  it('is incomplete and has no window', () => {
    const a: Application = {
      notice: {
        noticeType: '',
        noticeDate: null,
        registrationDistrict: '',
        noticeGivenTogether: ''
      },
      ceremony: {
        ceremonyType: '',
        ceremonyDate: null,
        venueName: '',
        venueConfirmed: '',
        witnessCount: null
      },
      partyOne: blankParty(),
      partyTwo: blankParty(),
      relationship: { closelyRelated: '' },
      certificate: {
        certificateCopies: null,
        certificateService: '',
        groIndexReference: '',
        applicantNote: ''
      }
    };
    const r = validateApplication(a);
    expect(r.validityClass).toBe('incomplete');
    expect(r.earliestCeremonyDate).toBeNull();
    expect(r.immigrationReferralIndicated).toBe(false);
  });
});

describe('parity with the HTML engine personas', () => {
  const file = new URL('../../../../examples/personas.json', import.meta.url);
  const personas = JSON.parse(readFileSync(file, 'utf8')).personas as {
    name: string;
    state: Application;
    expected: {
      validityClass: string;
      earliestCeremonyDate: string | null;
      latestCeremonyDate: string | null;
      immigrationReferralIndicated: boolean;
      flaggedIssues: FlaggedIssue[];
    };
  }[];

  it('has personas covering every class', () => {
    expect(new Set(personas.map((p) => p.expected.validityClass)).size).toBe(4);
  });

  for (const p of personas) {
    it(`grades "${p.name}" as the HTML engine does`, () => {
      const r = validateApplication(p.state);
      expect(r.validityClass).toBe(p.expected.validityClass);
      expect(r.earliestCeremonyDate).toBe(p.expected.earliestCeremonyDate);
      expect(r.latestCeremonyDate).toBe(p.expected.latestCeremonyDate);
      expect(r.immigrationReferralIndicated).toBe(p.expected.immigrationReferralIndicated);
      expect(r.flaggedIssues).toEqual(p.expected.flaggedIssues);
    });
  }
});
