import { describe, expect, it } from 'vitest';
import personasFile from '../data/personas.json';
import { createDefaultAssessment, createEngineDefaults } from './defaults.js';
import { gradeFitNote } from './fit-note-grader.js';
import type { FitNoteEngineState, FitNoteGrade } from './types.js';

interface Persona {
  name: string;
  description: string;
  state: Partial<FitNoteEngineState>;
  expected: FitNoteGrade;
}

const personas = personasFile.personas as unknown as Persona[];

describe('gradeFitNote personas (examples/personas.json)', () => {
  it('ports all 13 personas', () => {
    expect(personas).toHaveLength(13);
  });

  for (const p of personas) {
    it(`${p.name}: ${p.description}`, () => {
      expect(gradeFitNote(p.state)).toEqual(p.expected);
    });
  }
});

describe('defaults', () => {
  it('uses "" for text/enum and null for numeric/date fields', () => {
    const d = createDefaultAssessment();
    expect(d.assessmentDate).toBeNull();
    expect(d.periodDurationDays).toBeNull();
    expect(d.employeeBirthDate).toBeNull();
    expect(d.fitnessAdvice).toBe('');
    expect(d.employeeName).toBe('');
    expect(d.status).toBe('draft');
  });

  it('blank wizard state grades the same as the engine defaults', () => {
    expect(gradeFitNote(createDefaultAssessment())).toEqual(gradeFitNote(createEngineDefaults()));
  });

  it('does not mutate its input', () => {
    const s = createDefaultAssessment();
    const copy = structuredClone(s);
    gradeFitNote(s);
    expect(s).toEqual(copy);
  });
});
