// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the GRACE risk categories (low / intermediate / high), every
// care setting, and a spread of point totals, with the escalation flag set
// whenever the overall category is High (early angiography within 24 hours).

(function () {
'use strict';
window.GraceScoreForAcuteCoronarySyndromeDashboard =
  window.GraceScoreForAcuteCoronarySyndromeDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    gracePoints: 74,
    riskCategory: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AMU-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'acute-medical-unit',
    gracePoints: 118,
    riskCategory: 'intermediate',
    escalationFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'CCU-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'coronary-care-unit',
    gracePoints: 168,
    riskCategory: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    gracePoints: 205,
    riskCategory: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'CW-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'cardiology-ward',
    gracePoints: 96,
    riskCategory: 'intermediate',
    escalationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AMU-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'acute-medical-unit',
    gracePoints: 63,
    riskCategory: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'CCU-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'coronary-care-unit',
    gracePoints: 152,
    riskCategory: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.GraceScoreForAcuteCoronarySyndromeDashboard.sampleAssessments =
  sampleAssessments;
})();
