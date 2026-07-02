// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full NEWS2 risk-band range (low / low-medium / medium /
// high), the red-score escalation (a single parameter = 3 lifting an otherwise
// low aggregate into low-medium), and every care setting.

(function () {
'use strict';
window.NationalEarlyWarningScore2Dashboard =
  window.NationalEarlyWarningScore2Dashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'NHS 485 777 3456',
    patientName: 'Osei, Grace',
    careSetting: 'ward',
    aggregateScore: 0,
    riskBand: 'low',
    redScore: false,
    monitoringFrequency: 'Minimum 12-hourly',
    observedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'NHS 943 476 5919',
    patientName: 'Mackenzie, Ian',
    careSetting: 'acute-medical-unit',
    aggregateScore: 3,
    riskBand: 'low',
    redScore: false,
    monitoringFrequency: 'Minimum 4–6 hourly',
    observedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'MRN-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    aggregateScore: 3,
    riskBand: 'low-medium',
    redScore: true,
    monitoringFrequency: 'Minimum 1-hourly',
    observedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 611 209 8842',
    patientName: 'Ahmed, Bilal',
    careSetting: 'ward',
    aggregateScore: 6,
    riskBand: 'medium',
    redScore: false,
    monitoringFrequency: 'Minimum 1-hourly',
    observedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-100639',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'emergency-department',
    aggregateScore: 9,
    riskBand: 'high',
    redScore: true,
    monitoringFrequency: 'Continuous monitoring of vital signs',
    observedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'PH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'pre-hospital',
    aggregateScore: 7,
    riskBand: 'high',
    redScore: false,
    monitoringFrequency: 'Continuous monitoring of vital signs',
    observedAt: '2026-06-28'
  },
  {
    id: '7',
    patientIdentifier: 'NHS 277 641 0093',
    patientName: 'Silva, Marcos',
    careSetting: 'acute-medical-unit',
    aggregateScore: 1,
    riskBand: 'low',
    redScore: false,
    monitoringFrequency: 'Minimum 4–6 hourly',
    observedAt: '2026-06-28'
  }
];

window.NationalEarlyWarningScore2Dashboard.sampleAssessments = sampleAssessments;
})();
