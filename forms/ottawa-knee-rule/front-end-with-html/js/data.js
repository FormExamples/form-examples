// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span both imaging decisions, every care setting, both injured
// sides, and a range of fired-criterion counts. Because this is a decision rule
// (ANY-of), a row is "X-ray indicated" exactly when firedCount >= 1.

(function () {
'use strict';
window.OttawaKneeRuleDashboard = window.OttawaKneeRuleDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-204817',
    patientName: 'Okafor, Grace',
    careSetting: 'emergency-department',
    injuredSide: 'left',
    firedCount: 0,
    xrayIndicated: 'no',
    decision: 'xray-not-indicated',
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MIU-118032',
    patientName: 'Mackenzie, Ian',
    careSetting: 'minor-injuries-unit',
    injuredSide: 'right',
    firedCount: 1,
    xrayIndicated: 'yes',
    decision: 'xray-indicated',
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-204902',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    injuredSide: 'left',
    firedCount: 3,
    xrayIndicated: 'yes',
    decision: 'xray-indicated',
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'UCC-550204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'urgent-care',
    injuredSide: 'right',
    firedCount: 0,
    xrayIndicated: 'no',
    decision: 'xray-not-indicated',
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MIU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'minor-injuries-unit',
    injuredSide: 'left',
    firedCount: 2,
    xrayIndicated: 'yes',
    decision: 'xray-indicated',
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-205039',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    injuredSide: 'right',
    firedCount: 0,
    xrayIndicated: 'no',
    decision: 'xray-not-indicated',
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'UCC-550351',
    patientName: 'Byrne, Aoife',
    careSetting: 'urgent-care',
    injuredSide: 'left',
    firedCount: 1,
    xrayIndicated: 'yes',
    decision: 'xray-indicated',
    assessedAt: '2026-06-28'
  }
];

window.OttawaKneeRuleDashboard.sampleAssessments = sampleAssessments;
})();
