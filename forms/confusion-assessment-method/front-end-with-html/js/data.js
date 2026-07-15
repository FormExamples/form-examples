// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every classification (present / absent / unable-to-assess),
// both CAM variants, and each motoric subtype, with the delirium flag set
// whenever the classification is 'present'.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'MRN-482201',
    patientName: 'Osei, Grace',
    wardUnit: 'Care of the Elderly, Ward 12',
    camVariant: 'cam',
    classification: 'present',
    motoricSubtype: 'hypoactive',
    deliriumFlag: true,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'MRN-573110',
    patientName: 'Mackenzie, Ian',
    wardUnit: 'Orthogeriatrics, Ward 7',
    camVariant: 'cam',
    classification: 'absent',
    motoricSubtype: 'normal',
    deliriumFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ICU-100517',
    patientName: 'Nowak, Zofia',
    wardUnit: 'Intensive Care Unit',
    camVariant: 'cam-icu',
    classification: 'unable-to-assess',
    motoricSubtype: '',
    deliriumFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ICU-880204',
    patientName: 'Ahmed, Bilal',
    wardUnit: 'Intensive Care Unit',
    camVariant: 'cam-icu',
    classification: 'present',
    motoricSubtype: 'hyperactive',
    deliriumFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-573642',
    patientName: 'Fletcher, Rosemary',
    wardUnit: 'Surgical Recovery',
    camVariant: 'cam',
    classification: 'present',
    motoricSubtype: 'mixed',
    deliriumFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'MRN-100639',
    patientName: 'Silva, Marcos',
    wardUnit: 'Emergency Department',
    camVariant: 'cam',
    classification: 'absent',
    motoricSubtype: 'normal',
    deliriumFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'MRN-880351',
    patientName: 'Byrne, Aoife',
    wardUnit: 'Care of the Elderly, Ward 12',
    camVariant: 'cam',
    classification: 'present',
    motoricSubtype: 'hypoactive',
    deliriumFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
