// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every mortality band (low, moderate, high, veryHigh, extreme),
// both directions of delta-SOFA (improving and deteriorating), and set the
// Sepsis-3 flag wherever infection is suspected and delta-SOFA is >= 2.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ICU-100482',
    patientName: 'Osei, Grace',
    careLocation: 'icu',
    totalSofa: 3,
    deltaSofa: -2,
    mortalityBand: 'low',
    sepsis3Flag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'HDU-573110',
    patientName: 'Mackenzie, Ian',
    careLocation: 'hdu',
    totalSofa: 8,
    deltaSofa: 2,
    mortalityBand: 'moderate',
    sepsis3Flag: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ICU-100517',
    patientName: 'Nowak, Zofia',
    careLocation: 'icu',
    totalSofa: 11,
    deltaSofa: 3,
    mortalityBand: 'high',
    sepsis3Flag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-880204',
    patientName: 'Ahmed, Bilal',
    careLocation: 'emergency-department',
    totalSofa: 14,
    deltaSofa: 4,
    mortalityBand: 'veryHigh',
    sepsis3Flag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'ICU-573642',
    patientName: 'Fletcher, Rosemary',
    careLocation: 'icu',
    totalSofa: 19,
    deltaSofa: 6,
    mortalityBand: 'extreme',
    sepsis3Flag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AMU-100639',
    patientName: 'Silva, Marcos',
    careLocation: 'acute-medical-unit',
    totalSofa: 5,
    deltaSofa: 0,
    mortalityBand: 'low',
    sepsis3Flag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
