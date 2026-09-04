// Summary tally for the Hospital Daily Monitoring Checklist — the pure
// engine counterpart of the SvelteKit `src/lib/engine/summary.ts`.
//
// There is no clinical grading engine for this form: it is a facility /
// operations audit, so the "engine" is a tally of the 97 checkpoints —
// how many were answered, which were marked "needs attention", and which
// of the 22 areas those fall in. Pure function, no DOM, no side effects.

import { CHECKLIST_ITEMS } from './items.js';

/** A status is answered when it is any non-blank value. */
function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

/**
 * Tally the checklist.
 *
 * @param {ReturnType<typeof import('./types.js').emptyAssessment>} data
 * @returns {{
 *   answeredCount: number,
 *   needsAttentionCount: number,
 *   needsAttentionItems: { id: string, sectionTitle: string, text: string, remarks: string }[],
 *   sectionsWithNeedsAttention: number[]
 * }}
 */
function summariseChecklist(data) {
  let answeredCount = 0;
  let needsAttentionCount = 0;
  const needsAttentionItems = [];
  const sectionsSeen = new Set();

  CHECKLIST_ITEMS.forEach(function (item) {
    const resp = (data.items && data.items[item.id]) || { status: '', remarks: '' };
    if (isAnswered(resp.status)) answeredCount += 1;
    if (resp.status === 'needs-attention') {
      needsAttentionCount += 1;
      sectionsSeen.add(item.section);
      needsAttentionItems.push({
        id: item.id,
        sectionTitle: item.sectionTitle,
        text: item.text,
        remarks: resp.remarks || '',
      });
    }
  });

  return {
    answeredCount: answeredCount,
    needsAttentionCount: needsAttentionCount,
    needsAttentionItems: needsAttentionItems,
    sectionsWithNeedsAttention: Array.from(sectionsSeen).sort(function (a, b) { return a - b; }),
  };
}

export { isAnswered, summariseChecklist };
