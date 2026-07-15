// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every risk band (very-low, low, moderate, high), each care
// setting, and both bleeding-risk states — including the bleeding-risk
// downgrade (a high-band row with a high bleeding risk is recommended
// mechanical prophylaxis rather than pharmacological).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'SW-100482',
    patientName: 'Okafor, Grace',
    careSetting: 'surgical-ward',
    capriniScore: 1,
    riskBand: 'very-low',
    recommendedProphylaxis: 'early-ambulation',
    highBleedingRisk: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MW-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'medical-ward',
    capriniScore: 2,
    riskBand: 'low',
    recommendedProphylaxis: 'mechanical',
    highBleedingRisk: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'PA-100517',
    patientName: 'Novak, Zofia',
    careSetting: 'pre-operative-clinic',
    capriniScore: 4,
    riskBand: 'moderate',
    recommendedProphylaxis: 'pharmacological-or-mechanical',
    highBleedingRisk: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'SW-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'surgical-ward',
    capriniScore: 8,
    riskBand: 'high',
    recommendedProphylaxis: 'pharmacological-plus-mechanical',
    highBleedingRisk: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MW-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'medical-ward',
    capriniScore: 6,
    riskBand: 'high',
    recommendedProphylaxis: 'mechanical',
    highBleedingRisk: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'SW-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'surgical-ward',
    capriniScore: 3,
    riskBand: 'moderate',
    recommendedProphylaxis: 'mechanical',
    highBleedingRisk: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'PA-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'pre-operative-clinic',
    capriniScore: 0,
    riskBand: 'very-low',
    recommendedProphylaxis: 'early-ambulation',
    highBleedingRisk: false,
    assessedAt: '2026-06-28'
  },
  {
    id: '8',
    patientIdentifier: 'MW-573988',
    patientName: 'Kaur, Harpreet',
    careSetting: 'medical-ward',
    capriniScore: 5,
    riskBand: 'high',
    recommendedProphylaxis: 'pharmacological-plus-mechanical',
    highBleedingRisk: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
