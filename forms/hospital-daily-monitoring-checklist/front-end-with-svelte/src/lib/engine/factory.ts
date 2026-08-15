import type { ChecklistItemResponse, HospitalDailyMonitoringChecklist } from './types.js';
import { CHECKLIST_ITEMS } from '#lib/config/items.js';

function emptyItems(): Record<string, ChecklistItemResponse> {
  const out: Record<string, ChecklistItemResponse> = {};
  for (const item of CHECKLIST_ITEMS) {
    out[item.id] = { status: '', remarks: '' };
  }
  return out;
}

/** A blank hospital daily monitoring checklist with all 97 checkpoints unanswered. */
export function createEmptyAssessment(): HospitalDailyMonitoringChecklist {
  return {
    inspectionDetails: {
      hospitalName: '',
      departmentOrSite: '',
      inspectionDate: '',
      inspectingOfficerName: '',
      inspectingOfficerDesignation: '',
    },
    items: emptyItems(),
    summary: {
      overallNotes: '',
      actionPlan: '',
      signedAt: '',
    },
  };
}
