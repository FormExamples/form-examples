import { describe, it, expect } from 'vitest';
import { deriveRegistrationClass, validateRegistration } from './registration-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  daysBetween,
  deadlineStatus,
  informantQualified,
  blockingRules,
  coronerPending
} from './registration-rules';
import type { Registration } from './types';
import personas from '../../../../examples/personas.json';

/**
 * A blank registration (mirrors the store's `createDefaultRegistration`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/env` module.
 */
function blank(): Registration {
  return {
    deceased: {
      deceasedName: '',
      sex: '',
      dateOfBirth: null,
      dateOfDeath: null,
      placeOfDeath: '',
      deathJurisdiction: '',
      deceasedParticularsKnown: ''
    },
    medical: { mccdReceived: '', medicalExaminerStatus: '', medicalExaminerConfirmationDate: null },
    coroner: { referredToCoroner: '', coronerStage: '', coronerCertificateReceived: '' },
    informant: { informantName: '', informantRelationship: '', informantAddress: '' },
    registration: {
      registerOffice: '',
      appointmentBooked: '',
      supportingDocumentsAvailable: '',
      registrationDate: null,
      asOfDate: null
    },
    aftercare: {
      disposalMethod: '',
      disposalCertificateIssued: '',
      tellUsOnceStatus: '',
      tellUsOnceReference: '',
      copiesRequested: null,
      copyOrderChannel: '',
      groIndexReference: '',
      priorityService: ''
    }
  };
}

/** A registration that is ready: confirmed, not a coroner case, qualified informant. */
function ready(): Registration {
  const d = blank();
  d.deceased = {
    deceasedName: 'Margaret Ellis',
    sex: 'female',
    dateOfBirth: '1941-03-14',
    dateOfDeath: '2026-08-31',
    placeOfDeath: 'Reading',
    deathJurisdiction: 'england-wales',
    deceasedParticularsKnown: 'yes'
  };
  d.medical = {
    mccdReceived: 'yes',
    medicalExaminerStatus: 'confirmed',
    medicalExaminerConfirmationDate: '2026-09-01'
  };
  d.coroner.referredToCoroner = 'no';
  d.informant = {
    informantName: 'Peter Ellis',
    informantRelationship: 'relative-present-at-death',
    informantAddress: '4 Mill Lane'
  };
  d.registration.asOfDate = '2026-09-02';
  return d;
}

describe('daysBetween', () => {
  it('counts whole days between ISO dates', () => {
    expect(daysBetween('2026-09-01', '2026-09-06')).toBe(5);
    expect(daysBetween('2026-09-06', '2026-09-01')).toBe(-5);
  });
  it('returns null for unusable input', () => {
    expect(daysBetween(null, '2026-09-01')).toBeNull();
    expect(daysBetween('2026-09-01', 'nonsense')).toBeNull();
  });
});

describe('informantQualified', () => {
  it('accepts the six section 16 categories and rejects the rest', () => {
    const d = ready();
    expect(informantQualified(d)).toBe(true);
    d.informant.informantRelationship = 'not-qualified';
    expect(informantQualified(d)).toBe(false);
    d.informant.informantRelationship = '';
    expect(informantQualified(d)).toBe(false);
  });
});

describe('deadlineStatus', () => {
  it('is on-track at day 3, due-soon at day 4 and 5, overdue at day 6', () => {
    const d = ready();
    d.registration.asOfDate = '2026-09-04';
    expect(deadlineStatus(d)).toBe('on-track');
    d.registration.asOfDate = '2026-09-05';
    expect(deadlineStatus(d)).toBe('due-soon');
    d.registration.asOfDate = '2026-09-06';
    expect(deadlineStatus(d)).toBe('due-soon');
    d.registration.asOfDate = '2026-09-07';
    expect(deadlineStatus(d)).toBe('overdue');
  });
  it('is not-started without a confirmation date', () => {
    const d = ready();
    d.medical.medicalExaminerConfirmationDate = null;
    expect(deadlineStatus(d)).toBe('not-started');
  });
  it('is paused while a coroner referral is pending', () => {
    const d = ready();
    d.coroner.referredToCoroner = 'yes';
    expect(coronerPending(d)).toBe(true);
    expect(deadlineStatus(d)).toBe('paused-coroner');
  });
  it('is registered or registered-late once a registration date is set', () => {
    const d = ready();
    d.registration.registrationDate = '2026-09-06';
    expect(deadlineStatus(d)).toBe('registered');
    d.registration.registrationDate = '2026-09-07';
    expect(deadlineStatus(d)).toBe('registered-late');
  });
});

