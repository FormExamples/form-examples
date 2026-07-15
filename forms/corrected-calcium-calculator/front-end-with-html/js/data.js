// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every classification band (hypocalcaemia / normal /
// hypercalcaemia / unknown), both severe thresholds, and several care settings.
// severeFlag is set whenever the corrected calcium is >= 3.0 or < 1.9 mmol/L.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'general-practice',
    correctedCalcium: 2.42,
    classification: 'normal',
    severeFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    correctedCalcium: 2.08,
    classification: 'hypocalcaemia',
    severeFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    correctedCalcium: 2.86,
    classification: 'hypercalcaemia',
    severeFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ED-100628',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    correctedCalcium: 3.14,
    classification: 'hypercalcaemia',
    severeFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    correctedCalcium: 1.78,
    classification: 'hypocalcaemia',
    severeFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'OP-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'outpatient',
    correctedCalcium: 2.55,
    classification: 'normal',
    severeFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'LB-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'laboratory',
    correctedCalcium: null,
    classification: 'unknown',
    severeFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
