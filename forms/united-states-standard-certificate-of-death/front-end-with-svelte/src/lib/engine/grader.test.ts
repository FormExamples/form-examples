import { describe, expect, it } from 'vitest';
import { createDefaultCertificate } from './defaults.js';
import { validateCertificate } from './grader.js';
import { detectFlaggedIssues } from './flagged-issues.js';
import {
  daysBetween,
  expectedFee,
  isMechanism,
  pregnancyItemApplies,
  stateRule,
  STATE_RULES
} from './rules.js';
import type { DeathCertificate } from './types.js';

function validCertificate(): DeathCertificate {
  const d = createDefaultCertificate();
  d.jurisdiction.state = 'CA';
  Object.assign(d.decedent, {
    decedentName: 'Ellis, Margaret',
    sex: 'female',
    dateOfBirth: '1943-02-11',
    ageYears: 83
  });
  Object.assign(d.death, { placeOfDeathType: 'hospital-inpatient', dateOfDeath: '2026-06-19' });
  Object.assign(d.certifier, {
    certifierName: 'Dr. Rosa Okafor',
    certifierType: 'certifying-physician',
    certifierLicenseNumber: 'A123456',
    certificationDate: '2026-06-19',
    attendedDeceased: 'yes'
  });
  Object.assign(d.partI, {
    causeIaCondition: 'Aspiration pneumonia',
    causeIaInterval: '3 days',
    causeIbCondition: 'Ischemic stroke',
    causeIbInterval: '2 weeks'
  });
  Object.assign(d.manner, {
    mannerOfDeath: 'natural',
    tobaccoUseContributed: 'no',
    pregnancyStatus: 'not-applicable'
  });
  Object.assign(d.funeral, { funeralDirectorName: 'Delgado', dispositionMethod: 'burial' });
  return d;
}

describe('validateCertificate', () => {
  it('classifies a complete natural death as valid with the lowest line as underlying cause', () => {
    const r = validateCertificate(validCertificate());
    expect(r.validityClass).toBe('valid');
    expect(r.underlyingCause).toBe('Ischemic stroke');
    expect(r.referralIndicated).toBe(false);
    expect(r.flaggedIssues).toEqual([]);
  });

  it('classifies a blank certificate as incomplete', () => {
    const r = validateCertificate(createDefaultCertificate());
    expect(r.validityClass).toBe('incomplete');
    expect(r.flaggedIssues.map((f) => f.id)).toContain('F-MISSING-PART-I-001');
  });

  it('treats a mechanism as the only cause as incomplete', () => {
    const d = validCertificate();
    d.partI.causeIbCondition = '';
    d.partI.causeIaCondition = 'Cardiac arrest';
    expect(validateCertificate(d).validityClass).toBe('incomplete');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-MECHANISM-001');
  });

  it('accepts a mechanism when an etiology follows on a lower line', () => {
    const d = validCertificate();
    d.partI.causeIaCondition = 'Cardiac arrest';
    d.partI.causeIbCondition = 'Atherosclerotic coronary artery disease';
    expect(validateCertificate(d).validityClass).toBe('valid');
  });

  it('refers a non-natural manner to the medical examiner or coroner, ahead of completeness', () => {
    const d = createDefaultCertificate();
    d.manner.mannerOfDeath = 'homicide';
    expect(validateCertificate(d).validityClass).toBe('refer-to-medical-examiner-or-coroner');
  });

  it('does not refer when the medical examiner is the certifier', () => {
    const d = validCertificate();
    d.certifier.certifierType = 'medical-examiner';
    d.manner.mannerOfDeath = 'accident';
    expect(validateCertificate(d).referralIndicated).toBe(false);
  });

  it('refers an unattended death and injury wording in the cause lines', () => {
    const d = validCertificate();
    d.certifier.attendedDeceased = 'no';
    expect(validateCertificate(d).validityClass).toBe('refer-to-medical-examiner-or-coroner');
    const e = validCertificate();
    e.partI.causeIbCondition = 'Hip fracture';
    expect(validateCertificate(e).validityClass).toBe('refer-to-medical-examiner-or-coroner');
  });

  it('refers when a listed referral reason is selected', () => {
    const d = validCertificate();
    d.referral.referralReason = 'work-related';
    expect(validateCertificate(d).validityClass).toBe('refer-to-medical-examiner-or-coroner');
  });
});

