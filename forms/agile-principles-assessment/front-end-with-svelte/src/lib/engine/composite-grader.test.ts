import { describe, it, expect } from 'vitest';
import { createEmptyAssessment } from './factory.js';
import { calculateMaturity, deriveMaturity } from './composite-grader.js';
import { bandFor, applyMaturityRules } from './maturity-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';
import type { LikertScore } from './types.js';

function fillAll(scores: number[]): ReturnType<typeof createEmptyAssessment> {
  const data = createEmptyAssessment();
  scores.forEach((s, i) => {
    data.responses[i].score = s as 1 | 2 | 3 | 4 | 5;
  });
  return data;
}

function fillFirstN(n: number, score: LikertScore): ReturnType<typeof createEmptyAssessment> {
  const data = createEmptyAssessment();
  for (let i = 0; i < n; i += 1) data.responses[i].score = score;
  return data;
}

describe('deriveMaturity boundaries', () => {
  it('insufficient-data when null', () => {
    expect(deriveMaturity(null)).toBe('insufficient-data');
  });
  it('optimising at 4.50 boundary inclusive', () => {
    expect(deriveMaturity(4.5)).toBe('optimising');
    expect(deriveMaturity(4.499)).toBe('mature');
  });
  it('mature at 3.75 boundary inclusive', () => {
    expect(deriveMaturity(3.75)).toBe('mature');
    expect(deriveMaturity(3.749)).toBe('developing');
    expect(deriveMaturity(4.49)).toBe('mature');
  });
  it('developing at 3.00 boundary inclusive', () => {
    expect(deriveMaturity(3.0)).toBe('developing');
    expect(deriveMaturity(2.999)).toBe('initial');
    expect(deriveMaturity(3.74)).toBe('developing');
  });
  it('initial at 2.00 boundary inclusive', () => {
    expect(deriveMaturity(2.0)).toBe('initial');
    expect(deriveMaturity(1.999)).toBe('ad-hoc');
    expect(deriveMaturity(2.99)).toBe('initial');
  });
  it('ad-hoc below 2.0 floor', () => {
    expect(deriveMaturity(1.99)).toBe('ad-hoc');
    expect(deriveMaturity(1.0)).toBe('ad-hoc');
  });
});

describe('bandFor', () => {
  it('unanswered when null', () => {
    expect(bandFor(null)).toBe('unanswered');
  });
  it('low for 1 and 2', () => {
    expect(bandFor(1)).toBe('low');
    expect(bandFor(2)).toBe('low');
  });
  it('mid for 3', () => {
    expect(bandFor(3)).toBe('mid');
  });
  it('high for 4 and 5', () => {
    expect(bandFor(4)).toBe('high');
    expect(bandFor(5)).toBe('high');
  });
});

describe('answered-count threshold', () => {
  it('exactly 5 answered → insufficient-data', () => {
    const result = calculateMaturity(fillFirstN(5, 5));
    expect(result.answeredCount).toBe(5);
    expect(result.meanScore).toBeNull();
    expect(result.maturity).toBe('insufficient-data');
    expect(result.additionalFlags.some((f) => f.category === 'insufficient-data')).toBe(true);
  });

  it('exactly 6 answered → reportable maturity', () => {
    const result = calculateMaturity(fillFirstN(6, 5));
    expect(result.answeredCount).toBe(6);
    expect(result.meanScore).toBe(5);
    expect(result.maturity).toBe('optimising');
    expect(result.additionalFlags.some((f) => f.category === 'insufficient-data')).toBe(false);
  });

  it('zero answered → all 12 unanswered rules fired', () => {
    const result = calculateMaturity(createEmptyAssessment());
    expect(result.answeredCount).toBe(0);
    expect(result.firedRules.filter((r) => r.band === 'unanswered').length).toBe(12);
  });
});

describe('calculateMaturity composite paths', () => {
  it('all 5s → optimising', () => {
    const result = calculateMaturity(fillAll([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]));
    expect(result.maturity).toBe('optimising');
    expect(result.meanScore).toBe(5);
    expect(result.answeredCount).toBe(12);
    expect(result.firedRules.every((r) => r.band === 'high')).toBe(true);
    expect(result.additionalFlags.length).toBe(0);
  });

  it('all 4s → mature', () => {
    const result = calculateMaturity(fillAll([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]));
    expect(result.maturity).toBe('mature');
    expect(result.meanScore).toBe(4);
  });

  it('all 3s → developing', () => {
    const result = calculateMaturity(fillAll([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]));
    expect(result.maturity).toBe('developing');
    expect(result.meanScore).toBe(3);
    expect(result.firedRules.every((r) => r.band === 'mid')).toBe(true);
  });

  it('all 2s → initial', () => {
    const result = calculateMaturity(fillAll([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]));
    expect(result.maturity).toBe('initial');
    expect(result.meanScore).toBe(2);
    expect(result.additionalFlags.length).toBeGreaterThanOrEqual(12);
  });

  it('all 1s → ad-hoc and 12 critical-gap flags', () => {
    const result = calculateMaturity(fillAll([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]));
    expect(result.maturity).toBe('ad-hoc');
    expect(result.meanScore).toBe(1);
    expect(
      result.additionalFlags.filter((f) => f.category === 'critical-principle-gap').length,
    ).toBe(12);
  });

  it('rounds the mean to two decimal places', () => {
    const result = calculateMaturity(fillAll([5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4]));
    expect(result.meanScore).toBe(4.5);
  });

  it('mix that lands at exactly the optimising boundary', () => {
    const result = calculateMaturity(fillAll([5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4]));
    expect(result.meanScore).toBe(4.75);
    expect(result.maturity).toBe('optimising');
  });
});

