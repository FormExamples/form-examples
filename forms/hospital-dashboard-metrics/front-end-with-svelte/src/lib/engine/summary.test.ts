import { describe, expect, it } from 'vitest';
import { createEmptyMetrics } from './factory.js';
import { summariseMetrics } from './summary.js';
import { DASHBOARD_METRICS, TOTAL_METRICS, TOTAL_CATEGORIES } from '#lib/config/metrics.js';

describe('summariseMetrics', () => {
  it('reports zero recorded on a blank report', () => {
    const data = createEmptyMetrics();
    const result = summariseMetrics(data);
    expect(result.reportedCount).toBe(0);
    expect(result.totalCount).toBe(TOTAL_METRICS);
    expect(result.categoryCounts).toHaveLength(TOTAL_CATEGORIES);
    for (const c of result.categoryCounts) {
      expect(c.reported).toBe(0);
    }
    // Category totals sum to the full 67-metric catalogue.
    const sumOfTotals = result.categoryCounts.reduce((sum, c) => sum + c.total, 0);
    expect(sumOfTotals).toBe(TOTAL_METRICS);
  });

  it('reports full reportedCount when every metric has a recorded value', () => {
    const data = createEmptyMetrics();
    for (const metric of DASHBOARD_METRICS) {
      data.items[metric.id] = { value: 42, notes: '' };
    }
    const result = summariseMetrics(data);
    expect(result.reportedCount).toBe(TOTAL_METRICS);
    for (const c of result.categoryCounts) {
      expect(c.reported).toBe(c.total);
    }
  });

  it('tallies partial recording per category correctly', () => {
    const data = createEmptyMetrics();
    // Category 1 (Antibiotics, Narcotics & Culture Monitoring): 3 metrics, record 1.
    data.items['1.1'] = { value: 10, notes: '' };
    // Category 4 (Infection Control Metrics): 5 metrics, record 2.
    data.items['4.1'] = { value: 0, notes: 'zero is a valid recorded value' };
    data.items['4.3'] = { value: 1.5, notes: '' };
    // Notes alone (no value) must not count as reported.
    data.items['9.1'] = { value: null, notes: 'not yet available' };

    const result = summariseMetrics(data);

    expect(result.reportedCount).toBe(3);

    const cat1 = result.categoryCounts.find((c) => c.category === 1);
    expect(cat1).toEqual({
      category: 1,
      categoryTitle: 'Antibiotics, Narcotics & Culture Monitoring',
      reported: 1,
      total: 3,
    });

    const cat4 = result.categoryCounts.find((c) => c.category === 4);
    expect(cat4).toEqual({
      category: 4,
      categoryTitle: 'Infection Control Metrics',
      reported: 2,
      total: 5,
    });

    const cat9 = result.categoryCounts.find((c) => c.category === 9);
    expect(cat9).toEqual({
      category: 9,
      categoryTitle: 'Radiology Metrics',
      reported: 0,
      total: 1,
    });
  });
});
