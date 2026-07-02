// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the AUDIT-C score range (0-12), all four risk bands, and every
// care setting, with the positive-screen flag set whenever the score is >= 5.

(function () {
'use strict';
window.AlcoholUseDisordersIdentificationTestConsumptionDashboard =
  window.AlcoholUseDisordersIdentificationTestConsumptionDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'primary-care',
    auditcScore: 2,
    riskBand: 'lower',
    positiveScreen: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'HC-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'health-check',
    auditcScore: 4,
    riskBand: 'lower',
    positiveScreen: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    auditcScore: 6,
    riskBand: 'increasing',
    positiveScreen: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'IN-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'inpatient',
    auditcScore: 9,
    riskBand: 'higher',
    positiveScreen: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'GP-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'primary-care',
    auditcScore: 12,
    riskBand: 'possible-dependence',
    positiveScreen: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'OT-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'other',
    auditcScore: 5,
    riskBand: 'increasing',
    positiveScreen: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    auditcScore: 0,
    riskBand: 'lower',
    positiveScreen: false,
    assessedAt: '2026-06-28'
  },
  {
    id: '8',
    patientIdentifier: 'HC-880490',
    patientName: 'Vargas, Lucia',
    careSetting: 'health-check',
    auditcScore: 11,
    riskBand: 'possible-dependence',
    positiveScreen: true,
    assessedAt: '2026-06-28'
  }
];

window.AlcoholUseDisordersIdentificationTestConsumptionDashboard.sampleAssessments =
  sampleAssessments;
})();
