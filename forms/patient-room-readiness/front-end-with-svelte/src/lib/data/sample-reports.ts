import type { PatientRoomReadinessChecklist } from '#lib/engine/types.js';
import { CHECKLIST_ITEMS } from '#lib/engine/types.js';
import { summariseReadiness } from '#lib/engine/summary.js';
import { createDefaultAssessment } from '#lib/stores/checklist.svelte.js';

/** A sample checklist: an identifier and the full data the engine tallies. */
export interface SampleAssessment {
  id: string;
  building: string;
  room: string;
  assessedDate: string;
  data: PatientRoomReadinessChecklist;
}

/** A row in the housekeeping dashboard, derived from the shared tally. */
export interface DashboardRow {
  id: string;
  buildingNameOrNumber: string;
  roomNameOrNumber: string;
  assessedDate: string;
  checkedCount: number;
  totalCount: number;
  inspectorName: string;
}

/** Mark the first `checkedCount` checkpoints (in catalogue order) checked. */
function build(
  checkedCount: number,
  location: PatientRoomReadinessChecklist['location'],
  inspector: PatientRoomReadinessChecklist['inspector'],
  inspection: PatientRoomReadinessChecklist['inspection'],
): PatientRoomReadinessChecklist {
  const d = createDefaultAssessment();
  d.location = { ...d.location, ...location };
  d.inspector = { ...d.inspector, ...inspector };
  d.inspection = { ...d.inspection, ...inspection };
  CHECKLIST_ITEMS.forEach(([field], i) => {
    d.checklist[field] = i < checkedCount;
  });
  return d;
}

/** Fully ready — every checkpoint confirmed. */
function fullyReady(): PatientRoomReadinessChecklist {
  return build(
    25,
    { buildingNameOrNumber: 'Building A', roomNameOrNumber: 'Room 204' },
    { name: 'Priya Shah', email: 'priya.shah@example.org' },
    { date: '2026-07-10', time: '08:15' },
  );
}

/** Mostly ready — a handful of checkpoints still outstanding. */
function mostlyReady(): PatientRoomReadinessChecklist {
  return build(
    21,
    { buildingNameOrNumber: 'Building A', roomNameOrNumber: 'Room 211' },
    { name: 'Tom Okafor', email: 'tom.okafor@example.org' },
    { date: '2026-07-11', time: '09:40' },
  );
}

/** Needs attention — about half the checkpoints outstanding. */
function needsAttention(): PatientRoomReadinessChecklist {
  return build(
    13,
    { buildingNameOrNumber: 'Building B', roomNameOrNumber: 'Room 108' },
    { name: 'Sofia Marín', email: 'sofia.marin@example.org' },
    { date: '2026-07-12', time: '14:05' },
  );
}

/** Freshly started — only a couple of checkpoints confirmed so far. */
function freshlyStarted(): PatientRoomReadinessChecklist {
  return build(
    3,
    { buildingNameOrNumber: 'Building C', roomNameOrNumber: 'Room 302' },
    { name: 'Liam Brennan', email: 'liam.brennan@example.org' },
    { date: '2026-07-13', time: '07:20' },
  );
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
  { id: 'PRR-2026-0001', building: 'Building A', room: 'Room 204', assessedDate: '2026-07-10', data: fullyReady() },
  { id: 'PRR-2026-0002', building: 'Building A', room: 'Room 211', assessedDate: '2026-07-11', data: mostlyReady() },
  { id: 'PRR-2026-0003', building: 'Building B', room: 'Room 108', assessedDate: '2026-07-12', data: needsAttention() },
  { id: 'PRR-2026-0004', building: 'Building C', room: 'Room 302', assessedDate: '2026-07-13', data: freshlyStarted() },
];

/** Dashboard rows derived by running the shared tally over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
  const g = summariseReadiness(s.data);
  return {
    id: s.id,
    buildingNameOrNumber: s.data.location.buildingNameOrNumber,
    roomNameOrNumber: s.data.location.roomNameOrNumber,
    assessedDate: s.assessedDate,
    checkedCount: g.checkedCount,
    totalCount: g.totalCount,
    inspectorName: s.data.inspector.name,
  };
});
