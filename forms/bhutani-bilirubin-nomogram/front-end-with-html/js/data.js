// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every risk zone (low → high), both threshold outcomes, and
// every care setting, with `aboveExchange` set only for the emergency row.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'NN-100482',
    patientName: 'Osei, Baby',
    careSetting: 'postnatal-ward',
    ageHours: 30,
    totalSerumBilirubinUmolL: 120,
    riskZone: 'low',
    aboveExchange: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'NN-573110',
    patientName: 'Mackenzie, Baby',
    careSetting: 'midwife-led-unit',
    ageHours: 48,
    totalSerumBilirubinUmolL: 175,
    riskZone: 'low-intermediate',
    aboveExchange: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'NN-100517',
    patientName: 'Nowak, Baby',
    careSetting: 'neonatal-unit',
    ageHours: 60,
    totalSerumBilirubinUmolL: 240,
    riskZone: 'high-intermediate',
    aboveExchange: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'NN-880204',
    patientName: 'Ahmed, Baby',
    careSetting: 'neonatal-unit',
    ageHours: 72,
    totalSerumBilirubinUmolL: 470,
    riskZone: 'high',
    aboveExchange: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'NN-573642',
    patientName: 'Fletcher, Baby',
    careSetting: 'postnatal-ward',
    ageHours: 84,
    totalSerumBilirubinUmolL: 310,
    riskZone: 'high-intermediate',
    aboveExchange: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'NN-100639',
    patientName: 'Silva, Baby',
    careSetting: 'community',
    ageHours: 120,
    totalSerumBilirubinUmolL: 200,
    riskZone: 'low',
    aboveExchange: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NN-880351',
    patientName: 'Byrne, Baby',
    careSetting: 'postnatal-ward',
    ageHours: 18,
    totalSerumBilirubinUmolL: 130,
    riskZone: 'high',
    aboveExchange: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
