import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveReadinessClass, validateRegistration } from './grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  daysSinceBirth,
  identityInsufficient,
  informantProblem,
  missingItems,
  outOfScopeReason,
  paternityRouteProblem
} from './rules';
import type { BirthRegistration, FlaggedIssue, ReadinessClass } from './types';

interface Persona {
  name: string;
  state: BirthRegistration;
  expected: {
    readinessClass: ReadinessClass;
    daysSinceBirth: number | null;
    lateRegistration: string;
    missingItemCount: number;
    flaggedIssues: FlaggedIssue[];
  };
}

const personas: Persona[] = JSON.parse(
  readFileSync(new URL('../../../../examples/personas.json', import.meta.url), 'utf8')
).personas;

/** A blank application (mirrors the store's `createDefaultRegistration`). */
function blank(): BirthRegistration {
  return {
    child: {
      childForenames: '',
      childSurname: '',
      sex: '',
      dateOfBirth: null,
      timeOfBirth: null,
      placeOfBirthType: '',
      placeOfBirth: '',
      birthCountry: '',
      multipleBirth: '',
      stillbirth: ''
    },
    mother: {
      motherName: '',
      motherMaidenSurname: '',
      motherDateOfBirth: null,
      motherPlaceOfBirth: '',
      motherOccupation: '',
      motherAddress: ''
    },
    parentage: {
      parentsRelationship: '',
      marriageDate: null,
      secondParentIncluded: '',
      secondParentName: '',
      secondParentDateOfBirth: null,
      secondParentPlaceOfBirth: '',
      secondParentOccupation: '',
      paternityBasis: '',
      paternityEvidenceHeld: '',
      licensedClinicTreatment: ''
    },
    informant: {
      informantRelationship: '',
      informantName: '',
      parentsUnableToRegister: '',
      registrationRoute: '',
      registrationDate: null,
      identityPrimaryDocument: '',
      identitySecondaryCount: null,
      identityOriginals: '',
      redBookPresented: ''
    },
    certificate: {
      certificatesRequested: null,
      serviceLevel: '',
      deliveryAddress: '',
      paymentConfirmed: '',
      applicantNote: ''
    }
  };
}

const ready = (): BirthRegistration => structuredClone(personas[0].state);

describe('personas (parity with the HTML engine)', () => {
  for (const p of personas) {
    it(p.name, () => {
      const r = validateRegistration(p.state);
      expect(r.readinessClass).toBe(p.expected.readinessClass);
      expect(r.daysSinceBirth).toBe(p.expected.daysSinceBirth);
      expect(r.lateRegistration).toBe(p.expected.lateRegistration);
      expect(r.missingItemCount).toBe(p.expected.missingItemCount);
      expect(detectFlaggedIssues(p.state)).toEqual(p.expected.flaggedIssues);
    });
  }
});

describe('deriveReadinessClass', () => {
  it('a blank application is incomplete', () => {
    expect(deriveReadinessClass(blank())).toBe('incomplete');
  });

  it('a complete married-parents application is ready to submit', () => {
    expect(deriveReadinessClass(ready())).toBe('ready-to-submit');
  });

  it('out-of-scope takes precedence over incomplete', () => {
    const d = blank();
    d.child.stillbirth = 'yes';
    expect(deriveReadinessClass(d)).toBe('out-of-scope');
  });

  it('a birth in Scotland is out of scope', () => {
    const d = ready();
    d.child.birthCountry = 'scotland';
    expect(outOfScopeReason(d)).toBe('other-country');
    expect(deriveReadinessClass(d)).toBe('out-of-scope');
  });

  it('incomplete takes precedence over needs-additional-evidence', () => {
    const d = ready();
    d.child.childSurname = '';
    d.informant.identityPrimaryDocument = 'none';
    expect(deriveReadinessClass(d)).toBe('incomplete');
  });

  it('41 and 42 days are on time; 43 days is late but still ready', () => {
    const d = ready();
    d.child.dateOfBirth = '2026-08-01';
    d.informant.registrationDate = '2026-09-12';
    expect(daysSinceBirth(d)).toBe(42);
    expect(validateRegistration(d).lateRegistration).toBe('no');
    d.informant.registrationDate = '2026-09-13';
    const r = validateRegistration(d);
    expect(r.lateRegistration).toBe('yes');
    expect(r.readinessClass).toBe('ready-to-submit');
    expect(r.flaggedIssues.map((f) => f.id)).toContain('F-LATE-REGISTRATION-001');
  });

  it('more than 365 days needs additional evidence', () => {
    const d = ready();
    d.informant.registrationDate = '2027-09-01';
    expect(deriveReadinessClass(d)).toBe('needs-additional-evidence');
  });
});

describe('informant and parentage rules', () => {
  it('an informant who is not a qualified informant is flagged', () => {
    const d = ready();
    d.informant.informantRelationship = 'other';
    expect(informantProblem(d)).toBe('not-qualified');
  });

  it('a bystander may register only when the parents cannot', () => {
    const d = ready();
    d.informant.informantRelationship = 'person-present-at-birth';
    d.informant.parentsUnableToRegister = 'no';
    expect(informantProblem(d)).toBe('parents-able-to-register');
    d.informant.parentsUnableToRegister = 'yes';
    expect(informantProblem(d)).toBe('');
  });

  it('an unmarried father needs joint registration, a declaration or a court document', () => {
    const d = ready();
    d.parentage.parentsRelationship = 'unmarried';
    d.parentage.paternityBasis = 'none';
    expect(paternityRouteProblem(d)).toBe('basis-not-valid');
    d.parentage.paternityBasis = 'statutory-declaration';
    expect(paternityRouteProblem(d)).toBe('');
  });

  it('a male couple needs a parental order', () => {
    const d = ready();
    d.parentage.parentsRelationship = 'male-couple';
    d.parentage.paternityBasis = 'statutory-declaration';
    expect(paternityRouteProblem(d)).toBe('basis-not-valid');
    d.parentage.paternityBasis = 'parental-order';
    expect(paternityRouteProblem(d)).toBe('');
  });
});

describe('identity evidence', () => {
  it('one accepted document is enough; one secondary is not; two secondary are', () => {
    const d = ready();
    expect(identityInsufficient(d)).toBe(false);
    d.informant.identityPrimaryDocument = 'none';
    d.informant.identitySecondaryCount = 1;
    expect(identityInsufficient(d)).toBe(true);
    d.informant.identitySecondaryCount = 2;
    expect(identityInsufficient(d)).toBe(false);
  });
});

describe('missingItems', () => {
  it('requires a delivery address only when certificates are ordered', () => {
    const d = ready();
    d.certificate.certificatesRequested = 0;
    d.certificate.deliveryAddress = '';
    expect(missingItems(d).map((m) => m.id)).not.toContain('delivery-address');
    d.certificate.certificatesRequested = 1;
    expect(missingItems(d).map((m) => m.id)).toContain('delivery-address');
  });
});
