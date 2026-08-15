import type {
  ChecklistSummaryResult,
  HospitalDailyMonitoringChecklist,
  NeedsAttentionItem,
} from './types.js';
import { CHECKLIST_ITEMS } from '#lib/config/items.js';

/**
 * Pure tally/summary over the 97 checkpoints — no side effects, no scoring.
 * `not-applicable` and unanswered checkpoints never count as needs-attention;
 * only checkpoints explicitly marked `needs-attention` are tallied and listed.
 */
export function summariseChecklist(
  data: HospitalDailyMonitoringChecklist,
): ChecklistSummaryResult {
  let answeredCount = 0;
  let needsAttentionCount = 0;
  const needsAttentionItems: NeedsAttentionItem[] = [];
  const sections = new Set<number>();

  for (const item of CHECKLIST_ITEMS) {
    const response = data.items[item.id];
    const status = response?.status ?? '';

    if (status !== '') answeredCount += 1;

    if (status === 'needs-attention') {
      needsAttentionCount += 1;
      needsAttentionItems.push({
        id: item.id,
        sectionTitle: item.sectionTitle,
        text: item.text,
        remarks: response?.remarks ?? '',
      });
      sections.add(item.section);
    }
  }

  return {
    answeredCount,
    needsAttentionCount,
    needsAttentionItems,
    sectionsWithNeedsAttention: Array.from(sections).sort((a, b) => a - b),
  };
}
