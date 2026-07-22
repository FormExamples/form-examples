import { CHECKLIST_ITEMS, type PatientRoomReadinessChecklist, type ReadinessSummary } from './types.js';

/**
 * Tally checklist results: count checked, and list unchecked checkpoint
 * labels. Pure function, no side effects, no scoring/grading — this form
 * is a facilities readiness sign-off, not a diagnostic instrument.
 */
export function summariseReadiness(data: PatientRoomReadinessChecklist): ReadinessSummary {
  const checklist = data.checklist;
  let checkedCount = 0;
  const uncheckedFields: string[] = [];
  for (const [field, label] of CHECKLIST_ITEMS) {
    if (checklist[field]) {
      checkedCount += 1;
    } else {
      uncheckedFields.push(label);
    }
  }
  return { checkedCount, totalCount: CHECKLIST_ITEMS.length, uncheckedFields };
}
