// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the CHA2DS2-VASc score range (0-9), all three risk bands, and
// every care setting, with the anticoagulation flag set whenever the risk band
// is high.

(function () {
'use strict';
window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard =
  window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'primary-care',
    cha2ds2VascScore: 0,
    riskBand: 'low',
    anticoagulationRecommended: false,
    assessedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'GP-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'primary-care',
    cha2ds2VascScore: 1,
    riskBand: 'low',
    anticoagulationRecommended: false,
    assessedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'CARD-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'cardiology',
    cha2ds2VascScore: 1,
    riskBand: 'intermediate',
    anticoagulationRecommended: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'AC-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'anticoagulation-clinic',
    cha2ds2VascScore: 2,
    riskBand: 'high',
    anticoagulationRecommended: true,
    assessedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'CARD-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'cardiology',
    cha2ds2VascScore: 4,
    riskBand: 'high',
    anticoagulationRecommended: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'ED-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'emergency-department',
    cha2ds2VascScore: 3,
    riskBand: 'high',
    anticoagulationRecommended: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '7',
    patientIdentifier: 'AC-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'anticoagulation-clinic',
    cha2ds2VascScore: 6,
    riskBand: 'high',
    anticoagulationRecommended: true,
    assessedAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'CARD-573910',
    patientName: 'Kowalczyk, Henryk',
    careSetting: 'cardiology',
    cha2ds2VascScore: 9,
    riskBand: 'high',
    anticoagulationRecommended: true,
    assessedAt: '2026-06-28'
  }
];

window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard.sampleAssessments =
  sampleAssessments;
})();
