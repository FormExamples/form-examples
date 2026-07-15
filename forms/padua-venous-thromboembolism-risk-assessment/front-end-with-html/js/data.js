// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full Padua score range (0-20), both risk bands, every care
// setting, and all three prophylaxis recommendations, with a mechanical
// recommendation whenever a high-risk score coincides with a bleeding
// contraindication.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'AMU-100482',
    patientName: 'Osei, Grace',
    careSetting: 'acute-medical',
    paduaScore: 0,
    riskBand: 'low',
    prophylaxisRecommendation: 'none',
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'GM-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'general-medical',
    paduaScore: 3,
    riskBand: 'low',
    prophylaxisRecommendation: 'none',
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ADM-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'admissions-unit',
    paduaScore: 4,
    riskBand: 'high',
    prophylaxisRecommendation: 'pharmacological',
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'AMU-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'acute-medical',
    paduaScore: 7,
    riskBand: 'high',
    prophylaxisRecommendation: 'pharmacological',
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'GM-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'general-medical',
    paduaScore: 6,
    riskBand: 'high',
    prophylaxisRecommendation: 'mechanical',
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ADM-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'admissions-unit',
    paduaScore: 2,
    riskBand: 'low',
    prophylaxisRecommendation: 'none',
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'OTH-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'other',
    paduaScore: 11,
    riskBand: 'high',
    prophylaxisRecommendation: 'pharmacological',
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
