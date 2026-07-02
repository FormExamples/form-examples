// Sample examination data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every overall outcome (satisfactory / refer / incomplete), both
// screening contexts, and a range of care settings, with the referral flag set
// whenever the outcome is `refer`.

(function () {
'use strict';
window.NewbornAndInfantPhysicalExaminationDashboard =
  window.NewbornAndInfantPhysicalExaminationDashboard || {};

/** @type {import('./dashboard-types.js').ExaminationRow[]} */
const sampleExaminations = [
  {
    id: '1',
    babyIdentifier: '943 476 5919',
    babyName: 'Adeyemi, Baby',
    careSetting: 'maternity-ward',
    examinationContext: 'newborn-72h',
    overallOutcome: 'satisfactory',
    referralFlag: false,
    examinedAt: '2026-06-24'
  },
  {
    id: '2',
    babyIdentifier: '620 118 4433',
    babyName: 'Kowalczyk, Baby',
    careSetting: 'neonatal-unit',
    examinationContext: 'newborn-72h',
    overallOutcome: 'refer',
    referralFlag: true,
    examinedAt: '2026-06-25'
  },
  {
    id: '3',
    babyIdentifier: '705 992 3011',
    babyName: 'Okafor, Baby',
    careSetting: 'community',
    examinationContext: 'infant-6-8-week',
    overallOutcome: 'satisfactory',
    referralFlag: false,
    examinedAt: '2026-06-25'
  },
  {
    id: '4',
    babyIdentifier: '331 540 7788',
    babyName: 'MacLeod, Baby',
    careSetting: 'maternity-ward',
    examinationContext: 'newborn-72h',
    overallOutcome: 'incomplete',
    referralFlag: false,
    examinedAt: '2026-06-26'
  },
  {
    id: '5',
    babyIdentifier: '812 006 5540',
    babyName: 'Hernandez, Baby',
    careSetting: 'gp-surgery',
    examinationContext: 'infant-6-8-week',
    overallOutcome: 'refer',
    referralFlag: true,
    examinedAt: '2026-06-26'
  },
  {
    id: '6',
    babyIdentifier: '509 223 1176',
    babyName: 'Byrne, Baby',
    careSetting: 'home',
    examinationContext: 'newborn-72h',
    overallOutcome: 'satisfactory',
    referralFlag: false,
    examinedAt: '2026-06-27'
  },
  {
    id: '7',
    babyIdentifier: '148 771 9032',
    babyName: 'Nakamura, Baby',
    careSetting: 'neonatal-unit',
    examinationContext: 'newborn-72h',
    overallOutcome: 'incomplete',
    referralFlag: false,
    examinedAt: '2026-06-28'
  }
];

window.NewbornAndInfantPhysicalExaminationDashboard.sampleExaminations =
  sampleExaminations;
})();
