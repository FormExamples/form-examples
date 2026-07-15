// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span several care settings, adult and child patients, and a range of
// %TBSA values. total24hVolumeMl = 4 × weight × %TBSA. majorBurnFlag is true
// when %TBSA meets the age-band referral threshold (adult ≥ 15%, child ≥ 10%).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    careSetting: 'emergency-department',
    tbsaPercent: 30,
    total24hVolumeMl: 8400,
    majorBurnFlag: true,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'ED-100517',
    patientName: 'Mackenzie, Ian',
    careSetting: 'emergency-department',
    tbsaPercent: 8,
    total24hVolumeMl: 2560,
    majorBurnFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'BU-573110',
    patientName: 'Nowak, Zofia',
    careSetting: 'burns-unit',
    tbsaPercent: 45,
    total24hVolumeMl: 10800,
    majorBurnFlag: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '4',
    patientIdentifier: 'PED-100628',
    patientName: 'Ahmed, Bilal',
    careSetting: 'emergency-department',
    tbsaPercent: 12,
    total24hVolumeMl: 960,
    majorBurnFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'PED-100713',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'burns-unit',
    tbsaPercent: 6,
    total24hVolumeMl: 360,
    majorBurnFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'ICU-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'intensive-care',
    tbsaPercent: 18,
    total24hVolumeMl: 6480,
    majorBurnFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'RET-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'retrieval',
    tbsaPercent: null,
    total24hVolumeMl: null,
    majorBurnFlag: false,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
