import { describe, expect, it } from 'vitest';
import personasFile from '../../../../examples/personas.json';
import { createDefaultAssessment, createEngineDefaults } from './defaults';
import { gradeDevice } from './device-grader';
import type { EngineInput } from './types';

interface Persona {
  name: string;
  description: string;
  state: Partial<EngineInput>;
  expected: ReturnType<typeof gradeDevice>;
}

const personas = personasFile.personas as unknown as Persona[];

describe('gradeDevice against examples/personas.json', () => {
  it('has the 11 hand-authored personas', () => {
    expect(personas).toHaveLength(12);
  });

  for (const p of personas) {
    it(`${p.name}: ${p.description}`, () => {
      expect(gradeDevice(p.state)).toEqual(p.expected);
    });
  }
});

describe('software purpose "none"', () => {
  const base: Partial<EngineInput> = {
    intendedPurpose: 'Adhesive bandage.',
    deviceKind: 'non-invasive',
    softwarePurpose: 'none'
  };

  it('does not fire Rule 11', () => {
    const r = gradeDevice(base);
    expect(r.firedRules.some((x) => x.annexViiiRule === 11)).toBe(false);
    expect(r.computedDeviceClass).toBe('I');
  });

  it('does not raise F-SAMD-001', () => {
    const r = gradeDevice(base);
    expect(r.additionalFlags.map((f) => f.flagId)).not.toContain('F-SAMD-001');
  });

  it('still fires Rule 11 when the device kind is software', () => {
    const r = gradeDevice({ ...base, deviceKind: 'software' });
    expect(r.firedRules.some((x) => x.annexViiiRule === 11)).toBe(true);
    expect(r.additionalFlags.map((f) => f.flagId)).toContain('F-SAMD-001');
  });
});

describe('defaults', () => {
  it('the full wizard state extends the engine defaults', () => {
    const full = createDefaultAssessment();
    expect(full).toMatchObject(createEngineDefaults());
    expect(full.assessmentDate).toBeNull();
    expect(full.manufacturer.name).toBe('');
  });

  it('blocks classification until a purpose and kind are given', () => {
    const r = gradeDevice(createDefaultAssessment());
    expect(r.regulatoryReadiness).toBe('blocked');
    expect(r.computedDeviceClass).toBe('');
  });
});
