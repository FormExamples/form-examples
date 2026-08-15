import { describe, it, expect } from 'vitest';
import {
  singleAttorneyNoReplacement,
  onlyWhenNoCapacitySelected,
  noPeopleToNotify,
  instructionsLong,
  reducedFeeWithoutLPA120A,
  overFourAttorneysFlag,
} from './flag-rules.js';
import { createEmptyLpa, createEmptyPerson } from '#lib/factory.js';

describe('flag rules', () => {
  describe('SingleAttorneyNoReplacement', () => {
    it('fires when there is one attorney and no replacement', () => {
      const lpa = createEmptyLpa();
      lpa.attorneys.push({ person: createEmptyPerson(), ordinal: 1 });
      expect(singleAttorneyNoReplacement(lpa)?.ruleId).toBe(
        'SingleAttorneyNoReplacement',
      );
    });

    it('does not fire when a replacement attorney is listed', () => {
      const lpa = createEmptyLpa();
      lpa.attorneys.push({ person: createEmptyPerson(), ordinal: 1 });
      lpa.replacementAttorneys.push({
        person: createEmptyPerson(),
        ordinal: 1,
        replacementStepInCondition: '',
      });
      expect(singleAttorneyNoReplacement(lpa)).toBeNull();
    });

    it('does not fire when there are multiple attorneys', () => {
      const lpa = createEmptyLpa();
      lpa.attorneys.push({ person: createEmptyPerson(), ordinal: 1 });
      lpa.attorneys.push({ person: createEmptyPerson(), ordinal: 2 });
      expect(singleAttorneyNoReplacement(lpa)).toBeNull();
    });
  });

  describe('OnlyWhenNoCapacitySelected', () => {
    it('fires when section 5 = only_when_no_capacity', () => {
      const lpa = createEmptyLpa();
      lpa.whenAttorneysCanAct = 'only_when_no_capacity';
      expect(onlyWhenNoCapacitySelected(lpa)?.ruleId).toBe(
        'OnlyWhenNoCapacitySelected',
      );
    });

    it('does not fire when section 5 = as_soon_as_registered', () => {
      const lpa = createEmptyLpa();
      lpa.whenAttorneysCanAct = 'as_soon_as_registered';
      expect(onlyWhenNoCapacitySelected(lpa)).toBeNull();
    });
  });

  describe('NoPeopleToNotify', () => {
    it('fires on an empty LPA', () => {
      expect(noPeopleToNotify(createEmptyLpa())?.ruleId).toBe('NoPeopleToNotify');
    });

    it('does not fire when at least one person-to-notify is listed', () => {
      const lpa = createEmptyLpa();
      lpa.peopleToNotify.push({ person: createEmptyPerson(), ordinal: 1 });
      expect(noPeopleToNotify(lpa)).toBeNull();
    });
  });

  describe('InstructionsLong', () => {
    it('fires when instructions exceed 500 characters', () => {
      const lpa = createEmptyLpa();
      lpa.instructionsText = 'x'.repeat(501);
      expect(instructionsLong(lpa)?.ruleId).toBe('InstructionsLong');
    });

    it('does not fire at exactly 500 characters', () => {
      const lpa = createEmptyLpa();
      lpa.instructionsText = 'x'.repeat(500);
      expect(instructionsLong(lpa)).toBeNull();
    });
  });

  describe('ReducedFeeWithoutLPA120A', () => {
    it('fires when reduced fee is requested but no LPA120A evidence', () => {
      const lpa = createEmptyLpa();
      lpa.registrationApplication.reducedFeeRequested = true;
      lpa.registrationApplication.hasLpa120aEvidence = false;
      expect(reducedFeeWithoutLPA120A(lpa)?.ruleId).toBe(
        'ReducedFeeWithoutLPA120A',
      );
    });

    it('does not fire when LPA120A evidence is provided', () => {
      const lpa = createEmptyLpa();
      lpa.registrationApplication.reducedFeeRequested = true;
      lpa.registrationApplication.hasLpa120aEvidence = true;
      expect(reducedFeeWithoutLPA120A(lpa)).toBeNull();
    });

    it('does not fire when no reduced fee is requested', () => {
      const lpa = createEmptyLpa();
      lpa.registrationApplication.reducedFeeRequested = false;
      expect(reducedFeeWithoutLPA120A(lpa)).toBeNull();
    });
  });

  describe('OverFourAttorneysFlag', () => {
    it('fires with 5 attorneys', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 5; i++) {
        lpa.attorneys.push({ person: createEmptyPerson(), ordinal: i });
      }
      const result = overFourAttorneysFlag(lpa);
      expect(result).not.toBeNull();
    });

    it('does not fire with 4 attorneys', () => {
      const lpa = createEmptyLpa();
      for (let i = 1; i <= 4; i++) {
        lpa.attorneys.push({ person: createEmptyPerson(), ordinal: i });
      }
      expect(overFourAttorneysFlag(lpa)).toBeNull();
    });
  });
});
