import { describe, it, expect } from 'vitest';
import {
  applyClavienDindoRules,
  clavienDindoToRisk,
} from './clavien-dindo-rules.js';
import { createEmptyOperationNote } from './factory.js';

describe('clavienDindoToRisk', () => {
  it('maps grade 0 to routine', () => {
    expect(clavienDindoToRisk('0')).toBe('routine');
  });
  it('maps grades I and II to complicated', () => {
    expect(clavienDindoToRisk('I')).toBe('complicated');
    expect(clavienDindoToRisk('II')).toBe('complicated');
  });
  it('maps grades IIIa and IIIb to high-risk', () => {
    expect(clavienDindoToRisk('IIIa')).toBe('high-risk');
    expect(clavienDindoToRisk('IIIb')).toBe('high-risk');
  });
  it('maps grades IVa, IVb, and V to critical', () => {
    expect(clavienDindoToRisk('IVa')).toBe('critical');
    expect(clavienDindoToRisk('IVb')).toBe('critical');
    expect(clavienDindoToRisk('V')).toBe('critical');
  });
});

describe('applyClavienDindoRules', () => {
  it('returns grade 0 with no fired rules when nothing recorded', () => {
    const data = createEmptyOperationNote();
    const r = applyClavienDindoRules(data);
    expect(r.grade).toBe('0');
    expect(r.firedRules).toHaveLength(0);
  });

  it('returns grade 0 with no fired rules when explicitly 0', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.clavienDindoGrade = '0';
    const r = applyClavienDindoRules(data);
    expect(r.grade).toBe('0');
    expect(r.firedRules).toHaveLength(0);
  });

  it('emits a R-CD-IIIb rule for grade IIIb', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.clavienDindoGrade = 'IIIb';
    const r = applyClavienDindoRules(data);
    expect(r.grade).toBe('IIIb');
    expect(r.firedRules).toHaveLength(1);
    expect(r.firedRules[0].ruleId).toBe('R-CD-IIIb');
    expect(r.firedRules[0].instrument).toBe('clavien-dindo');
  });

  it('emits a R-CD-V rule for grade V', () => {
    const data = createEmptyOperationNote();
    data.safetyCountsEbl.clavienDindoGrade = 'V';
    const r = applyClavienDindoRules(data);
    expect(r.grade).toBe('V');
    expect(r.firedRules[0].ruleId).toBe('R-CD-V');
  });

  it('has unique rule IDs across each non-zero grade', () => {
    const grades: Array<'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V'> = [
      'I',
      'II',
      'IIIa',
      'IIIb',
      'IVa',
      'IVb',
      'V',
    ];
    const ids = grades.map((g) => {
      const data = createEmptyOperationNote();
      data.safetyCountsEbl.clavienDindoGrade = g;
      return applyClavienDindoRules(data).firedRules[0].ruleId;
    });
    expect(new Set(ids).size).toBe(grades.length);
  });
});
