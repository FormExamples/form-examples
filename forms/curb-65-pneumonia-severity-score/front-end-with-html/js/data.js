// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the CURB-65 score range (0-5) and the CRB-65 fallback (0-4),
// all three risk bands, and every care setting, with the admit flag set
// whenever the total score is >= 3.

(function () {
'use strict';
window.Curb65PneumoniaSeverityScoreDashboard =
  window.Curb65PneumoniaSeverityScoreDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-204817',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    totalScore: 0,
    scoreVariant: 'curb-65',
    riskBand: 'low',
    admitFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'GP-118322',
    patientName: 'Mackenzie, Ian',
    careSetting: 'primary-care',
    totalScore: 1,
    scoreVariant: 'crb-65',
    riskBand: 'intermediate',
    admitFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AMU-573110',
    patientName: 'Nowak, Zofia',
    careSetting: 'acute-medical-unit',
    totalScore: 2,
    scoreVariant: 'curb-65',
    riskBand: 'intermediate',
    admitFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-204930',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    totalScore: 3,
    scoreVariant: 'curb-65',
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-880204',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    totalScore: 5,
    scoreVariant: 'curb-65',
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'CM-441207',
    patientName: 'Silva, Marcos',
    careSetting: 'community',
    totalScore: 0,
    scoreVariant: 'crb-65',
    riskBand: 'low',
    admitFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'GP-118506',
    patientName: 'Byrne, Aoife',
    careSetting: 'primary-care',
    totalScore: 3,
    scoreVariant: 'crb-65',
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-28'
  },
  {
    id: '8',
    patientIdentifier: 'AMU-573642',
    patientName: 'Kaur, Simran',
    careSetting: 'acute-medical-unit',
    totalScore: 4,
    scoreVariant: 'curb-65',
    riskBand: 'high',
    admitFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.Curb65PneumoniaSeverityScoreDashboard.sampleAssessments =
  sampleAssessments;
})();
