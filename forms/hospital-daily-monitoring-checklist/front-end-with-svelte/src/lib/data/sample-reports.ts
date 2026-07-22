import type { HospitalDailyMonitoringChecklist } from '$lib/engine/types.js';
import { CHECKLIST_ITEMS } from '$lib/config/items.js';
import { summariseChecklist } from '$lib/engine/summary.js';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte.js';

/** A sample inspection round: an identifier and the full data the engine tallies. */
export interface SampleAssessment {
  id: string;
  hospitalName: string;
  inspectingOfficerName: string;
  inspectionDate: string;
  data: HospitalDailyMonitoringChecklist;
}

/** A row in the administrator review dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  hospitalName: string;
  departmentOrSite: string;
  inspectingOfficerName: string;
  inspectionDate: string;
  answeredCount: number;
  needsAttentionCount: number;
  affectedAreas: string;
}

/**
 * Build a checklist marking the given checkpoint ids `needs-attention` (with a
 * remark) and every other checkpoint `satisfactory`, so the sample rounds have
 * a realistic mix rather than all-blank data.
 */
function build(
  inspectionDetails: Partial<HospitalDailyMonitoringChecklist['inspectionDetails']>,
  needsAttentionIds: string[],
  summary: Partial<HospitalDailyMonitoringChecklist['summary']> = {},
): HospitalDailyMonitoringChecklist {
  const d = createDefaultAssessment();
  d.inspectionDetails = { ...d.inspectionDetails, ...inspectionDetails };
  d.summary = { ...d.summary, ...summary };
  for (const item of CHECKLIST_ITEMS) {
    d.items[item.id] = needsAttentionIds.includes(item.id)
      ? { status: 'needs-attention', remarks: 'Flagged during rounds — see action plan.' }
      : { status: 'satisfactory', remarks: '' };
  }
  return d;
}

/** Clean round — every checkpoint satisfactory. */
function clean(): HospitalDailyMonitoringChecklist {
  return build(
    {
      hospitalName: 'Aurora District Hospital',
      departmentOrSite: 'Whole hospital',
      inspectionDate: '2026-06-10',
      inspectingOfficerName: 'Dr. Alice Hopper',
      inspectingOfficerDesignation: 'Resident Medical Officer',
    },
    [],
    { overallNotes: 'All areas satisfactory on today’s round.' },
  );
}

/** A handful of needs-attention checkpoints, scattered across areas. */
function minorIssues(): HospitalDailyMonitoringChecklist {
  return build(
    {
      hospitalName: 'Borealis Community Health Centre',
      departmentOrSite: 'Whole hospital',
      inspectionDate: '2026-06-12',
      inspectingOfficerName: 'Bao Nguyen',
      inspectingOfficerDesignation: 'Medical Superintendent',
    },
    ['1.4', '6.2.4', '12.4'],
    { actionPlan: 'Repair complaint box lock; nominate Radiation Safety Officer; fix tap leak in ward washroom.' },
  );
}

/** More widespread issues concentrated in waste management and infection control. */
function widespreadIssues(): HospitalDailyMonitoringChecklist {
  return build(
    {
      hospitalName: 'Cobalt General Hospital',
      departmentOrSite: 'Whole hospital',
      inspectionDate: '2026-06-15',
      inspectingOfficerName: 'Carmen Diaz',
      inspectingOfficerDesignation: 'Medical Superintendent',
    },
    ['20.6', '20.8', '20.10', '21.1', '21.4', '11.6', '13.2'],
    { actionPlan: 'Retrain staff on sharps disposal and colour-coded bins; audit hand-wash compliance in OT.' },
  );
}

/** Severe round — critical-care areas flagged. */
function criticalIssues(): HospitalDailyMonitoringChecklist {
  return build(
    {
      hospitalName: 'Dusk Regional Medical Centre',
      departmentOrSite: 'Whole hospital',
      inspectionDate: '2026-06-18',
      inspectingOfficerName: 'Dmitri Volkov',
      inspectingOfficerDesignation: 'Resident Medical Officer',
    },
    ['2.2', '8.3', '8.5', '9.2', '16', '20.5', '21.2', '21.3'],
    { actionPlan: 'Escalate OT/ICU equipment failures and fire-fighting equipment lapse to facilities management today.' },
  );
}

/** The sample inspection rounds, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
  { id: 'HDMC-2026-0001', hospitalName: 'Aurora District Hospital', inspectingOfficerName: 'Dr. Alice Hopper', inspectionDate: '2026-06-10', data: clean() },
  { id: 'HDMC-2026-0002', hospitalName: 'Borealis Community Health Centre', inspectingOfficerName: 'Bao Nguyen', inspectionDate: '2026-06-12', data: minorIssues() },
  { id: 'HDMC-2026-0003', hospitalName: 'Cobalt General Hospital', inspectingOfficerName: 'Carmen Diaz', inspectionDate: '2026-06-15', data: widespreadIssues() },
  { id: 'HDMC-2026-0004', hospitalName: 'Dusk Regional Medical Centre', inspectingOfficerName: 'Dmitri Volkov', inspectionDate: '2026-06-18', data: criticalIssues() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const result = summariseChecklist(s.data);
  const areas = Array.from(
    new Set(
      result.needsAttentionItems.map((item) => item.sectionTitle),
    ),
  );
  return {
    id: s.id,
    hospitalName: s.data.inspectionDetails.hospitalName,
    departmentOrSite: s.data.inspectionDetails.departmentOrSite,
    inspectingOfficerName: s.data.inspectionDetails.inspectingOfficerName,
    inspectionDate: s.data.inspectionDetails.inspectionDate,
    answeredCount: result.answeredCount,
    needsAttentionCount: result.needsAttentionCount,
    affectedAreas: areas.length ? areas.join(', ') : '—',
  };
});
