// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the risk bands (low, intermediate, high, clinical-only), every
// care setting, and both scored (full) and pre-endoscopy (clinical-only)
// assessments. The escalation flag is set for high-risk assessments (full
// score >= 5, or a pre-endoscopy clinical score >= 3).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    clinicalRockallScore: 0,
    fullRockallScore: 1,
    riskBand: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    clinicalRockallScore: 2,
    fullRockallScore: 4,
    riskBand: 'intermediate',
    escalationFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'EU-880204',
    patientName: 'Nowak, Zofia',
    careSetting: 'endoscopy-unit',
    clinicalRockallScore: 5,
    fullRockallScore: 8,
    riskBand: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-100517',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    clinicalRockallScore: 4,
    fullRockallScore: null,
    riskBand: 'clinical-only',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'EU-880351',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'endoscopy-unit',
    clinicalRockallScore: 3,
    fullRockallScore: 5,
    riskBand: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'WD-573642',
    patientName: 'Silva, Marcos',
    careSetting: 'ward',
    clinicalRockallScore: 1,
    fullRockallScore: 2,
    riskBand: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-100639',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    clinicalRockallScore: 0,
    fullRockallScore: null,
    riskBand: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
