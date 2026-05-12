import { describe, it, expect } from 'vitest';
import { computeCompleteness } from './completeness-rules.js';
import { createEmptyDocumentation } from './factory.js';

describe('computeCompleteness', () => {
  it('returns "empty" for every section on a brand-new documentation', () => {
    const r = computeCompleteness(createEmptyDocumentation());
    for (let i = 1; i <= 12; i++) {
      expect(r[i]).toBe('empty');
    }
  });

  it('section 1 reaches "complete" with intro + 1 business goal + 3 quality goals + 2 stakeholders', () => {
    const d = createEmptyDocumentation();
    d.introduction = 'A monolithic Rust web service.';
    d.businessGoals = [{ ordinal: 1, name: 'Ship by Q3', description: '' }];
    d.qualityGoals = [
      { ordinal: 1, name: 'Latency', priority: 'high', scenario: 'p95 < 200ms' },
      { ordinal: 2, name: 'Availability', priority: 'high', scenario: '99.9%' },
      { ordinal: 3, name: 'Maintainability', priority: 'medium', scenario: 'one engineer onboards in a week' },
    ];
    d.stakeholders = [
      { ordinal: 1, name: 'Product', role: 'sponsor', concerns: 'time-to-market' },
      { ordinal: 2, name: 'SRE', role: 'operator', concerns: 'reliability' },
    ];
    const r = computeCompleteness(d);
    expect(r[1]).toBe('complete');
  });

  it('section 1 stays "partial" if quality goals lack priority or scenario', () => {
    const d = createEmptyDocumentation();
    d.introduction = 'x';
    d.businessGoals = [{ ordinal: 1, name: 'g', description: '' }];
    d.qualityGoals = [
      { ordinal: 1, name: 'Latency', priority: '', scenario: '' },
      { ordinal: 2, name: 'Availability', priority: '', scenario: '' },
      { ordinal: 3, name: 'Maintainability', priority: '', scenario: '' },
    ];
    d.stakeholders = [{ ordinal: 1, name: 'a', role: 'b', concerns: 'c' }, { ordinal: 2, name: 'd', role: 'e', concerns: 'f' }];
    const r = computeCompleteness(d);
    expect(r[1]).toBe('partial');
  });

  it('section 9 needs ≥3 ADRs with status ≠ draft to be complete', () => {
    const d = createEmptyDocumentation();
    d.architecturalDecisions = [
      { ordinal: 1, title: 'A', status: 'draft', context: '', decision: '', consequences: '' },
      { ordinal: 2, title: 'B', status: 'accepted', context: '', decision: '', consequences: '' },
      { ordinal: 3, title: 'C', status: 'accepted', context: '', decision: '', consequences: '' },
    ];
    const r = computeCompleteness(d);
    expect(r[9]).toBe('partial'); // only 2 non-draft

    d.architecturalDecisions[0].status = 'accepted';
    expect(computeCompleteness(d)[9]).toBe('complete');
  });

  it('section 12 needs ≥5 glossary terms', () => {
    const d = createEmptyDocumentation();
    d.glossaryTerms = Array.from({ length: 4 }, (_, i) => ({ ordinal: i + 1, term: `t${i}`, definition: 'd' }));
    expect(computeCompleteness(d)[12]).toBe('partial');
    d.glossaryTerms.push({ ordinal: 5, term: 't5', definition: 'd' });
    expect(computeCompleteness(d)[12]).toBe('complete');
  });
});
