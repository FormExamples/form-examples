import { describe, it, expect } from 'vitest';
import {
  donorUnderEighteen,
  attorneyUnderEighteen,
  noAttorneyAppointed,
  certificateProviderIsAttorney,
  witnessIsAttorney,
  attorneyBankruptOrDRO,
  jointlyButNoReplacement,
  peopleToNotifyExceedsFive,
  personToNotifyIsAttorney,
  attorneyWitnessIsDonor,
  overFourAttorneysNoContinuation,
} from './blocker-rules.js';
import { createEmptyLpa, createEmptyPerson } from '#lib/factory.js';

// Reference date used to age-compute against; the rules fall back to today
// when signedDate is empty, but we pin it for determinism.
const REFERENCE_DATE = '2030-01-01';

describe('blocker rules', () => {
  describe('DonorUnderEighteen', () => {
    it('fires when the donor is under 18 at the reference date', () => {
      const lpa = createEmptyLpa();
      lpa.signedDate = REFERENCE_DATE;
      lpa.donor.dateOfBirth = '2015-06-15'; // ~14yo on 2030-01-01
      const result = donorUnderEighteen(lpa);
      expect(result).not.toBeNull();
      expect(result?.ruleId).toBe('DonorUnderEighteen');
    });

    it('does not fire when the donor is 18 or older', () => {
      const lpa = createEmptyLpa();
      lpa.signedDate = REFERENCE_DATE;
      lpa.donor.dateOfBirth = '1990-06-15';
      expect(donorUnderEighteen(lpa)).toBeNull();
    });
  });

  describe('AttorneyUnderEighteen', () => {
    it('fires when an attorney is under 18', () => {
      const lpa = createEmptyLpa();
      lpa.signedDate = REFERENCE_DATE;
      const minor = createEmptyPerson();
      minor.firstNames = 'Minor';
      minor.lastName = 'Attorney';
      minor.dateOfBirth = '2015-06-15';
      lpa.attorneys.push({ person: minor, ordinal: 1 });
      const result = attorneyUnderEighteen(lpa);
      expect(result).not.toBeNull();
      expect(result?.ruleId).toBe('AttorneyUnderEighteen');
    });
  });

  describe('NoAttorneyAppointed', () => {
    it('fires when there are zero attorneys', () => {
      const lpa = createEmptyLpa();
      const result = noAttorneyAppointed(lpa);
      expect(result).not.toBeNull();
      expect(result?.ruleId).toBe('NoAttorneyAppointed');
    });

    it('does not fire when at least one attorney is listed', () => {
      const lpa = createEmptyLpa();
      lpa.attorneys.push({ person: createEmptyPerson(), ordinal: 1 });
      expect(noAttorneyAppointed(lpa)).toBeNull();
    });
  });

  describe('CertificateProviderIsAttorney', () => {
    it('fires when the certificate provider is also an attorney', () => {
      const lpa = createEmptyLpa();
      const shared = createEmptyPerson();
      shared.firstNames = 'Sam';
      shared.lastName = 'Smith';
      shared.dateOfBirth = '1980-01-01';
      lpa.attorneys.push({ person: shared, ordinal: 1 });
      lpa.certificateProvider = {
        person: shared,
        knowsDonorAs: 'friend',
        isOverEighteen: true,
        readLpa: true,
        noRestrictionsOnActing: true,
        isRelatedToDonorOrAttorney: false,
        isCareHomeOwnerOrEmployee: false,
        eligibilityConfirmationAt: '',
      };
      const result = certificateProviderIsAttorney(lpa);
      expect(result).not.toBeNull();
      expect(result?.ruleId).toBe('CertificateProviderIsAttorney');
    });
  });

  describe('WitnessIsAttorney', () => {
    it('fires when the donor signature witness is also an attorney', () => {
      const lpa = createEmptyLpa();
      const attorneyPerson = createEmptyPerson();
      attorneyPerson.firstNames = 'Wit';
      attorneyPerson.lastName = 'Ness';
      attorneyPerson.dateOfBirth = '1980-01-01';
      lpa.attorneys.push({ person: attorneyPerson, ordinal: 1 });
      lpa.signatures.push({
        id: 'sig-donor-1',
        signatoryPersonId: lpa.donor.id,
        role: 'donor',
        lp1fSection: 9,
        signatureBlobPath: '',
        signedOn: '',
        signedOnBehalfFullName: '',
        isWitnessed: true,
        witness: {
          person: attorneyPerson,
          witnessSignatureBlobPath: '',
          witnessedOn: '',
        },
      });
      const result = witnessIsAttorney(lpa);
      expect(result).not.toBeNull();
      expect(result?.ruleId).toBe('WitnessIsAttorney');
    });
  });

  describe('AttorneyBankruptOrDRO', () => {
    it('fires when an attorney is bankrupt', () => {
      const lpa = createEmptyLpa();
      const bankrupt = createEmptyPerson();
      bankrupt.dateOfBirth = '1970-01-01';
      bankrupt.isBankrupt = true;
      lpa.attorneys.push({ person: bankrupt, ordinal: 1 });
      const result = attorneyBankruptOrDRO(lpa);
      expect(result?.ruleId).toBe('AttorneyBankruptOrDRO');
    });

    it('fires when an attorney has a debt relief order', () => {
      const lpa = createEmptyLpa();
      const dro = createEmptyPerson();
      dro.dateOfBirth = '1970-01-01';
      dro.hasDebtReliefOrder = true;
      lpa.attorneys.push({ person: dro, ordinal: 1 });
      expect(attorneyBankruptOrDRO(lpa)?.ruleId).toBe('AttorneyBankruptOrDRO');
    });

    it('does not fire when no attorney is bankrupt', () => {
      const lpa = createEmptyLpa();
      const clean = createEmptyPerson();
      clean.dateOfBirth = '1970-01-01';
      lpa.attorneys.push({ person: clean, ordinal: 1 });
      expect(attorneyBankruptOrDRO(lpa)).toBeNull();
    });
  });

  describe('JointlyButNoReplacement', () => {
    it('fires when decisionMode is jointly and no replacement is listed', () => {
      const lpa = createEmptyLpa();
      lpa.decisionMode = 'jointly';
      expect(jointlyButNoReplacement(lpa)?.ruleId).toBe('JointlyButNoReplacement');
    });

    it('does not fire when a replacement attorney is listed', () => {
      const lpa = createEmptyLpa();
      lpa.decisionMode = 'jointly';
      lpa.replacementAttorneys.push({
        person: createEmptyPerson(),
        ordinal: 1,
        replacementStepInCondition: '',
      });
      expect(jointlyButNoReplacement(lpa)).toBeNull();
    });

    it('does not fire when decisionMode is jointly_and_severally', () => {
      const lpa = createEmptyLpa();
      lpa.decisionMode = 'jointly_and_severally';
      expect(jointlyButNoReplacement(lpa)).toBeNull();
    });
  });

  describe('PeopleToNotifyExceedsFive', () => {
    it('fires with six people-to-notify', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 6; i++) {
        lpa.peopleToNotify.push({ person: createEmptyPerson(), ordinal: i });
      }
      expect(peopleToNotifyExceedsFive(lpa)?.ruleId).toBe('PeopleToNotifyExceedsFive');
    });

    it('does not fire with five or fewer', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 5; i++) {
        lpa.peopleToNotify.push({ person: createEmptyPerson(), ordinal: i });
      }
      expect(peopleToNotifyExceedsFive(lpa)).toBeNull();
    });
  });

  describe('PersonToNotifyIsAttorney', () => {
    it('fires when the same person is both an attorney and a person-to-notify', () => {
      const lpa = createEmptyLpa();
      const shared = createEmptyPerson();
      shared.firstNames = 'Dual';
      shared.lastName = 'Role';
      shared.dateOfBirth = '1970-01-01';
      lpa.attorneys.push({ person: shared, ordinal: 1 });
      lpa.peopleToNotify.push({ person: { ...shared }, ordinal: 1 });
      expect(personToNotifyIsAttorney(lpa)?.ruleId).toBe('PersonToNotifyIsAttorney');
    });
  });

  describe('AttorneyWitnessIsDonor', () => {
    it('fires when an attorney signature witness is the donor', () => {
      const lpa = createEmptyLpa();
      lpa.donor.firstNames = 'Dee';
      lpa.donor.lastName = 'Donor';
      lpa.donor.dateOfBirth = '1955-01-01';
      const attorney = createEmptyPerson();
      attorney.firstNames = 'Aaron';
      attorney.lastName = 'Attorney';
      attorney.dateOfBirth = '1980-01-01';
      lpa.attorneys.push({ person: attorney, ordinal: 1 });
      lpa.signatures.push({
        id: 'sig-att-1',
        signatoryPersonId: attorney.id,
        role: 'attorney',
        lp1fSection: 11,
        signatureBlobPath: '',
        signedOn: '',
        signedOnBehalfFullName: '',
        isWitnessed: true,
        witness: {
          person: { ...lpa.donor },
          witnessSignatureBlobPath: '',
          witnessedOn: '',
        },
      });
      expect(attorneyWitnessIsDonor(lpa)?.ruleId).toBe('AttorneyWitnessIsDonor');
    });
  });

  describe('OverFourAttorneysNoContinuation', () => {
    it('fires with 5 attorneys and no LPC continuation sheet 1', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 5; i++) {
        const p = createEmptyPerson();
        p.dateOfBirth = '1980-01-01';
        lpa.attorneys.push({ person: p, ordinal: i });
      }
      expect(overFourAttorneysNoContinuation(lpa)?.ruleId).toBe(
        'OverFourAttorneysNoContinuation',
      );
    });

    it('does not fire with 4 attorneys', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 4; i++) {
        lpa.attorneys.push({ person: createEmptyPerson(), ordinal: i });
      }
      expect(overFourAttorneysNoContinuation(lpa)).toBeNull();
    });
  });
});
