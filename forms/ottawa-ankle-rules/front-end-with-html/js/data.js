// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span every
// decision combination (ankle only, foot only, both, neither), both injured
// sides, and every care setting.

(function () {
'use strict';
window.OttawaAnkleRulesDashboard = window.OttawaAnkleRulesDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-204817',
    patientName: 'Okafor, Grace',
    careSetting: 'emergency-department',
    injuredSide: 'left',
    ankleXrayIndicated: true,
    footXrayIndicated: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MIU-118032',
    patientName: 'Mackenzie, Ian',
    careSetting: 'minor-injury-unit',
    injuredSide: 'right',
    ankleXrayIndicated: false,
    footXrayIndicated: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-204902',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    injuredSide: 'right',
    ankleXrayIndicated: true,
    footXrayIndicated: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'UC-550204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'urgent-care',
    injuredSide: 'left',
    ankleXrayIndicated: false,
    footXrayIndicated: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MIU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'minor-injury-unit',
    injuredSide: 'left',
    ankleXrayIndicated: true,
    footXrayIndicated: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-205039',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    injuredSide: 'right',
    ankleXrayIndicated: false,
    footXrayIndicated: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'UC-550351',
    patientName: 'Byrne, Aoife',
    careSetting: 'urgent-care',
    injuredSide: 'right',
    ankleXrayIndicated: false,
    footXrayIndicated: true,
    assessedAt: '2026-06-28'
  }
];

window.OttawaAnkleRulesDashboard.sampleAssessments = sampleAssessments;
})();
