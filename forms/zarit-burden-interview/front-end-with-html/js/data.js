// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full ZBI-22 band range (little-or-none / mild-to-moderate /
// moderate-to-severe / severe) and both ZBI-12 bands (lower / high), across
// every care setting, both instrument forms, and a range of recipient
// conditions.

(function () {
'use strict';
window.ZaritBurdenInterviewDashboard =
  window.ZaritBurdenInterviewDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    carerIdentifier: 'CARER-204815',
    carerName: 'Okafor, Grace',
    careSetting: 'memory-service',
    instrumentForm: 'zbi22',
    recipientCondition: 'dementia',
    totalScore: 12,
    maxScore: 88,
    burdenBand: 'little-or-none',
    assessedAt: '2026-06-21'
  },
  {
    id: '2',
    carerIdentifier: 'CARER-771020',
    carerName: 'Mackenzie, Isla',
    careSetting: 'community',
    instrumentForm: 'zbi22',
    recipientCondition: 'chronic-illness',
    totalScore: 31,
    maxScore: 88,
    burdenBand: 'mild-to-moderate',
    assessedAt: '2026-06-22'
  },
  {
    id: '3',
    carerIdentifier: 'CARER-330517',
    carerName: 'Nowak, Zofia',
    careSetting: 'general-practice',
    instrumentForm: 'zbi22',
    recipientCondition: 'dementia',
    totalScore: 52,
    maxScore: 88,
    burdenBand: 'moderate-to-severe',
    assessedAt: '2026-06-23'
  },
  {
    id: '4',
    carerIdentifier: 'CARER-880042',
    carerName: 'Fletcher, Rosemary',
    careSetting: 'social-care',
    instrumentForm: 'zbi22',
    recipientCondition: 'dementia',
    totalScore: 70,
    maxScore: 88,
    burdenBand: 'severe',
    assessedAt: '2026-06-24'
  },
  {
    id: '5',
    carerIdentifier: 'CARER-204963',
    carerName: 'Silva, Marta',
    careSetting: 'community',
    instrumentForm: 'zbi12',
    recipientCondition: 'disability',
    totalScore: 9,
    maxScore: 48,
    burdenBand: 'lower',
    assessedAt: '2026-06-25'
  },
  {
    id: '6',
    carerIdentifier: 'CARER-330639',
    carerName: 'Byrne, Aoife',
    careSetting: 'memory-service',
    instrumentForm: 'zbi12',
    recipientCondition: 'dementia',
    totalScore: 22,
    maxScore: 48,
    burdenBand: 'high',
    assessedAt: '2026-06-26'
  },
  {
    id: '7',
    carerIdentifier: 'CARER-441188',
    carerName: 'Ahmed, Bilqis',
    careSetting: 'other',
    instrumentForm: 'zbi22',
    recipientCondition: 'other',
    totalScore: 40,
    maxScore: 88,
    burdenBand: 'mild-to-moderate',
    assessedAt: '2026-06-27'
  }
];

window.ZaritBurdenInterviewDashboard.sampleAssessments = sampleAssessments;
})();
