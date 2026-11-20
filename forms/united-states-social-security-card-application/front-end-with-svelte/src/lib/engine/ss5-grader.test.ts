import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveApplicationClass, validateApplication } from './ss5-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { ageAtApplication, limitBlocked, limitNear, limitReached, yearsBetween } from './ss5-rules';
import { createDefaultApplication } from './defaults';
import type { SocialSecurityApplication } from './types';

/** A complete, ready-to-submit adult original-card application. */
function ready(): SocialSecurityApplication {
  const d = createDefaultApplication();
  d.request.applicationDate = '2026-09-03';
  d.request.requestType = 'original';
  d.request.channel = 'in-person';
  d.request.previouslyApplied = 'no';
  d.request.nameChange = 'no';
  Object.assign(d.applicant, {
    nameOnCard: 'Maria Elena Santos',
    nameAtBirth: 'Maria Elena Santos',
    dateOfBirth: '1994-05-17',
    placeOfBirthCity: 'Houston',
    placeOfBirthRegion: 'Texas',
    sex: 'female',
    citizenship: 'us-citizen',
    motherNameAtBirth: 'Rosa Delgado',
    stateOfResidence: 'TX',
    mailingAddress: '1420 Elm Street, Houston, TX 77002'
  });
  Object.assign(d.evidence, {
    identityDocument: 'us-driver-license',
    identityDocumentExpired: 'no',
    ageDocument: 'us-birth-certificate',
    citizenshipDocument: 'us-birth-certificate',
    documentsOriginalOrCertified: 'yes'
  });
  Object.assign(d.filer, { signerRelationship: 'self', signaturePresent: 'yes' });
  d.tellSsa.applicantDeceased = 'no';
  return d;
}

describe('classification', () => {
  it('a blank application is incomplete', () => {
    expect(deriveApplicationClass(createDefaultApplication())).toBe('incomplete');
  });

  it('a complete original-card application is ready to submit with no flags', () => {
    const d = ready();
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
    expect(detectFlaggedIssues(d)).toEqual([]);
  });

  it('a deceased applicant is not eligible and takes precedence over a blank form', () => {
    const d = createDefaultApplication();
    d.tellSsa.applicantDeceased = 'yes';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
    const ids = detectFlaggedIssues(d).map((f) => f.id);
    expect(ids).toContain('F-APPLICANT-DECEASED-001');
    expect(ids).toContain('F-DEATH-REPORT-001');
  });

  it('a missing identity document makes a complete form evidence-missing', () => {
    const d = ready();
    d.evidence.identityDocument = 'none';
    expect(deriveApplicationClass(d)).toBe('evidence-missing');
    expect(validateApplication(d).missingEvidenceCount).toBe(1);
  });

  it('an expired identity document is an evidence gap', () => {
    const d = ready();
    d.evidence.identityDocumentExpired = 'yes';
    expect(deriveApplicationClass(d)).toBe('evidence-missing');
  });

  it('a mailed original card for an applicant aged 12 or older is incomplete', () => {
    const d = ready();
    d.request.channel = 'mail';
    expect(deriveApplicationClass(d)).toBe('incomplete');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-IN-PERSON-001');
  });

  it('an applicant under 12 may mail an original card application', () => {
    const d = ready();
    d.applicant.dateOfBirth = '2020-01-01';
    d.request.channel = 'mail';
    d.filer.signerRelationship = 'parent';
    d.filer.signerName = 'Dana Whitfield';
    d.filer.signerIdentityDocument = 'yes';
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
  });

  it('a minor who signs for themselves is incomplete', () => {
    const d = ready();
    d.applicant.dateOfBirth = '2011-03-09';
    expect(deriveApplicationClass(d)).toBe('incomplete');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-MINOR-SIGNER-001');
  });
});

describe('replacement limits', () => {
  function replacement(year: number, life: number): SocialSecurityApplication {
    const d = ready();
    d.request.requestType = 'replacement';
    d.request.previouslyApplied = 'yes';
    d.request.replacementsThisYear = year;
    d.request.replacementsLifetime = life;
    d.applicant.nameOnMostRecentCard = 'Maria Elena Santos';
    d.evidence.citizenshipOnFile = 'yes';
    d.evidence.citizenshipDocument = 'none';
    return d;
  }

  it('2 this year and 9 in a lifetime are one short of the limits', () => {
    expect(limitNear(replacement(2, 3))).toBe(true);
    expect(limitNear(replacement(0, 9))).toBe(true);
    expect(limitNear(replacement(1, 3))).toBe(false);
  });

  it('3 this year or 10 in a lifetime reaches a limit', () => {
    expect(limitReached(replacement(3, 3))).toBe(true);
    expect(limitReached(replacement(0, 10))).toBe(true);
    expect(limitReached(replacement(2, 9))).toBe(false);
  });

  it('a limit with no exception is not eligible', () => {
    const d = replacement(3, 5);
    expect(limitBlocked(d)).toBe(true);
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('a supported exception lifts the block', () => {
    const d = replacement(3, 5);
    d.request.limitExceptionReason = 'non-receipt';
    d.request.limitExceptionEvidence = 'yes';
    expect(limitBlocked(d)).toBe(false);
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
  });

  it('an exception without documents does not lift the block', () => {
    const d = replacement(0, 11);
    d.request.limitExceptionReason = 'hardship';
    d.request.limitExceptionEvidence = 'no';
    expect(deriveApplicationClass(d)).toBe('not-eligible');
  });

  it('a legal name change does not count toward the limits', () => {
    const d = replacement(3, 10);
    d.request.nameChange = 'yes';
    d.request.nameChangeReason = 'marriage';
    d.evidence.nameChangeDocument = 'marriage-certificate';
    d.applicant.nameOnCard = 'Maria Elena Santos-Ruiz';
    expect(limitReached(d)).toBe(false);
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
  });
});

describe('dates', () => {
  it('computes whole years between two dates', () => {
    expect(yearsBetween('2000-06-15', '2026-06-14')).toBe(25);
    expect(yearsBetween('2000-06-15', '2026-06-15')).toBe(26);
    expect(yearsBetween(null, '2026-06-15')).toBeNull();
    expect(yearsBetween('2030-01-01', '2026-01-01')).toBeNull();
  });

  it('age is measured on the application date', () => {
    expect(ageAtApplication(ready())).toBe(32);
  });
});

describe('personas.json (shared oracle with the HTML engine)', () => {
  const file = resolve(process.cwd(), '../examples/personas.json');
  const personas = JSON.parse(readFileSync(file, 'utf8')).personas as {
    name: string;
    state: SocialSecurityApplication;
    expected: {
      applicationClass: string;
      missingEvidenceCount: number;
      replacementLimitReached: boolean;
      flaggedIssues: unknown[];
    };
  }[];

  it('has at least six personas', () => {
    expect(personas.length).toBeGreaterThanOrEqual(6);
  });

  for (const p of personas) {
    it(p.name, () => {
      const r = validateApplication(p.state);
      expect(r.applicationClass).toBe(p.expected.applicationClass);
      expect(r.missingEvidenceCount).toBe(p.expected.missingEvidenceCount);
      expect(r.replacementLimitReached).toBe(p.expected.replacementLimitReached);
      expect(detectFlaggedIssues(p.state)).toEqual(p.expected.flaggedIssues);
    });
  }
});
