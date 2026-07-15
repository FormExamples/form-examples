// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the full HAS-BLED score range (0-9), all three risk bands, and
// every care setting, with the high-bleeding-risk flag set whenever the score
// is >= 3.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'AF-100482',
    patientName: 'Osei, Grace',
    careSetting: 'cardiology',
    hasBledScore: 0,
    riskBand: 'low',
    highBleedingRiskFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'GP-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'general-practice',
    hasBledScore: 2,
    riskBand: 'moderate',
    highBleedingRiskFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'AC-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'anticoagulation-clinic',
    hasBledScore: 3,
    riskBand: 'high',
    highBleedingRiskFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'AM-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'acute-medical',
    hasBledScore: 5,
    riskBand: 'high',
    highBleedingRiskFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AC-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'anticoagulation-clinic',
    hasBledScore: 4,
    riskBand: 'high',
    highBleedingRiskFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'CA-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'cardiology',
    hasBledScore: 1,
    riskBand: 'moderate',
    highBleedingRiskFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'GP-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'general-practice',
    hasBledScore: 0,
    riskBand: 'low',
    highBleedingRiskFlag: false,
    assessedAt: '2026-06-28'
  },
  {
    id: '8',
    patientIdentifier: 'AM-880490',
    patientName: 'Kaur, Harpreet',
    careSetting: 'acute-medical',
    hasBledScore: 7,
    riskBand: 'high',
    highBleedingRiskFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
