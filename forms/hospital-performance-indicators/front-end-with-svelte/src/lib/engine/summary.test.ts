import { describe, expect, it } from 'vitest';
import { createEmptyIndicators } from './factory.js';
import { summariseIndicators } from './summary.js';
import { PERFORMANCE_INDICATORS, TOTAL_INDICATORS, TOTAL_CATEGORIES } from '#lib/config/indicators.js';

describe('summariseIndicators', () => {
  it('reports zero recorded on a blank report', () => {
    const data = createEmptyIndicators();
    const result = summariseIndicators(data);
    expect(result.reportedCount).toBe(0);
    expect(result.totalCount).toBe(TOTAL_INDICATORS);
    expect(result.categoryCounts).toHaveLength(TOTAL_CATEGORIES);
    for (const c of result.categoryCounts) {
      expect(c.reported).toBe(0);
    }
    // Category totals sum to the full 50-indicator catalogue.
    const sumOfTotals = result.categoryCounts.reduce((sum, c) => sum + c.total, 0);
    expect(sumOfTotals).toBe(TOTAL_INDICATORS);
  });

  it('reports full reportedCount when every indicator has a recorded value', () => {
    const data = createEmptyIndicators();
    for (const indicator of PERFORMANCE_INDICATORS) {
      data.items[indicator.id] = { value: 42, notes: '' };
    }
    const result = summariseIndicators(data);
    expect(result.reportedCount).toBe(TOTAL_INDICATORS);
    for (const c of result.categoryCounts) {
      expect(c.reported).toBe(c.total);
    }
  });

  it('tallies partial recording per category correctly', () => {
    const data = createEmptyIndicators();
    // Category 1 (Finance Indicators): 9 indicators, record 2.
    data.items['1.1'] = { value: 1.25, notes: '' };
    data.items['1.9'] = { value: 500, notes: '' };
    // Category 2 (Process Indicators): 28 indicators, record 1.
    data.items['2.5'] = { value: 0, notes: 'zero is a valid recorded value' };
    // Category 4 (Customer Indicators): 5 indicators, record none but add a note.
    data.items['4.1'] = { value: null, notes: 'not yet available' };

    const result = summariseIndicators(data);

    expect(result.reportedCount).toBe(3);

    const cat1 = result.categoryCounts.find((c) => c.category === 1);
    expect(cat1).toEqual({
      category: 1,
      categoryTitle: 'Finance Indicators',
      reported: 2,
      total: 9,
    });

    const cat2 = result.categoryCounts.find((c) => c.category === 2);
    expect(cat2).toEqual({
      category: 2,
      categoryTitle: 'Process Indicators',
      reported: 1,
      total: 28,
    });

    const cat4 = result.categoryCounts.find((c) => c.category === 4);
    expect(cat4).toEqual({
      category: 4,
      categoryTitle: 'Customer Indicators',
      reported: 0,
      total: 5,
    });
  });
});
