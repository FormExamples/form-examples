// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full CAGE score range (0-4), all three result bands, and
// every care setting, with the positive-screen flag set whenever the score is
// >= 2 and the eye-opener marker set on the morning-drinking rows.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'primary-care',
    cageScore: 0,
    resultBand: 'negative',
    positiveScreen: false,
    eyeOpener: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    cageScore: 1,
    resultBand: 'low',
    positiveScreen: false,
    eyeOpener: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    cageScore: 2,
    resultBand: 'positive',
    positiveScreen: true,
    eyeOpener: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'AN-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'antenatal',
    cageScore: 4,
    resultBand: 'positive',
    positiveScreen: true,
    eyeOpener: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    cageScore: 3,
    resultBand: 'positive',
    positiveScreen: true,
    eyeOpener: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'GP-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'primary-care',
    cageScore: 1,
    resultBand: 'low',
    positiveScreen: false,
    eyeOpener: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    cageScore: 0,
    resultBand: 'negative',
    positiveScreen: false,
    eyeOpener: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
