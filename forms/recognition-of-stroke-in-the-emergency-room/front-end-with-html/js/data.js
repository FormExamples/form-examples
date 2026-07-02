// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the signed ROSIER range (-2..+5), both bands, and every care
// setting, with the activate-pathway flag set whenever the score is > 0.

(function () {
'use strict';
window.RecognitionOfStrokeInTheEmergencyRoomDashboard =
  window.RecognitionOfStrokeInTheEmergencyRoomDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    rosierScore: 3,
    band: 'stroke-likely',
    activatePathway: true,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AM-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'acute-medical',
    rosierScore: 0,
    band: 'stroke-unlikely',
    activatePathway: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    rosierScore: 5,
    band: 'stroke-likely',
    activatePathway: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    rosierScore: -2,
    band: 'stroke-unlikely',
    activatePathway: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AM-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'acute-medical',
    rosierScore: 2,
    band: 'stroke-likely',
    activatePathway: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    rosierScore: 1,
    band: 'stroke-likely',
    activatePathway: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'OT-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'other',
    rosierScore: -1,
    band: 'stroke-unlikely',
    activatePathway: false,
    assessedAt: '2026-06-28'
  }
];

window.RecognitionOfStrokeInTheEmergencyRoomDashboard.sampleAssessments =
  sampleAssessments;
})();
