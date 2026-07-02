// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every risk band (low, at-risk, high, very-high), each care
// setting, and both existing-pressure-damage states.

(function () {
'use strict';
window.WaterlowPressureUlcerRiskAssessmentDashboard =
  window.WaterlowPressureUlcerRiskAssessmentDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'AW-100482',
    patientName: 'Okafor, Grace',
    careSetting: 'acute-ward',
    waterlowScore: 7,
    riskBand: 'low',
    existingPressureDamage: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'CH-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'care-home',
    waterlowScore: 12,
    riskBand: 'at-risk',
    existingPressureDamage: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'CM-100517',
    patientName: 'Novak, Zofia',
    careSetting: 'community',
    waterlowScore: 17,
    riskBand: 'high',
    existingPressureDamage: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'AW-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'acute-ward',
    waterlowScore: 24,
    riskBand: 'very-high',
    existingPressureDamage: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'HO-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'hospice',
    waterlowScore: 21,
    riskBand: 'very-high',
    existingPressureDamage: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'CH-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'care-home',
    waterlowScore: 13,
    riskBand: 'at-risk',
    existingPressureDamage: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'CM-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'community',
    waterlowScore: 5,
    riskBand: 'low',
    existingPressureDamage: false,
    assessedAt: '2026-06-28'
  },
  {
    id: '8',
    patientIdentifier: 'AW-573988',
    patientName: 'Kaur, Harpreet',
    careSetting: 'acute-ward',
    waterlowScore: 16,
    riskBand: 'high',
    existingPressureDamage: true,
    assessedAt: '2026-06-28'
  }
];

window.WaterlowPressureUlcerRiskAssessmentDashboard.sampleAssessments =
  sampleAssessments;
})();
