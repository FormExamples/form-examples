// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full PEWS escalation range (routine / low / medium / high),
// every age band, the single-parameter=3 override (a single parameter scoring 3
// lifting an otherwise low aggregate into medium), the nurse / parent concern
// triggers, and every care setting.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'NHS 485 777 3456',
    patientName: 'Osei, Grace',
    ageBand: 'infant',
    careSetting: 'ward',
    aggregateScore: 0,
    escalationBand: 'routine',
    singleParameterTrigger: false,
    concernTrigger: false,
    monitoringFrequency: 'Routine (e.g. 4-hourly)',
    observedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MRN-100517',
    patientName: 'Nowak, Zofia',
    ageBand: 'young-child',
    careSetting: 'childrens-assessment-unit',
    aggregateScore: 3,
    escalationBand: 'low',
    singleParameterTrigger: false,
    concernTrigger: false,
    monitoringFrequency: 'Minimum hourly',
    observedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'MRN-100639',
    patientName: 'Fletcher, Rowan',
    ageBand: 'neonate',
    careSetting: 'emergency-department',
    aggregateScore: 3,
    escalationBand: 'medium',
    singleParameterTrigger: true,
    concernTrigger: false,
    monitoringFrequency: 'Continuous monitoring',
    observedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 611 209 8842',
    patientName: 'Ahmed, Bilal',
    ageBand: 'child',
    careSetting: 'ward',
    aggregateScore: 5,
    escalationBand: 'medium',
    singleParameterTrigger: false,
    concernTrigger: true,
    monitoringFrequency: 'Continuous monitoring',
    observedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-100812',
    patientName: 'Byrne, Aoife',
    ageBand: 'adolescent',
    careSetting: 'emergency-department',
    aggregateScore: 9,
    escalationBand: 'high',
    singleParameterTrigger: true,
    concernTrigger: true,
    monitoringFrequency: 'Continuous monitoring',
    observedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'NHS 277 641 0093',
    patientName: 'Silva, Mateus',
    ageBand: 'infant',
    careSetting: 'childrens-assessment-unit',
    aggregateScore: 7,
    escalationBand: 'high',
    singleParameterTrigger: false,
    concernTrigger: false,
    monitoringFrequency: 'Continuous monitoring',
    observedAt: '2026-06-28'
  },
  {
    id: '7',
    patientIdentifier: 'MRN-101044',
    patientName: 'Kaur, Simran',
    ageBand: 'young-child',
    careSetting: 'ward',
    aggregateScore: 1,
    escalationBand: 'routine',
    singleParameterTrigger: false,
    concernTrigger: true,
    monitoringFrequency: 'Routine (e.g. 4-hourly)',
    observedAt: '2026-06-28'
  }
];

export { sampleAssessments };
