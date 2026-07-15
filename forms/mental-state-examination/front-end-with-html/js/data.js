// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span both completeness statuses, the full completeness-percent
// range, every care setting, and all four risk levels, with the safety flag set
// whenever a high-priority flag was raised.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'MH-204815',
    patientName: 'Okafor, Chidi',
    careSetting: 'outpatient',
    status: 'complete',
    completenessPercent: 100,
    riskLevel: 'none',
    safetyFlag: false,
    assessedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'CR-771302',
    patientName: 'Doyle, Aoife',
    careSetting: 'crisis',
    status: 'complete',
    completenessPercent: 100,
    riskLevel: 'high',
    safetyFlag: true,
    assessedAt: '2026-06-24'
  },
  {
    id: '3',
    patientIdentifier: 'IP-330149',
    patientName: 'Nowak, Piotr',
    careSetting: 'inpatient',
    status: 'partial',
    completenessPercent: 71,
    riskLevel: 'moderate',
    safetyFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'LP-905513',
    patientName: 'Fernandez, Rosa',
    careSetting: 'liaison',
    status: 'complete',
    completenessPercent: 100,
    riskLevel: 'moderate',
    safetyFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'PC-118427',
    patientName: 'Thompson, Gary',
    careSetting: 'primary-care',
    status: 'partial',
    completenessPercent: 43,
    riskLevel: 'low',
    safetyFlag: false,
    assessedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'CR-771488',
    patientName: 'Abadi, Layla',
    careSetting: 'crisis',
    status: 'complete',
    completenessPercent: 100,
    riskLevel: 'high',
    safetyFlag: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'OP-560234',
    patientName: 'Whitfield, Eleanor',
    careSetting: 'outpatient',
    status: 'complete',
    completenessPercent: 100,
    riskLevel: 'low',
    safetyFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'IP-330217',
    patientName: 'Sato, Kenji',
    careSetting: 'inpatient',
    status: 'partial',
    completenessPercent: 86,
    riskLevel: 'high',
    safetyFlag: true,
    assessedAt: '2026-06-28'
  }
];

export { sampleAssessments };
