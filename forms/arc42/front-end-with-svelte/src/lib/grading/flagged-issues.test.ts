import { describe, it, expect } from 'vitest';
import { detectFlags } from './flagged-issues.js';
import { createEmptyDocumentation } from './factory.js';

describe('detectFlags', () => {
  it('fires high-priority flags for an empty documentation', () => {
    const flags = detectFlags(createEmptyDocumentation());
    const cats = flags.filter((f) => f.priority === 'high').map((f) => f.category).sort();
    expect(cats).toContain('no-stakeholders');
    expect(cats).toContain('no-quality-goals');
    expect(cats).toContain('no-architectural-decisions');
    expect(cats).toContain('no-risks');
    expect(cats).toContain('no-business-context');
    expect(cats).toContain('no-deployment-view');
  });

  it('does not fire no-stakeholders when ≥1 stakeholder present', () => {
    const d = createEmptyDocumentation();
    d.stakeholders = [{ ordinal: 1, name: 'a', role: 'b', concerns: 'c' }];
    const flags = detectFlags(d);
    expect(flags.some((f) => f.category === 'no-stakeholders')).toBe(false);
  });

  it('fires medium-priority "few-quality-goals" when 1-2 quality goals', () => {
    const d = createEmptyDocumentation();
    d.qualityGoals = [{ ordinal: 1, name: 'a', priority: 'high', scenario: 's' }];
    const flags = detectFlags(d);
    expect(flags.some((f) => f.category === 'few-quality-goals' && f.priority === 'medium')).toBe(true);
  });

  it('fires low-priority "flat-decomposition" when ≥6 building blocks but none nested', () => {
    const d = createEmptyDocumentation();
    d.buildingBlocks = Array.from({ length: 6 }, (_, i) => ({
      ordinal: i + 1, parentOrdinal: null, name: `b${i}`, responsibility: '', interfaces: '',
    }));
    expect(detectFlags(d).some((f) => f.category === 'flat-decomposition' && f.priority === 'low')).toBe(true);

    d.buildingBlocks[5].parentOrdinal = 1;
    expect(detectFlags(d).some((f) => f.category === 'flat-decomposition')).toBe(false);
  });
});