describe('per-principle flag mapping', () => {
  const cases: Array<{ idx: number; category: string; priority: 'high' | 'medium' | 'low' }> = [
    { idx: 0, category: 'customer-disconnect', priority: 'high' },
    { idx: 1, category: 'change-resistance', priority: 'high' },
    { idx: 2, category: 'slow-delivery', priority: 'medium' },
    { idx: 3, category: 'silo-collaboration', priority: 'high' },
    { idx: 4, category: 'morale-risk', priority: 'high' },
    { idx: 5, category: 'communication-gap', priority: 'medium' },
    { idx: 6, category: 'output-not-outcome', priority: 'medium' },
    { idx: 7, category: 'burnout-risk', priority: 'high' },
    { idx: 8, category: 'technical-debt', priority: 'high' },
    { idx: 9, category: 'over-engineering', priority: 'medium' },
    { idx: 10, category: 'command-and-control', priority: 'high' },
    { idx: 11, category: 'no-retrospective', priority: 'high' },
  ];

  it.each(cases)(
    'principle index $idx with score 2 raises $category at priority $priority',
    ({ idx, category, priority }) => {
      const data = fillAll([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
      data.responses[idx].score = 2;
      const flags = detectAdditionalFlags(data);
      const f = flags.find((x) => x.category === category);
      expect(f).toBeDefined();
      expect(f?.priority).toBe(priority);
      expect(f?.principleNumber).toBe(idx + 1);
    },
  );
});

describe('weighted scoring', () => {
  it('weightedMeanScore equals meanScore when all weights are default', () => {
    const data = fillAll([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    const result = calculateMaturity(data);
    expect(result.weightsCustomised).toBe(false);
    expect(result.meanScore).toBe(4);
    expect(result.weightedMeanScore).toBe(4);
  });

  it('flags weightsCustomised once any weight differs from 1.0', () => {
    const data = fillAll([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    data.responses[0].weight = 1.5;
    const result = calculateMaturity(data);
    expect(result.weightsCustomised).toBe(true);
  });

  it('doubling a weight pulls the weighted mean toward that score', () => {
    const data = fillAll([5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    data.responses[0].weight = 2.0; // double-weight a 5
    const result = calculateMaturity(data);
    // unweighted: (5 + 11*1) / 12 = 16/12 = 1.33
    expect(result.meanScore).toBe(1.33);
    // weighted: (5*2 + 11*1) / (2 + 11) = 21/13 = 1.6153 ≈ 1.62
    expect(result.weightedMeanScore).toBe(1.62);
  });

  it('clamps weights below 0.5 and above 2.0', () => {
    const data = fillAll([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
    data.responses[0].weight = 0.1; // → clamped to 0.5
    data.responses[1].weight = 5.0; // → clamped to 2.0
    const result = calculateMaturity(data);
    expect(result.weightsCustomised).toBe(true);
    expect(result.weightedMeanScore).toBe(5);
  });

  it('rejects non-finite or zero weights and falls back to default', () => {
    const data = fillAll([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    data.responses[0].weight = 0;
    data.responses[1].weight = NaN as unknown as number;
    const result = calculateMaturity(data);
    expect(result.weightsCustomised).toBe(false);
    expect(result.weightedMeanScore).toBe(4);
  });

  it('weighted mean drives maturity even when unweighted differs', () => {
    // 6 fives, 6 ones → unweighted 3 (developing). Doubling the 1s yields
    // (6*5 + 6*1*2) / (6 + 6*2) = 42/18 = 2.33 (initial).
    const data = fillAll([5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1]);
    for (let i = 6; i < 12; i += 1) data.responses[i].weight = 2.0;
    const result = calculateMaturity(data);
    expect(result.meanScore).toBe(3);
    expect(result.weightedMeanScore).toBe(2.33);
    expect(result.maturity).toBe('initial');
  });
});

describe('applyMaturityRules', () => {
  it('emits 12 rules — one per principle', () => {
    const data = fillAll([5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4]);
    const { perPrincipleBands, firedRules } = applyMaturityRules(data);
    expect(perPrincipleBands.length).toBe(12);
    expect(firedRules.length).toBe(12);
    expect(firedRules[0].band).toBe('high');
    expect(firedRules[3].band).toBe('low');
    expect(firedRules[7].band).toBe('mid');
  });

  it('rule ID encodes the band suffix', () => {
    const data = fillAll([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
    const { firedRules } = applyMaturityRules(data);
    expect(firedRules[0].ruleId).toBe('R-P01-HIGH');
    expect(firedRules[8].ruleId).toBe('R-P09-HIGH');
  });
});
