// Sample outcome data for the outpatient outcome dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// The four rows mirror the SvelteKit sample reports (gradeA / gradeB / gradeD /
// gradeE) and their grades / flag counts are the exact output of the shared
// OOCG engine over those assessments — worked so the HTML dashboard shows the
// same values the Svelte and Loco stacks compute. Note: the "grade D" sample
// grades to an overall E because two PROM instruments worsened (PROM > worst
// of the other three domains).

(function () {
'use strict';
window.OutpatientOutcomeDashboard =
  window.OutpatientOutcomeDashboard || {};

/** @type {import('./dashboard-types.js').OutcomeRow[]} */
const sampleOutcomes = [
  {
    id: 'OO-2026-0001',
    patientName: 'Smith, John',
    assessedDate: '2026-06-10',
    specialty: 'Cardiology',
    modality: 'in_person',
    waitTimeDays: 40,
    overallGrade: 'A',
    clinicalGrade: 'A',
    promGrade: 'A',
    premGrade: 'A',
    operationalGrade: 'A',
    flagCount: 0
  },
  {
    id: 'OO-2026-0002',
    patientName: 'Patel, Priya',
    assessedDate: '2026-06-12',
    specialty: 'Neurology',
    modality: 'telephone',
    waitTimeDays: 63,
    overallGrade: 'B',
    clinicalGrade: 'B',
    promGrade: 'B',
    premGrade: 'B',
    operationalGrade: 'B',
    flagCount: 1
  },
  {
    id: 'OO-2026-0003',
    patientName: 'Jones, Margaret',
    assessedDate: '2026-06-15',
    specialty: 'Orthopaedics',
    modality: 'in_person',
    waitTimeDays: 106,
    overallGrade: 'E',
    clinicalGrade: 'D',
    promGrade: 'E',
    premGrade: 'D',
    operationalGrade: 'D',
    flagCount: 5
  },
  {
    id: 'OO-2026-0004',
    patientName: 'Williams, David',
    assessedDate: '2026-06-18',
    specialty: 'Oncology',
    modality: 'video',
    waitTimeDays: 29,
    overallGrade: 'E',
    clinicalGrade: 'E',
    promGrade: 'D',
    premGrade: 'E',
    operationalGrade: 'E',
    flagCount: 6
  }
];

window.OutpatientOutcomeDashboard.sampleOutcomes = sampleOutcomes;
})();
