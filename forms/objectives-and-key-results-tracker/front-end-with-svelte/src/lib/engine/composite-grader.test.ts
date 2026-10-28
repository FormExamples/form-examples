import { describe, expect, it } from 'vitest';
import { gradeObjective } from './composite-grader';
import type { ObjectiveAssessment } from './types';
import fixtures from '../../../../test-fixtures/scoring/01-green-on-track.json' with { type: 'json' };

describe('gradeObjective — fixture 01-green-on-track', () => {
  it('produces green', () => {
    const result = gradeObjective(fixtures.input as unknown as ObjectiveAssessment);
    expect(result.computedCompositeRag).toBe(fixtures.expected.computedCompositeRag);
  });
});
