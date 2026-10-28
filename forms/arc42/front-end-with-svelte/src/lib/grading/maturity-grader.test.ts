import { describe, it, expect } from 'vitest';
import { calculateMaturity } from './maturity-grader.js';
import { createEmptyDocumentation } from './factory.js';

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
    d.architecturalDecisions = [
      { ordinal: 1, title: 't', status: 'draft', context: '', decision: '', consequences: '' }
    ];
    d.qualityTreeSummary = 'q';
    d.riskItems = [
      { ordinal: 1, kind: 'risk', name: 'n', probability: 'low', impact: 'low', mitigation: '' }
    ]; // partial: no mitigation
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
    expect(r.additionalFlags.every((f) => ['high', 'medium', 'low'].includes(f.priority))).toBe(
      true
    );
  });
});
