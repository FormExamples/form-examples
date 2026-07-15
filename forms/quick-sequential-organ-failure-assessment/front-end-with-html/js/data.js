// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full qSOFA score range (0-3), both risk bands, and every
// care setting, with the escalation flag set whenever the score is >= 2.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    qsofaScore: 0,
    riskBand: 'lower',
    escalationFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    qsofaScore: 1,
    riskBand: 'lower',
    escalationFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    qsofaScore: 2,
    riskBand: 'higher',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'PH-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'pre-hospital',
    qsofaScore: 3,
    riskBand: 'higher',
    escalationFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    qsofaScore: 2,
    riskBand: 'higher',
    escalationFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    qsofaScore: 1,
    riskBand: 'lower',
    escalationFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'PH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'pre-hospital',
    qsofaScore: 0,
    riskBand: 'lower',
    escalationFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
