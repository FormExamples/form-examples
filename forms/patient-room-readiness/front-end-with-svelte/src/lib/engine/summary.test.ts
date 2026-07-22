import { describe, expect, it } from 'vitest';
import { createEmptyChecklist } from './factory.js';
import { summariseReadiness } from './summary.js';
import { CHECKLIST_ITEMS } from './types.js';

describe('summariseReadiness', () => {
  it('reports zero checked and all 25 labels unchecked on a blank checklist', () => {
    const data = createEmptyChecklist();
    const result = summariseReadiness(data);
    expect(result.checkedCount).toBe(0);
    expect(result.totalCount).toBe(25);
    expect(result.uncheckedFields).toHaveLength(25);
    expect(result.uncheckedFields).toEqual(CHECKLIST_ITEMS.map(([, label]) => label));
  });

  it('reports all checked and no unchecked labels when every checkpoint is true', () => {
    const data = createEmptyChecklist();
    for (const [field] of CHECKLIST_ITEMS) {
      data.checklist[field] = true;
    }
    const result = summariseReadiness(data);
    expect(result.checkedCount).toBe(25);
    expect(result.totalCount).toBe(25);
    expect(result.uncheckedFields).toEqual([]);
  });

  it('tallies correctly and lists only the unchecked labels, in catalogue order', () => {
    const data = createEmptyChecklist();
    data.checklist.callBell = true;
    data.checklist.dustbin = true;
    data.checklist.geyser = true;

    const result = summariseReadiness(data);
    expect(result.checkedCount).toBe(3);
    expect(result.totalCount).toBe(25);
    expect(result.uncheckedFields).toHaveLength(22);
    expect(result.uncheckedFields).not.toContain('Call Bell');
    expect(result.uncheckedFields).not.toContain('Dustbin');
    expect(result.uncheckedFields).not.toContain('Geyser');
    // Order preserved: 'Patient Cot / Mattress / side railings' (unchecked) still first.
    expect(result.uncheckedFields[0]).toBe('Patient Cot / Mattress / side railings');
  });
});
