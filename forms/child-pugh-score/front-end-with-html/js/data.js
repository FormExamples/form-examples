// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full Child-Pugh class range (A/B/C) and score range
// (5-15), every care setting, with the decompensated flag set whenever the
// class is C.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'HEP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'hepatology-clinic',
    childPughScore: 5,
    childPughClass: 'A',
    decompensatedFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    childPughScore: 6,
    childPughClass: 'A',
    decompensatedFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'HEP-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'hepatology-clinic',
    childPughScore: 8,
    childPughClass: 'B',
    decompensatedFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ICU-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'intensive-care',
    childPughScore: 12,
    childPughClass: 'C',
    decompensatedFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'PRE-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'pre-operative',
    childPughScore: 9,
    childPughClass: 'B',
    decompensatedFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'HEP-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'hepatology-clinic',
    childPughScore: 7,
    childPughClass: 'B',
    decompensatedFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'WD-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'ward',
    childPughScore: 14,
    childPughClass: 'C',
    decompensatedFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
