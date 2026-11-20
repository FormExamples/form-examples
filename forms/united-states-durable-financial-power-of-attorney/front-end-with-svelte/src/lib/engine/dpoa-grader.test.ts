import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { deriveValidityClass, validateInstrument } from './dpoa-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { STATE_RULES, DEFAULT_RULE, ruleFor, stateUnknown } from './dpoa-rules';
import { createDefaultInstrument } from './defaults';
import type { PowerOfAttorney } from './types';

interface Persona {
  name: string;
  state: PowerOfAttorney;
  expected: {
    validityClass: string;
    governingState: string;
    executionRiskIndicated: boolean;
    firedRules: unknown[];
    flaggedIssues: unknown[];
  };
}

const personas: Persona[] = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../../../../examples/personas.json', import.meta.url)),
    'utf8'
  )
).personas;

/** A fully ready Texas plan to mutate in the focused tests. */
function ready(): PowerOfAttorney {
  const d = createDefaultInstrument();
  d.principal = {
    principalName: 'P',
    dateOfBirth: null,
    state: 'TX',
    principalAddress: '',
    capacityConfirmed: 'yes'
  };
  d.instrument = {
    durableStatement: 'yes',
    effectiveness: 'immediate',
    springingTrigger: '',
    statutoryNoticeIncluded: ''
  };
  d.agents.agentName = 'A';
  d.agents.agentIsAdult = 'yes';
  d.authority.grantBanking = 'yes';
  d.execution = { notaryArranged: 'yes', witnessCount: 0, witnessIsAgent: 'no' };
  return d;
}

describe('state rules', () => {
  it('encodes the eight verified states plus a default', () => {
    expect(Object.keys(STATE_RULES).sort()).toEqual(
      ['CA', 'FL', 'IL', 'NY', 'OH', 'PA', 'TX', 'WA'].sort()
    );
    expect(DEFAULT_RULE.notary).toBe('recommended');
  });
  it('falls back to the default for unknown or blank states', () => {
    const d = ready();
    d.principal.state = 'OR';
    expect(stateUnknown(d)).toBe(true);
    expect(ruleFor(d).name).toBe('Uniform default (verify)');
    d.principal.state = '';
    expect(stateUnknown(d)).toBe(true);
  });
});

describe('classification', () => {
  it('is ready for a complete Texas plan', () => {
    expect(deriveValidityClass(ready())).toBe('ready-to-execute');
  });
  it('is incomplete for a blank form, never an execution risk', () => {
    expect(deriveValidityClass(createDefaultInstrument())).toBe('incomplete');
  });
  it('flags Florida springing powers as an execution risk', () => {
    const d = ready();
    d.principal.state = 'FL';
    d.instrument.effectiveness = 'springing';
    d.instrument.springingTrigger = 'physician-certification';
    d.execution.witnessCount = 2;
    expect(deriveValidityClass(d)).toBe('execution-risk');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-SPRINGING-PROHIBITED-001');
  });
  it('counts the New York notary as the second witness', () => {
    const d = ready();
    d.principal.state = 'NY';
    d.agents.agentSignedAcknowledgment = 'yes';
    d.execution.witnessCount = 1;
    expect(deriveValidityClass(d)).toBe('ready-to-execute');
    d.execution.witnessCount = 0;
    expect(deriveValidityClass(d)).toBe('execution-risk');
  });
  it('accepts a California notary or two witnesses', () => {
    const d = ready();
    d.principal.state = 'CA';
    d.execution = { notaryArranged: 'no', witnessCount: 2, witnessIsAgent: 'no' };
    expect(deriveValidityClass(d)).toBe('ready-to-execute');
    d.execution.witnessCount = 1;
    expect(deriveValidityClass(d)).toBe('execution-risk');
  });
  it('requires an acknowledged signature for real-estate use anywhere', () => {
    const d = ready();
    d.principal.state = 'OH';
    d.execution.notaryArranged = 'no';
    expect(deriveValidityClass(d)).toBe('ready-to-execute');
    d.acceptance.usedForRealEstate = 'yes';
    expect(deriveValidityClass(d)).toBe('execution-risk');
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-REAL-ESTATE-NOT-RECORDABLE-001');
  });
  it('raises the verify flag for unknown states', () => {
    const d = ready();
    d.principal.state = 'OR';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-STATE-RULE-VERIFY-001');
  });
});

describe('personas (parity with the HTML engine)', () => {
  for (const p of personas) {
    it(p.name, () => {
      const r = validateInstrument(p.state);
      expect(r.validityClass).toBe(p.expected.validityClass);
      expect(r.governingState).toBe(p.expected.governingState);
      expect(r.executionRiskIndicated).toBe(p.expected.executionRiskIndicated);
      expect(r.firedRules).toEqual(p.expected.firedRules);
      expect(detectFlaggedIssues(p.state)).toEqual(p.expected.flaggedIssues);
    });
  }
});