describe('deriveRegistrationClass', () => {
  it('classifies a complete, confirmed registration as ready-to-register', () => {
    expect(deriveRegistrationClass(ready())).toBe('ready-to-register');
  });
  it('classifies a blank registration as incomplete', () => {
    expect(deriveRegistrationClass(blank())).toBe('incomplete');
    expect(blockingRules(blank()).length).toBe(7);
  });
  it('classifies a pending coroner referral ahead of any other issue', () => {
    const d = blank();
    d.coroner.referredToCoroner = 'yes';
    expect(deriveRegistrationClass(d)).toBe('referred-to-coroner-pending');
  });
  it('lets the coroner certificate replace the MCCD and medical examiner', () => {
    const d = ready();
    d.medical = {
      mccdReceived: '',
      medicalExaminerStatus: '',
      medicalExaminerConfirmationDate: null
    };
    d.coroner = {
      referredToCoroner: 'yes',
      coronerStage: 'released-no-inquest',
      coronerCertificateReceived: 'yes'
    };
    expect(deriveRegistrationClass(d)).toBe('ready-to-register');
  });
  it('is incomplete for a death outside England and Wales', () => {
    const d = ready();
    d.deceased.deathJurisdiction = 'scotland';
    expect(deriveRegistrationClass(d)).toBe('incomplete');
  });
  it('is incomplete for an unqualified informant', () => {
    const d = ready();
    d.informant.informantRelationship = 'not-qualified';
    expect(deriveRegistrationClass(d)).toBe('incomplete');
  });
  it('is registered once a registration date is set', () => {
    const d = ready();
    d.registration.registrationDate = '2026-09-02';
    expect(deriveRegistrationClass(d)).toBe('registered');
  });
});

describe('detectFlaggedIssues', () => {
  it('raises no flags for a tidy ready registration', () => {
    const d = ready();
    d.registration.appointmentBooked = 'yes';
    d.registration.supportingDocumentsAvailable = 'yes';
    d.aftercare.copiesRequested = 3;
    d.aftercare.copyOrderChannel = 'at-registration';
    expect(detectFlaggedIssues(d)).toEqual([]);
  });
  it('flags an overdue registration', () => {
    const d = ready();
    d.registration.asOfDate = '2026-09-10';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-DEADLINE-OVERDUE-001');
  });
  it('sorts flags high before medium before low', () => {
    const d = ready();
    d.registration.asOfDate = '2026-09-10';
    d.deceased.deceasedParticularsKnown = 'no';
    const order = detectFlaggedIssues(d).map((f) => f.priority);
    const rank = { high: 0, medium: 1, low: 2 } as const;
    expect([...order].sort((a, b) => rank[a] - rank[b])).toEqual(order);
  });
});

describe('personas oracle', () => {
  for (const p of personas.personas) {
    it(p.name, () => {
      const d = p.state as unknown as Registration;
      const r = validateRegistration(d);
      expect(r.registrationClass).toBe(p.expected.registrationClass);
      expect(r.deadlineStatus).toBe(p.expected.deadlineStatus);
      expect(r.daysSinceConfirmation).toBe(p.expected.daysSinceConfirmation);
      expect(r.informantQualified).toBe(p.expected.informantQualified);
      expect(r.blockingRules).toEqual(p.expected.blockingRules);
      expect(r.flaggedIssues).toEqual(p.expected.flaggedIssues);
    });
  }
});
