// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the Wells score range, both two-level bands, and every care
// setting, with the recommended investigation following the band (ultrasound
// when DVT likely, D-dimer when DVT unlikely).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-204817',
    patientName: 'Okafor, Grace',
    careSetting: 'emergency-department',
    wellsScore: 0,
    twoLevelBand: 'unlikely',
    recommendedInvestigation: 'd-dimer',
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'AMB-118032',
    patientName: 'Mackenzie, Ian',
    careSetting: 'ambulatory',
    wellsScore: 1,
    twoLevelBand: 'unlikely',
    recommendedInvestigation: 'd-dimer',
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-204902',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    wellsScore: 3,
    twoLevelBand: 'likely',
    recommendedInvestigation: 'proximal-leg-vein-ultrasound',
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'DVT-550204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'dvt-clinic',
    wellsScore: 5,
    twoLevelBand: 'likely',
    recommendedInvestigation: 'proximal-leg-vein-ultrasound',
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AMU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'acute-medical-unit',
    wellsScore: 2,
    twoLevelBand: 'likely',
    recommendedInvestigation: 'proximal-leg-vein-ultrasound',
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-205039',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    wellsScore: -1,
    twoLevelBand: 'unlikely',
    recommendedInvestigation: 'd-dimer',
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'DVT-550351',
    patientName: 'Byrne, Aoife',
    careSetting: 'dvt-clinic',
    wellsScore: 1,
    twoLevelBand: 'unlikely',
    recommendedInvestigation: 'd-dimer',
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
