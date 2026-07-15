// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every mortality band (low / moderate / high / very-high /
// extreme), all three variants, both dialysis states, and several care
// settings. dialysisFlag is set whenever the dialysis creatinine rule applied.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'HEP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'hepatology-clinic',
    meldVariant: 'meld-na',
    meldScore: 8,
    mortalityBand: 'low',
    dialysisFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'WD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ward',
    meldVariant: 'meld',
    meldScore: 14,
    mortalityBand: 'moderate',
    dialysisFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'TX-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'transplant-unit',
    meldVariant: 'meld-na',
    meldScore: 23,
    mortalityBand: 'high',
    dialysisFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'ICU-100628',
    patientName: 'Ahmed, Bilal',
    careSetting: 'intensive-care',
    meldVariant: 'meld-na',
    meldScore: 34,
    mortalityBand: 'very-high',
    dialysisFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'ICU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'intensive-care',
    meldVariant: 'meld-3',
    meldScore: 40,
    mortalityBand: 'extreme',
    dialysisFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'TX-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'transplant-unit',
    meldVariant: 'meld-3',
    meldScore: 18,
    mortalityBand: 'moderate',
    dialysisFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'HEP-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'hepatology-clinic',
    meldVariant: 'meld-na',
    meldScore: null,
    mortalityBand: '',
    dialysisFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
