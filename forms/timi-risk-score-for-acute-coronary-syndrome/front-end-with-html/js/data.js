// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full TIMI score range (0-7), all three risk bands, and
// every care setting, with the high-risk flag set whenever the score is >= 5
// and the 14-day event-risk lookup applied per score.

(function () {
'use strict';
window.TimiRiskScoreForAcuteCoronarySyndromeDashboard =
  window.TimiRiskScoreForAcuteCoronarySyndromeDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    timiScore: 0,
    riskBand: 'low',
    fourteenDayRiskPercent: 4.7,
    highRiskFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'CPU-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'chest-pain-unit',
    timiScore: 1,
    riskBand: 'low',
    fourteenDayRiskPercent: 4.7,
    highRiskFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    timiScore: 3,
    riskBand: 'intermediate',
    fourteenDayRiskPercent: 13.2,
    highRiskFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'CCU-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'coronary-care',
    timiScore: 6,
    riskBand: 'high',
    fourteenDayRiskPercent: 40.9,
    highRiskFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    timiScore: 4,
    riskBand: 'intermediate',
    fourteenDayRiskPercent: 19.9,
    highRiskFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    timiScore: 2,
    riskBand: 'intermediate',
    fourteenDayRiskPercent: 8.3,
    highRiskFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'CCU-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'coronary-care',
    timiScore: 5,
    riskBand: 'high',
    fourteenDayRiskPercent: 26.2,
    highRiskFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.TimiRiskScoreForAcuteCoronarySyndromeDashboard.sampleAssessments =
  sampleAssessments;
})();
