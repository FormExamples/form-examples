// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three risk bands (low / raised / high) and every care setting,
// with the statin flag set whenever the 10-year risk is >= 10% (NICE threshold).

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-448201',
    patientName: 'Osei, Grace',
    careSetting: 'general-practice',
    tenYearRiskPercent: 4.8,
    riskBand: 'low',
    statinFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'HC-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'nhs-health-check',
    tenYearRiskPercent: 9.3,
    riskBand: 'low',
    statinFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'GP-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'general-practice',
    tenYearRiskPercent: 12.6,
    riskBand: 'raised',
    statinFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'PH-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'pharmacy',
    tenYearRiskPercent: 24.1,
    riskBand: 'high',
    statinFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'HC-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'nhs-health-check',
    tenYearRiskPercent: 17.9,
    riskBand: 'raised',
    statinFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'GP-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'general-practice',
    tenYearRiskPercent: 6.1,
    riskBand: 'low',
    statinFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'PH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'pharmacy',
    tenYearRiskPercent: 28.4,
    riskBand: 'high',
    statinFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
