// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every classification band (low / normal / high / very-high /
// unknown), the hypoalbuminaemia-masking case, and several care settings.
// raisedFlag is set whenever the classification is high or very-high.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    anionGap: 12.0,
    correctedAnionGap: null,
    classification: 'normal',
    raisedFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    anionGap: 6.0,
    correctedAnionGap: 6.0,
    classification: 'low',
    raisedFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    anionGap: 18.0,
    correctedAnionGap: 18.0,
    classification: 'high',
    raisedFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'IC-100628',
    patientName: 'Ahmed, Bilal',
    careSetting: 'intensive-care',
    anionGap: 24.0,
    correctedAnionGap: 25.5,
    classification: 'very-high',
    raisedFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'WD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'ward',
    anionGap: 14.0,
    correctedAnionGap: 18.0,
    classification: 'high',
    raisedFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'IC-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'intensive-care',
    anionGap: 10.0,
    correctedAnionGap: null,
    classification: 'normal',
    raisedFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'LB-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'laboratory',
    anionGap: null,
    correctedAnionGap: null,
    classification: 'unknown',
    raisedFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
