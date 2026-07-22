// Plain-JavaScript type-shape helper mirroring the SvelteKit
// `src/lib/config/types.ts` data model for the Hospital Daily Monitoring
// Checklist form.
//
// ChecklistStatus: 'satisfactory' | 'needs-attention' | 'not-applicable' | ''
// ChecklistItemResponse: { status: ChecklistStatus, remarks: string }

import { CHECKLIST_ITEMS } from './items.js';

/** Build a fresh, fully-blank per-item response map keyed by checkpoint id. */
function emptyItems() {
  const items = {};
  CHECKLIST_ITEMS.forEach(function (item) {
    items[item.id] = { status: '', remarks: '' };
  });
  return items;
}

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to ''; the `items` map has one entry per checkpoint id.
 */
function emptyAssessment() {
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

export { emptyAssessment, emptyItems };
