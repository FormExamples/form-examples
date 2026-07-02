// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the Wells score range (0..12.5, including fractional totals),
// both two-level bands, and every care setting, with the recommended pathway
// following the band (CTPA when PE likely, D-dimer when PE unlikely).

(function () {
'use strict';
window.WellsScoreForPulmonaryEmbolismDashboard =
  window.WellsScoreForPulmonaryEmbolismDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-311204',
    patientName: 'Okafor, Grace',
    careSetting: 'emergency-department',
    wellsScore: 0,
    twoLevelBand: 'unlikely',
    recommendedPathway: 'd-dimer',
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AMB-118032',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ambulatory',
    wellsScore: 1.5,
    twoLevelBand: 'unlikely',
    recommendedPathway: 'd-dimer',
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AMU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'acute-medical-unit',
    wellsScore: 4,
    twoLevelBand: 'unlikely',
    recommendedPathway: 'd-dimer',
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-311399',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    wellsScore: 4.5,
    twoLevelBand: 'likely',
    recommendedPathway: 'ctpa',
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'ED-311512',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    wellsScore: 6,
    twoLevelBand: 'likely',
    recommendedPathway: 'ctpa',
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AMU-573781',
    patientName: 'Silva, Marcos',
    careSetting: 'acute-medical-unit',
    wellsScore: 9,
    twoLevelBand: 'likely',
    recommendedPathway: 'ctpa',
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'OTH-204417',
    patientName: 'Byrne, Aoife',
    careSetting: 'other',
    wellsScore: 3,
    twoLevelBand: 'unlikely',
    recommendedPathway: 'd-dimer',
    assessedAt: '2026-06-28'
  }
];

window.WellsScoreForPulmonaryEmbolismDashboard.sampleAssessments =
  sampleAssessments;
})();
