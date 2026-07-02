// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span both
// classifications (perc-negative / perc-positive), both applicability states
// (pre-test probability low / not-low), and each care setting, with the workup
// flag set whenever the classification is 'perc-positive'.

(function () {
'use strict';
window.PulmonaryEmbolismRuleOutCriteriaDashboard =
  window.PulmonaryEmbolismRuleOutCriteriaDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-482201',
    patientName: 'Okafor, Chidi',
    careSetting: 'emergency-department',
    pretestProbability: 'low',
    classification: 'perc-negative',
    applicable: true,
    workupFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'ED-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'emergency-department',
    pretestProbability: 'low',
    classification: 'perc-positive',
    applicable: true,
    workupFlag: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AAC-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'acute-ambulatory',
    pretestProbability: 'not-low',
    classification: 'perc-positive',
    applicable: false,
    workupFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    pretestProbability: 'low',
    classification: 'perc-negative',
    applicable: true,
    workupFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'ED-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'emergency-department',
    pretestProbability: 'low',
    classification: 'perc-positive',
    applicable: true,
    workupFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AAC-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'acute-ambulatory',
    pretestProbability: 'low',
    classification: 'perc-negative',
    applicable: true,
    workupFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    pretestProbability: 'not-low',
    classification: 'perc-positive',
    applicable: false,
    workupFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.PulmonaryEmbolismRuleOutCriteriaDashboard.sampleAssessments =
  sampleAssessments;
})();
