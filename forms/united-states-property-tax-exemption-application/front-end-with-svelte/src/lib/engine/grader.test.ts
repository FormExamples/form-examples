import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDefaultApplication } from './defaults.js';
import { detectFlaggedIssues } from './flags.js';
import { filingDeadline, STATE_RULES } from './rules.js';
import { gradeApplication } from './grader.js';
import type { PropertyTaxApplication } from './types.js';

interface Persona {
  name: string;
  state: PropertyTaxApplication;
  expected: {
    eligibilityClass: string;
    filingDeadline: string | null;
    filedLate: boolean;
    qualifyingExemptions: string[];
    flaggedIssues: { id: string; priority: string }[];
  };
}

const personas: Persona[] = JSON.parse(
  readFileSync(resolve(process.cwd(), '../examples/personas.json'), 'utf8')
).personas;

describe('persona parity with the HTML engine', () => {
  for (const p of personas) {
    it(p.name, () => {
      const g = gradeApplication(p.state);
      expect(g.eligibilityClass).toBe(p.expected.eligibilityClass);
      expect(g.filingDeadline).toBe(p.expected.filingDeadline);
      expect(g.filedLate).toBe(p.expected.filedLate);
      expect(g.qualifyingExemptions).toEqual(p.expected.qualifyingExemptions);
      const flags = detectFlaggedIssues(p.state).map((f) => ({ id: f.id, priority: f.priority }));
      expect(flags).toEqual(
        p.expected.flaggedIssues.map((f) => ({ id: f.id, priority: f.priority }))
      );
    });
  }
});

describe('classification', () => {
  it('a blank application is incomplete with a signature flag', () => {
    const d = createDefaultApplication();
    expect(gradeApplication(d).eligibilityClass).toBe('incomplete');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-SIGNATURE-001');
  });

  it('not owning on the assessment date is likely ineligible', () => {
    const d = structuredClone(personas[0].state);
    d.property.ownerOnAssessmentDate = 'no';
    expect(gradeApplication(d).eligibilityClass).toBe('likely-ineligible');
    expect(detectFlaggedIssues(d)[0].id).toBe('F-OWNERSHIP-001');
  });

  it('an unknown state raises the verify flag and has no deadline', () => {
    const d = structuredClone(personas[0].state);
    d.property.state = 'ZZ';
    expect(filingDeadline(d)).toBeNull();
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-STATE-VERIFY-001');
  });
});

describe('STATE_RULES', () => {
  it('covers the eight required states', () => {
    for (const s of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA']) {
      expect(STATE_RULES[s]).toBeDefined();
    }
  });

  it('derives the Pennsylvania deadline from the prior year', () => {
    const d = createDefaultApplication();
    d.property.state = 'PA';
    d.filing.assessmentYear = 2026;
    expect(filingDeadline(d)).toBe('2025-03-01');
  });
});
