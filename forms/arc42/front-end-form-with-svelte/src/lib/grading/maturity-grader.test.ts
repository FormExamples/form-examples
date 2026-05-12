import { describe, it, expect } from 'vitest';
import { calculateMaturity } from './maturity-grader.js';
import { createEmptyDocumentation } from './factory.js';
import type { Arc42Documentation } from './types.js';

function fillSection1Complete(d: Arc42Documentation) {
  d.introduction = 'x';
  d.businessGoals = [{ ordinal: 1, name: 'g', description: '' }];
  d.qualityGoals = [
    { ordinal: 1, name: 'a', priority: 'high', scenario: 's' },
    { ordinal: 2, name: 'b', priority: 'high', scenario: 's' },
    { ordinal: 3, name: 'c', priority: 'medium', scenario: 's' },
  ];
  d.stakeholders = [
    { ordinal: 1, name: 'a', role: 'b', concerns: 'c' },
    { ordinal: 2, name: 'd', role: 'e', concerns: 'f' },
  ];
}

describe('calculateMaturity', () => {
  it('Draft when documentation is empty', () => {
    const r = calculateMaturity(createEmptyDocumentation());
    expect(r.computedMaturity).toBe('draft');
    expect(r.finalMaturity).toBe('draft');
    expect(r.completenessBySection[1]).toBe('empty');
  });

  it('Reviewable when every section ≥ partial but ≥1 still partial', () => {
    const d = createEmptyDocumentation();
    // Make every section at least partial.
    d.introduction = 'x';
    d.constraintItems = [{ ordinal: 1, kind: 'technical', name: 'n', description: 'd' }];
    d.businessContextDescription = 'b';
    d.solutionStrategySummary = 's';
    d.buildingBlockOverview = 'b';
    d.runtimeScenarios = [{ ordinal: 1, name: 'n', triggerDescription: 't', stepsSummary: '' }]; // partial: empty stepsSummary
    d.deploymentOverview = 'o';
    d.crosscuttingOverview = 'o';
    d.architecturalDecisions = [{ ordinal: 1, title: 't', status: 'draft', context: '', decision: '', consequences: '' }];
    d.qualityTreeSummary = 'q';
    d.riskItems = [{ ordinal: 1, kind: 'risk', name: 'n', probability: 'low', impact: 'low', mitigation: '' }]; // partial: no mitigation
    d.glossaryTerms = [{ ordinal: 1, term: 't', definition: 'd' }];
    const r = calculateMaturity(d);
    expect(r.computedMaturity).toBe('reviewable');
  });

  it('honours the override at finalMaturity, keeping computedMaturity intact', () => {
    const d = createEmptyDocumentation();
    d.finalMaturityOverride = 'mature';
    d.finalMaturityOverrideReason = 'audit signed-off externally';
    const r = calculateMaturity(d);
    expect(r.computedMaturity).toBe('draft');
    expect(r.finalMaturity).toBe('mature');
  });

  it('reports fired flags via additionalFlags', () => {
    const r = calculateMaturity(createEmptyDocumentation());
    expect(r.additionalFlags.length).toBeGreaterThan(0);
    expect(r.additionalFlags.every((f) => ['high', 'medium', 'low'].includes(f.priority))).toBe(true);
  });
});
