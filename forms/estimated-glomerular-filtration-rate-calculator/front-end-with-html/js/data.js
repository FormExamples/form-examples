// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every CKD G-stage (G1–G5) plus an unknown (missing-input) row
// and several care settings. referralFlag is set whenever the stage is G4 or
// G5 (nephrology referral per NICE NG203).

(function () {
'use strict';
window.EstimatedGlomerularFiltrationRateCalculatorDashboard =
  window.EstimatedGlomerularFiltrationRateCalculatorDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'primary-care',
    egfr: 104,
    egfrStage: 'G1',
    referralFlag: false,
    assessedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'GP-100517',
    patientName: 'Mackenzie, Ian',
    careSetting: 'primary-care',
    egfr: 72,
    egfrStage: 'G2',
    referralFlag: false,
    assessedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'OP-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'secondary-care',
    egfr: 52,
    egfrStage: 'G3a',
    referralFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'OP-880311',
    patientName: 'Nowak, Zofia',
    careSetting: 'secondary-care',
    egfr: 37,
    egfrStage: 'G3b',
    referralFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'secondary-care',
    egfr: 22,
    egfrStage: 'G4',
    referralFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'WD-573110',
    patientName: 'Ahmed, Bilal',
    careSetting: 'secondary-care',
    egfr: 11,
    egfrStage: 'G5',
    referralFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'LB-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'laboratory',
    egfr: null,
    egfrStage: 'unknown',
    referralFlag: false,
    assessedAt: '2026-06-28'
  }
];

window.EstimatedGlomerularFiltrationRateCalculatorDashboard.sampleAssessments =
  sampleAssessments;
})();
