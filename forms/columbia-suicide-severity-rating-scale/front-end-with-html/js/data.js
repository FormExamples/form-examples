// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full ideation-level range (0-5), every risk tier
// (low / moderate / high), and every care setting, with the escalation flag
// set whenever the risk tier is High.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'MH-100482',
    patientName: 'Osei, Grace',
    careSetting: 'mental-health',
    ideationLevel: 0,
    riskTier: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'PC-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'primary-care',
    ideationLevel: 1,
    riskTier: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    ideationLevel: 3,
    riskTier: 'moderate',
    escalationFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'CR-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'crisis-service',
    ideationLevel: 5,
    riskTier: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'IN-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'inpatient',
    ideationLevel: 4,
    riskTier: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'MH-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'mental-health',
    ideationLevel: 2,
    riskTier: 'low',
    escalationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'CR-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'crisis-service',
    ideationLevel: 2,
    riskTier: 'high',
    escalationFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
