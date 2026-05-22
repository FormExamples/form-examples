import { describe, it, expect } from 'vitest';
import { validateLpa } from './validator.js';
import { createEmptyLpa } from '$lib/factory.js';

describe('validateLpa happy path', () => {
  it('returns a ValidationResult for an empty LPA', () => {
    const result = validateLpa(createEmptyLpa());
    expect(result).toBeTruthy();
    expect(Array.isArray(result.firedRules)).toBe(true);
    expect(Array.isArray(result.additionalFlags)).toBe(true);
  });

  it('starts an empty LPA in the draft validity band', () => {
    const result = validateLpa(createEmptyLpa());
    expect(result.validityBand).toBe('draft');
  });

  it('promotes composite risk to critical when blockers fire', () => {
    const lpa = createEmptyLpa();
    // Empty LPA has no attorneys, so NoAttorneyAppointed fires.
    const result = validateLpa(lpa);
    expect(result.firedRules.length).toBeGreaterThan(0);
    expect(result.compositeRisk).toBe('critical');
  });
});
