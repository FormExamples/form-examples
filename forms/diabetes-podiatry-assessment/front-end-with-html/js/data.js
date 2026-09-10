// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every risk category (low / moderate / high / active-urgent),
// every review pathway, and the urgent flag is set whenever the overall risk
// is active-urgent (urgent multidisciplinary foot team referral).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'DPA-448120',
    patientName: 'Okoro, Amara',
    assessedAt: '2026-06-22',
    rightFootRisk: 'active-urgent',
    leftFootRisk: 'moderate',
    overallRisk: 'active-urgent',
    reviewPathway: 'urgent-mdt-referral',
    referral: 'urgent-mdt',
    reviewIntervalMonths: null,
    urgentFlag: true
  },
  {
    id: '2',
    patientIdentifier: 'DPA-448377',
    patientName: 'Nowak, Zofia',
    assessedAt: '2026-06-23',
    rightFootRisk: 'low',
    leftFootRisk: 'active-urgent',
    overallRisk: 'active-urgent',
    reviewPathway: 'urgent-mdt-referral',
    referral: 'urgent-mdt',
    reviewIntervalMonths: null,
    urgentFlag: true
  },
  {
    id: '3',
    patientIdentifier: 'DPA-100517',
    patientName: 'Fletcher, Rosemary',
    assessedAt: '2026-06-24',
    rightFootRisk: 'high',
    leftFootRisk: 'moderate',
    overallRisk: 'high',
    reviewPathway: 'high-risk-review',
    referral: 'multidisciplinary-foot-team',
    reviewIntervalMonths: 1,
    urgentFlag: false
  },
  {
    id: '4',
    patientIdentifier: 'DPA-448512',
    patientName: 'Silva, Marta',
    assessedAt: '2026-06-25',
    rightFootRisk: 'high',
    leftFootRisk: 'low',
    overallRisk: 'high',
    reviewPathway: 'high-risk-review',
    referral: 'multidisciplinary-foot-team',
    reviewIntervalMonths: 3,
    urgentFlag: false
  },
  {
    id: '5',
    patientIdentifier: 'DPA-100639',
    patientName: 'Byrne, Aoife',
    assessedAt: '2026-06-26',
    rightFootRisk: 'low',
    leftFootRisk: 'low',
    overallRisk: 'high',
    reviewPathway: 'high-risk-review',
    referral: 'multidisciplinary-foot-team',
    reviewIntervalMonths: 3,
    urgentFlag: false
  },
  {
    id: '6',
    patientIdentifier: 'DPA-448690',
    patientName: 'MacLeod, Iona',
    assessedAt: '2026-06-27',
    rightFootRisk: 'moderate',
    leftFootRisk: 'low',
    overallRisk: 'moderate',
    reviewPathway: 'moderate-risk-review',
    referral: 'foot-protection-service',
    reviewIntervalMonths: 6,
    urgentFlag: false
  },
  {
    id: '7',
    patientIdentifier: 'DPA-100742',
    patientName: 'Adeyemi, Grace',
    assessedAt: '2026-06-28',
    rightFootRisk: 'low',
    leftFootRisk: 'low',
    overallRisk: 'low',
    reviewPathway: 'annual-review',
    referral: 'none',
    reviewIntervalMonths: 12,
    urgentFlag: false
  }
];

export { sampleAssessments };
