import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveReadinessClass, gradeDirective } from './grader';
import { detectFlaggedIssues } from './flagged-issues';
import { createDefaultDirective } from './defaults';
import {
  ageOn,
  executionDefects,
  isKnownState,
  missingRequired,
  stateRule,
  STATE_RULES
} from './rules';
import type { Directive } from './types';

/** A complete California directive signed before two unrelated witnesses. */
function ready(): Directive {
  const d = createDefaultDirective();
  d.principal = {
    principalName: 'Maria Elena Vargas',
    birthDate: '1958-03-14',
    state: 'CA',
    phone: '',
    capacityConfirmed: 'yes',
    signedVoluntarily: 'yes'
  };
  d.agent.agentName = 'Daniel Vargas';
  d.agent.agentAge = 34;
  d.agent.agentRelatedToPrincipal = 'yes';
  d.agent.agentIsHealthCareProvider = 'no';
  d.agent.agentIsFacilityEmployee = 'no';
  d.agent.successor1Name = 'Lucia Vargas';
  d.authority.effectiveWhen = 'upon-incapacity';
  d.authority.hipaaRelease = 'yes';
  d.authority.organDonation = 'any-needs';
  d.execution.signatureDate = '2026-09-01';
  d.execution.executionMethod = 'two-witnesses';
  d.execution.witnessesPresent = 'yes';
  for (const n of ['1', '2'] as const) {
    d.execution[`witness${n}Name`] = `Witness ${n}`;
    d.execution[`witness${n}IsRelative`] = 'no';
    d.execution[`witness${n}IsHeir`] = 'no';
    d.execution[`witness${n}IsAgent`] = 'no';
    d.execution[`witness${n}IsProvider`] = 'no';
  }
  d.distribution = {
    copyToAgent: 'yes',
    copyToPhysician: 'yes',
    copyToSuccessor: 'yes',
    copyToFacility: 'yes'
  };
  return d;
}

describe('state rules', () => {
  it('covers the eight required states', () => {
    for (const code of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA']) {
      expect(STATE_RULES[code]).toBeDefined();
    }
  });

  it('falls back to the uniform default for an unknown state', () => {
    const d = ready();
    d.principal.state = 'AK';
    expect(isKnownState(d)).toBe(false);
    expect(stateRule(d).name).toBe('Uniform default');
  });

  it('computes age on a reference date', () => {
    expect(ageOn('2009-04-10', '2026-08-01')).toBe(17);
    expect(ageOn('2008-08-01', '2026-08-01')).toBe(18);
    expect(ageOn(null, '2026-08-01')).toBeNull();
  });
});

describe('readiness class', () => {
  it('is ready-to-execute for a complete, correctly witnessed directive', () => {
    const d = ready();
    expect(deriveReadinessClass(d)).toBe('ready-to-execute');
    expect(detectFlaggedIssues(d)).toEqual([]);
  });

  it('is incomplete when required content is blank', () => {
    const d = ready();
    d.execution.signatureDate = null;
    d.execution.executionMethod = '';
    expect(deriveReadinessClass(d)).toBe('incomplete');
    expect(missingRequired(d)).toContain('signature date');
    expect(gradeDirective(d).missingCount).toBe(2);
  });

  it('is execution-risk when the agent is a witness', () => {
    const d = ready();
    d.execution.witness1IsAgent = 'yes';
    expect(deriveReadinessClass(d)).toBe('execution-risk');
    expect(detectFlaggedIssues(d).some((f) => f.category === 'witness-eligibility')).toBe(true);
  });

  it('takes execution-risk over incomplete', () => {
    const d = ready();
    d.agent.agentAge = 17;
    d.execution.signatureDate = null;
    expect(deriveReadinessClass(d)).toBe('execution-risk');
  });

  it('treats a minor principal as execution-risk', () => {
    const d = ready();
    d.principal.birthDate = '2009-04-10';
    expect(deriveReadinessClass(d)).toBe('execution-risk');
  });

  it('accepts a notary in Texas but not in New York', () => {
    const d = ready();
    d.execution.executionMethod = 'notary';
    d.execution.notaryName = 'Carla Mendez';
    d.execution.witness1Name = '';
    d.execution.witness2Name = '';
    d.principal.state = 'TX';
    expect(executionDefects(d)).toEqual([]);
    d.principal.state = 'NY';
    expect(executionDefects(d).map((x) => x.code)).toContain('notary-not-accepted');
  });

  it('needs one witness in Illinois and two in Florida', () => {
    const d = ready();
    d.execution.executionMethod = 'one-witness';
    d.execution.witness2Name = '';
    d.principal.state = 'IL';
    expect(deriveReadinessClass(d)).toBe('ready-to-execute');
    d.principal.state = 'FL';
    expect(deriveReadinessClass(d)).toBe('execution-risk');
  });

  it('requires an ombudsman for a California skilled-nursing resident', () => {
    const d = ready();
    d.execution.principalInSkilledNursingFacility = 'yes';
    expect(executionDefects(d).map((x) => x.code)).toContain('snf-ombudsman');
    d.execution.ombudsmanSigned = 'yes';
    expect(executionDefects(d)).toEqual([]);
  });

  it('flags an unknown state to verify', () => {
    const d = ready();
    d.principal.state = 'AK';
    expect(detectFlaggedIssues(d).map((f) => f.id)).toContain('F-HCPOA-012');
  });
});

describe('personas', () => {
  const file = JSON.parse(
    readFileSync(new URL('../../../../examples/personas.json', import.meta.url), 'utf8')
  ) as {
    personas: {
      name: string;
      state: Directive;
      expected: { readinessClass: string; flaggedIssues: unknown[] };
    }[];
  };
  for (const p of file.personas) {
    it(p.name, () => {
      expect(gradeDirective(p.state).readinessClass).toBe(p.expected.readinessClass);
      expect(detectFlaggedIssues(p.state)).toEqual(p.expected.flaggedIssues);
    });
  }
});
