// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full EPDS band range (lower / possible / likely), both
// perinatal stages, every care setting, and both self-harm-flag states. Note
// that the self-harm flag can be raised even when the total is in the lower
// band (row 4) — item 10 is evaluated independently of the total.

(function () {
'use strict';
window.EdinburghPostnatalDepressionScaleDashboard =
  window.EdinburghPostnatalDepressionScaleDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    respondentIdentifier: 'ANC-204815',
    respondentName: 'Okafor, Grace',
    careSetting: 'maternity',
    perinatalStage: 'antenatal',
    totalScore: 4,
    band: 'lower',
    selfHarmFlag: false,
    assessedAt: '2026-06-22'
  },
  {
    id: '2',
    respondentIdentifier: 'HV-771020',
    respondentName: 'Mackenzie, Isla',
    careSetting: 'community',
    perinatalStage: 'postnatal',
    totalScore: 8,
    band: 'lower',
    selfHarmFlag: false,
    assessedAt: '2026-06-23'
  },
  {
    id: '3',
    respondentIdentifier: 'GP-330517',
    respondentName: 'Nowak, Zofia',
    careSetting: 'general-practice',
    perinatalStage: 'postnatal',
    totalScore: 11,
    band: 'possible',
    selfHarmFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '4',
    respondentIdentifier: 'HV-771204',
    respondentName: 'Ahmed, Bilqis',
    careSetting: 'community',
    perinatalStage: 'postnatal',
    totalScore: 7,
    band: 'lower',
    selfHarmFlag: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '5',
    respondentIdentifier: 'PMH-880042',
    respondentName: 'Fletcher, Rosemary',
    careSetting: 'perinatal-mh',
    perinatalStage: 'postnatal',
    totalScore: 18,
    band: 'likely',
    selfHarmFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '6',
    respondentIdentifier: 'ANC-204963',
    respondentName: 'Silva, Marta',
    careSetting: 'maternity',
    perinatalStage: 'antenatal',
    totalScore: 13,
    band: 'likely',
    selfHarmFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    respondentIdentifier: 'GP-330639',
    respondentName: 'Byrne, Aoife',
    careSetting: 'general-practice',
    perinatalStage: 'postnatal',
    totalScore: 2,
    band: 'lower',
    selfHarmFlag: false,
    assessedAt: '2026-06-28'
  }
];

window.EdinburghPostnatalDepressionScaleDashboard.sampleAssessments =
  sampleAssessments;
})();
