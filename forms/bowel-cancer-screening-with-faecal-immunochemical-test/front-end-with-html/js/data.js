// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every result class (negative / positive / spoilt / unclassified
// non-return), both management actions, the symptomatic-pathway override on a
// negative result, and several screening hubs. Faecal Hb is null when there is
// no valid result (non-return or spoilt sample).

(function () {
'use strict';
window.BowelCancerScreeningFitDashboard =
  window.BowelCancerScreeningFitDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    participantIdentifier: 'BCSP-100482',
    participantName: 'Osei, Grace',
    screeningHub: 'Southern Hub',
    faecalHaemoglobinUgG: 8,
    resultClass: 'negative',
    managementAction: 'routine-recall',
    symptomaticPathway: false,
    reviewedAt: '2026-06-24'
  },
  {
    id: '2',
    participantIdentifier: 'BCSP-100517',
    participantName: 'Mackenzie, Ian',
    screeningHub: 'Northern Hub',
    faecalHaemoglobinUgG: 240,
    resultClass: 'positive',
    managementAction: 'refer-colonoscopy',
    symptomaticPathway: false,
    reviewedAt: '2026-06-25'
  },
  {
    id: '3',
    participantIdentifier: 'BCSP-100628',
    participantName: 'Nowak, Zofia',
    screeningHub: 'Eastern Hub',
    faecalHaemoglobinUgG: 118,
    resultClass: 'negative',
    managementAction: 'routine-recall',
    symptomaticPathway: false,
    reviewedAt: '2026-06-25'
  },
  {
    id: '4',
    participantIdentifier: 'BCSP-100634',
    participantName: 'Ahmed, Bilal',
    screeningHub: 'Southern Hub',
    faecalHaemoglobinUgG: 6,
    resultClass: 'negative',
    managementAction: 'routine-recall',
    symptomaticPathway: true,
    reviewedAt: '2026-06-26'
  },
  {
    id: '5',
    participantIdentifier: 'BCSP-100701',
    participantName: 'Fletcher, Rosemary',
    screeningHub: 'Western Hub',
    faecalHaemoglobinUgG: null,
    resultClass: 'spoilt',
    managementAction: 'repeat-kit',
    symptomaticPathway: false,
    reviewedAt: '2026-06-27'
  },
  {
    id: '6',
    participantIdentifier: 'BCSP-100742',
    participantName: 'Silva, Marcos',
    screeningHub: 'Northern Hub',
    faecalHaemoglobinUgG: 155,
    resultClass: 'positive',
    managementAction: 'refer-colonoscopy',
    symptomaticPathway: true,
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    participantIdentifier: 'BCSP-100808',
    participantName: 'Byrne, Aoife',
    screeningHub: 'Eastern Hub',
    faecalHaemoglobinUgG: null,
    resultClass: '',
    managementAction: 'repeat-kit',
    symptomaticPathway: false,
    reviewedAt: '2026-06-28'
  }
];

window.BowelCancerScreeningFitDashboard.sampleAssessments =
  sampleAssessments;
})();
