// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the McIsaac score range (-1 to 5), all three risk bands, and
// every care setting, with the red flag set on the row that carries an airway /
// quinsy warning feature.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'general-practice',
    centorScore: 0,
    mcIsaacScore: -1,
    riskBand: 'low',
    redFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'PH-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'pharmacy',
    centorScore: 1,
    mcIsaacScore: 1,
    riskBand: 'low',
    redFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'UC-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'urgent-care',
    centorScore: 2,
    mcIsaacScore: 3,
    riskBand: 'moderate',
    redFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'GP-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'general-practice',
    centorScore: 4,
    mcIsaacScore: 5,
    riskBand: 'high',
    redFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'ED-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'emergency-department',
    centorScore: 4,
    mcIsaacScore: 4,
    riskBand: 'high',
    redFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'GP-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'general-practice',
    centorScore: 2,
    mcIsaacScore: 2,
    riskBand: 'moderate',
    redFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'PH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'pharmacy',
    centorScore: 1,
    mcIsaacScore: 0,
    riskBand: 'low',
    redFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
