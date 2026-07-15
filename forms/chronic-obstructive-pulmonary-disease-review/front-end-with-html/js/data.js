// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span the full GOLD grade range (1-4), every ABE group (A/B/E), every
// completeness grade, and every review type, with the escalation flag set
// whenever the ABE group is E.

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'COPD-100482',
    patientName: 'Osei, Grace',
    reviewType: 'routine-annual',
    goldGrade: 1,
    abeGroup: 'A',
    reviewStatus: 'complete',
    escalationFlag: false,
    reviewedAt: '2026-06-20'
  },
  {
    id: '2',
    patientIdentifier: 'COPD-100517',
    patientName: 'Mackenzie, Ian',
    reviewType: 'routine-annual',
    goldGrade: 2,
    abeGroup: 'B',
    reviewStatus: 'complete',
    escalationFlag: false,
    reviewedAt: '2026-06-22'
  },
  {
    id: '3',
    patientIdentifier: 'COPD-100639',
    patientName: 'Nowak, Zofia',
    reviewType: 'post-exacerbation',
    goldGrade: 3,
    abeGroup: 'E',
    reviewStatus: 'complete',
    escalationFlag: true,
    reviewedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'COPD-100704',
    patientName: 'Ahmed, Bilal',
    reviewType: 'post-exacerbation',
    goldGrade: 4,
    abeGroup: 'E',
    reviewStatus: 'partial',
    escalationFlag: true,
    reviewedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'COPD-100811',
    patientName: 'Fletcher, Rosemary',
    reviewType: 'routine-annual',
    goldGrade: 2,
    abeGroup: 'A',
    reviewStatus: 'partial',
    escalationFlag: false,
    reviewedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'COPD-100927',
    patientName: 'Silva, Marcos',
    reviewType: 'opportunistic',
    goldGrade: null,
    abeGroup: 'B',
    reviewStatus: 'incomplete',
    escalationFlag: false,
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'COPD-101033',
    patientName: 'Byrne, Aoife',
    reviewType: 'routine-annual',
    goldGrade: 3,
    abeGroup: 'E',
    reviewStatus: 'complete',
    escalationFlag: true,
    reviewedAt: '2026-06-28'
  }
];

export { sampleReviews };
