// Sample dashboard data for the return-to-work clinician dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Four realistic rows ported from the Svelte `sample-reports.ts` fixtures,
// spanning every fitness statement (fit / may-be-fit / not-fit) and every
// restriction priority (routine / standard / restricted / high-risk). The
// derived columns (fitnessStatement, restrictionPriority, phasedReturnFlag,
// daysAbsent, flagCount) are exactly what the shared engine
// (`js/grader.js`) computes over each source record.

/** @type {import('./dashboard-types.js').DashboardRow[]} */
const sampleRows = [
  {
    id: 'RTW-2026-0001',
    patientName: 'Smith, John',
    assessedDate: '2026-06-10',
    fitnessStatement: 'fit',
    restrictionPriority: 'routine',
    phasedReturnFlag: false,
    daysAbsent: 10,
    flagCount: 0
  },
  {
    id: 'RTW-2026-0002',
    patientName: 'Desai, Priya',
    assessedDate: '2026-06-12',
    fitnessStatement: 'may-be-fit',
    restrictionPriority: 'standard',
    phasedReturnFlag: true,
    daysAbsent: 35,
    flagCount: 0
  },
  {
    id: 'RTW-2026-0003',
    patientName: 'Hughes, David',
    assessedDate: '2026-06-15',
    fitnessStatement: 'may-be-fit',
    restrictionPriority: 'restricted',
    phasedReturnFlag: true,
    daysAbsent: 60,
    flagCount: 0
  },
  {
    id: 'RTW-2026-0004',
    patientName: 'Bennett, Sarah',
    assessedDate: '2026-06-18',
    fitnessStatement: 'not-fit',
    restrictionPriority: 'high-risk',
    phasedReturnFlag: false,
    daysAbsent: 54,
    flagCount: 7
  }
];

export { sampleRows };
