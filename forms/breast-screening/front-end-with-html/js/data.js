// Sample screening data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every reading outcome, imaging classifications 1–5, the
// symptomatic-referral pathway, and every outcome band, with the urgent flag
// set for urgent and referral outcomes.

(function () {
'use strict';
window.BreastScreeningDashboard = window.BreastScreeningDashboard || {};

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
const sampleScreenings = [
  {
    id: '1',
    patientIdentifier: '485 777 3456',
    patientName: 'Osei, Grace',
    screeningUnit: 'City static unit',
    readingOutcome: 'normal-routine-recall',
    imagingClassification: null,
    outcomeBand: 'routine',
    urgentFlag: false,
    reportedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: '485 777 8120',
    patientName: 'Mackenzie, Ian',
    screeningUnit: 'Mobile unit 3',
    readingOutcome: 'technical-repeat',
    imagingClassification: null,
    outcomeBand: 'repeat',
    urgentFlag: false,
    reportedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: '485 777 2044',
    patientName: 'Nowak, Zofia',
    screeningUnit: 'City static unit',
    readingOutcome: 'recall-for-assessment',
    imagingClassification: null,
    outcomeBand: 'assessment',
    urgentFlag: false,
    reportedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: '485 777 6631',
    patientName: 'Ahmed, Bilal',
    screeningUnit: 'Riverside static unit',
    readingOutcome: 'recall-for-assessment',
    imagingClassification: 3,
    outcomeBand: 'assessment',
    urgentFlag: false,
    reportedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: '485 777 9018',
    patientName: 'Fletcher, Rosemary',
    screeningUnit: 'City static unit',
    readingOutcome: 'recall-for-assessment',
    imagingClassification: 5,
    outcomeBand: 'urgent',
    urgentFlag: true,
    reportedAt: '2026-06-25'
  },
  {
    id: '6',
    patientIdentifier: '485 777 3390',
    patientName: 'Silva, Marisa',
    screeningUnit: 'Mobile unit 3',
    readingOutcome: 'recall-for-assessment',
    imagingClassification: 2,
    outcomeBand: 'routine',
    urgentFlag: false,
    reportedAt: '2026-06-26'
  },
  {
    id: '7',
    patientIdentifier: '485 777 5527',
    patientName: 'Byrne, Aoife',
    screeningUnit: 'Riverside static unit',
    readingOutcome: '',
    imagingClassification: null,
    outcomeBand: 'referral',
    urgentFlag: true,
    reportedAt: '2026-06-27'
  }
];

window.BreastScreeningDashboard.sampleScreenings = sampleScreenings;
})();
