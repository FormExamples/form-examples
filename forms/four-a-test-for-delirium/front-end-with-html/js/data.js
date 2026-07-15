// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full 4AT interpretation range (unlikely / possible
// cognitive impairment / possible delirium), every care setting, and the
// delirium flag is set whenever the total is >= 4.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'MRN-100482',
    patientName: 'Osei, Grace',
    setting: 'acute',
    totalScore: 0,
    interpretationBand: 'unlikely',
    deliriumFlag: false,
    assessmentDate: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MRN-573110',
    patientName: 'Mackenzie, Ian',
    setting: 'periop',
    totalScore: 2,
    interpretationBand: 'possibleCognitiveImpairment',
    deliriumFlag: false,
    assessmentDate: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    setting: 'ed',
    totalScore: 8,
    interpretationBand: 'possibleDelirium',
    deliriumFlag: true,
    assessmentDate: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'CH-880204',
    patientName: 'Ahmed, Bilal',
    setting: 'careHome',
    totalScore: 12,
    interpretationBand: 'possibleDelirium',
    deliriumFlag: true,
    assessmentDate: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-573642',
    patientName: 'Fletcher, Rosemary',
    setting: 'acute',
    totalScore: 4,
    interpretationBand: 'possibleDelirium',
    deliriumFlag: true,
    assessmentDate: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'MRN-100639',
    patientName: 'Silva, Marcos',
    setting: 'community',
    totalScore: 1,
    interpretationBand: 'possibleCognitiveImpairment',
    deliriumFlag: false,
    assessmentDate: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    setting: 'ed',
    totalScore: 0,
    interpretationBand: 'unlikely',
    deliriumFlag: false,
    assessmentDate: '2026-06-28'
  }
];

export { sampleAssessments };
