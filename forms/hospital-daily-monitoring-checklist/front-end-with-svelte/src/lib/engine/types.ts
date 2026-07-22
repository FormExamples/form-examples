// Data model for the hospital daily monitoring checklist. Authoritative —
// must match the HTML front-end built in parallel, and the SQL schema in
// ../../../../sql/. There is no clinical grading engine here — this is an
// operational compliance checklist, not a diagnostic instrument — so the
// engine output is a tally/summary (see summary.ts), not a graded result.

export type ChecklistStatus = 'satisfactory' | 'needs-attention' | 'not-applicable' | '';

export interface ChecklistItemResponse {
  status: ChecklistStatus;
  remarks: string;
}

export interface InspectionDetails {
  hospitalName: string;
  departmentOrSite: string;
  inspectionDate: string;
  inspectingOfficerName: string;
  inspectingOfficerDesignation: string;
}

export interface ChecklistSummary {
  overallNotes: string;
  actionPlan: string;
  signedAt: string;
}

export interface HospitalDailyMonitoringChecklist {
  inspectionDetails: InspectionDetails;
  /** Map of checkpoint id (e.g. '1.1', '6.1.1', '20.10', '15') → response. */
  items: Record<string, ChecklistItemResponse>;
  summary: ChecklistSummary;
}

/** One needs-attention checkpoint, as surfaced in the summary and report. */
export interface NeedsAttentionItem {
  id: string;
  sectionTitle: string;
  text: string;
  remarks: string;
}

/** Output of summariseChecklist() — a pure tally, not a scored grading engine. */
export interface ChecklistSummaryResult {
  answeredCount: number;
  needsAttentionCount: number;
  needsAttentionItems: NeedsAttentionItem[];
  /** Section numbers (1-22) with at least one needs-attention checkpoint. */
  sectionsWithNeedsAttention: number[];
}
