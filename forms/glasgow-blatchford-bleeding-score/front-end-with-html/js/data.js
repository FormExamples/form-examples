// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full risk-band range (very-low / low-moderate / high) and
// score range (0-23), every care setting, with the admit flag set whenever the
// risk band is high (score >= 6).

(function () {
'use strict';
window.GlasgowBlatchfordBleedingScoreDashboard = window.GlasgowBlatchfordBleedingScoreDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    gbsScore: 0,
    riskBand: 'very-low',
    admitFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AMU-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'acute-medical-unit',
    gbsScore: 3,
    riskBand: 'low-moderate',
    admitFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    gbsScore: 5,
    riskBand: 'low-moderate',
    admitFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    gbsScore: 12,
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    gbsScore: 8,
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AMU-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'acute-medical-unit',
    gbsScore: 1,
    riskBand: 'low-moderate',
    admitFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    gbsScore: 18,
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.GlasgowBlatchfordBleedingScoreDashboard.sampleAssessments = sampleAssessments;
})();