describe('flags', () => {
  it('flags unwritten abbreviations and untyped diabetes', () => {
    const d = validCertificate();
    d.partI.causeIbCondition = 'COPD';
    d.partII.partIiConditions = 'Diabetes';
    const ids = detectFlaggedIssues(d).map((f) => f.id);
    expect(ids).toContain('F-ABBREVIATION-001');
    expect(ids).toContain('F-SPECIFICITY-001');
  });

  it('flags a pregnancy item blank for a woman aged 10 to 54', () => {
    const d = validCertificate();
    d.decedent.ageYears = 30;
    d.decedent.dateOfBirth = '1996-01-01';
    d.manner.pregnancyStatus = '';
    expect(pregnancyItemApplies(d)).toBe(true);
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-PREGNANCY-001');
    expect(validateCertificate(d).validityClass).toBe('incomplete');
  });

  it('flags late filing using business days for Washington', () => {
    const d = validCertificate();
    d.jurisdiction.state = 'WA';
    d.death.dateOfDeath = '2026-06-12';
    d.funeral.filedDate = '2026-06-18';
    expect(daysBetween('2026-06-12', '2026-06-18', true)).toBe(4);
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-FILING-DEADLINE-001');
  });

  it('flags an unlisted state for verification', () => {
    const d = validCertificate();
    d.jurisdiction.state = 'GA';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-VERIFY-STATE-001');
  });

  it('flags cremation while manner is pending', () => {
    const d = validCertificate();
    d.certifier.certifierType = 'medical-examiner';
    d.manner.mannerOfDeath = 'pending-investigation';
    d.funeral.dispositionMethod = 'cremation';
    const ids = detectFlaggedIssues(d).map((f) => f.id);
    expect(ids).toContain('F-CREMATION-HOLD-001');
    expect(ids).toContain('F-PENDING-001');
  });

  it('sorts flags high before medium before low', () => {
    const order = { high: 0, medium: 1, low: 2 } as const;
    const flags = detectFlaggedIssues(createDefaultCertificate());
    for (let i = 1; i < flags.length; i++) {
      expect(order[flags[i - 1].priority]).toBeLessThanOrEqual(order[flags[i].priority]);
    }
  });
});

describe('state rules', () => {
  it('has at least eight states including the required ones', () => {
    for (const s of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA'])
      expect(STATE_RULES[s]).toBeDefined();
  });

  it('computes the expected certified-copy fee', () => {
    const d = validCertificate();
    d.jurisdiction.state = 'FL';
    d.copies.certifiedCopiesRequested = 3;
    expect(expectedFee(d)).toBe(13);
    d.jurisdiction.state = 'CA';
    expect(expectedFee(d)).toBe(72);
  });

  it('falls back to the default rule for an unknown state', () => {
    const d = validCertificate();
    d.jurisdiction.state = 'ZZ';
    expect(stateRule(d).name).toMatch(/Default/);
  });

  it('recognizes mechanisms after normalizing', () => {
    expect(isMechanism('  Cardiac   Arrest. ')).toBe(true);
    expect(isMechanism('Aspiration pneumonia')).toBe(false);
  });
});

describe('personas parity with the HTML engine', () => {
  it('grades every persona exactly as examples/personas.json pins it', async () => {
    const mod = await import('../../../../examples/personas.json');
    const personas = mod.default.personas as {
      name: string;
      state: DeathCertificate;
      expected: {
        validityClass: string;
        underlyingCause: string;
        referralIndicated?: boolean;
        flaggedIssues: unknown[];
      };
    }[];
    expect(personas.length).toBeGreaterThanOrEqual(6);
    for (const p of personas) {
      const r = validateCertificate(p.state);
      expect(r.validityClass, p.name).toBe(p.expected.validityClass);
      expect(r.underlyingCause, p.name).toBe(p.expected.underlyingCause);
      expect(r.flaggedIssues, p.name).toEqual(p.expected.flaggedIssues);
    }
  });
});
