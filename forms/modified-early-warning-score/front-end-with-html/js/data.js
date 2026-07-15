// Sample observation data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the low / medium / high risk bands, every care setting, and
// both single-parameter-trigger states.

/** @type {import('./dashboard-types.js').ObservationRow[]} */
const sampleObservations = [
  {
    id: '1',
    patientIdentifier: 'WD-100482',
    patientName: 'Osei, Grace',
    careSetting: 'acute-ward',
    mewsScore: 0,
    riskBand: 'low',
    singleParameterTrigger: false,
    observedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AU-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'admissions-unit',
    mewsScore: 1,
    riskBand: 'low',
    singleParameterTrigger: false,
    observedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AS-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'assessment-unit',
    mewsScore: 3,
    riskBand: 'medium',
    singleParameterTrigger: false,
    observedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'WD-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'acute-ward',
    mewsScore: 7,
    riskBand: 'high',
    singleParameterTrigger: true,
    observedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'admissions-unit',
    mewsScore: 5,
    riskBand: 'high',
    singleParameterTrigger: false,
    observedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'AS-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'assessment-unit',
    mewsScore: 4,
    riskBand: 'medium',
    singleParameterTrigger: true,
    observedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'WD-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'other',
    mewsScore: 2,
    riskBand: 'medium',
    singleParameterTrigger: false,
    observedAt: '2026-06-28'
  }
];

export { sampleObservations };
