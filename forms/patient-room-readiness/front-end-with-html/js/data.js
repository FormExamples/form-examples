// Sample checklist data for the dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample.ts` so the two
// implementations show identical demo content when the backend is offline.

/** @type {import('./dashboard-types.js').ChecklistRow[]} */
const sampleAssessments = [
  { id: 'R001', date: '2026-04-20', building: 'Building A', room: 'Room 101', checkedCount: 25, totalCount: 25, inspector: 'P. Housekeeper' },
  { id: 'R002', date: '2026-04-20', building: 'Building A', room: 'Room 102', checkedCount: 22, totalCount: 25, inspector: 'P. Housekeeper' },
  { id: 'R003', date: '2026-04-21', building: 'Building A', room: 'Room 204', checkedCount: 25, totalCount: 25, inspector: 'S. Facilities' },
  { id: 'R004', date: '2026-04-21', building: 'Building B', room: 'Room 12', checkedCount: 19, totalCount: 25, inspector: 'S. Facilities' },
  { id: 'R005', date: '2026-04-22', building: 'Building B', room: 'Room 14', checkedCount: 25, totalCount: 25, inspector: 'M. Ward Clerk' },
  { id: 'R006', date: '2026-04-22', building: 'Building C', room: 'Room 301', checkedCount: 24, totalCount: 25, inspector: 'M. Ward Clerk' }
];

export { sampleAssessments };
