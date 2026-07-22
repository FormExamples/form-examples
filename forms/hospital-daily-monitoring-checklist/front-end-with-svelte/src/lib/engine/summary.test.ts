import { describe, expect, it } from 'vitest';
import { createEmptyAssessment } from './factory.js';
import { summariseChecklist } from './summary.js';
import { CHECKLIST_ITEMS, TOTAL_ITEMS } from '$lib/config/items.js';

describe('summariseChecklist', () => {
  it('reports zero answered, zero needs-attention on a blank checklist', () => {
    const data = createEmptyAssessment();
    const result = summariseChecklist(data);
    expect(result.answeredCount).toBe(0);
    expect(result.needsAttentionCount).toBe(0);
    expect(result.needsAttentionItems).toEqual([]);
    expect(result.sectionsWithNeedsAttention).toEqual([]);
  });

  it('reports full answeredCount and zero needs-attention when every checkpoint is satisfactory', () => {
    const data = createEmptyAssessment();
    for (const item of CHECKLIST_ITEMS) {
      data.items[item.id] = { status: 'satisfactory', remarks: '' };
    }
    const result = summariseChecklist(data);
    expect(result.answeredCount).toBe(TOTAL_ITEMS);
    expect(result.needsAttentionCount).toBe(0);
    expect(result.needsAttentionItems).toEqual([]);
    expect(result.sectionsWithNeedsAttention).toEqual([]);
  });

  it('tallies and lists needs-attention checkpoints correctly', () => {
    const data = createEmptyAssessment();
    // Section 1 (OPD): one needs-attention checkpoint.
    data.items['1.4'] = { status: 'needs-attention', remarks: 'Complaint box missing key.' };
    // Section 6 (Diagnostic Facility): one needs-attention checkpoint.
    data.items['6.2.4'] = { status: 'needs-attention', remarks: 'RSO not nominated.' };
    // A satisfactory checkpoint should not appear.
    data.items['1.1'] = { status: 'satisfactory', remarks: '' };

    const result = summariseChecklist(data);

    expect(result.answeredCount).toBe(3);
    expect(result.needsAttentionCount).toBe(2);
    expect(result.needsAttentionItems).toHaveLength(2);
    expect(result.needsAttentionItems).toEqual(
      expect.arrayContaining([
        {
          id: '1.4',
          sectionTitle: 'OPD',
          text: 'Complaint Box.',
          remarks: 'Complaint box missing key.',
        },
        {
          id: '6.2.4',
          sectionTitle: 'Diagnostic Facility',
          text: 'Radiation Safety Officer nominated.',
          remarks: 'RSO not nominated.',
        },
      ]),
    );
    expect(result.sectionsWithNeedsAttention).toEqual([1, 6]);
  });

  it('excludes not-applicable checkpoints from needs-attention while still counting them as answered', () => {
    const data = createEmptyAssessment();
    data.items['15'] = { status: 'not-applicable', remarks: 'No signage required on this floor.' };
    data.items['16'] = { status: 'needs-attention', remarks: 'Extinguisher expired.' };

    const result = summariseChecklist(data);

    expect(result.answeredCount).toBe(2);
    expect(result.needsAttentionCount).toBe(1);
    expect(result.needsAttentionItems).toEqual([
      {
        id: '16',
        sectionTitle: 'Fire Fighting Equipment',
        text: 'Fire fighting equipment.',
        remarks: 'Extinguisher expired.',
      },
    ]);
    expect(result.sectionsWithNeedsAttention).toEqual([16]);
  });
});
