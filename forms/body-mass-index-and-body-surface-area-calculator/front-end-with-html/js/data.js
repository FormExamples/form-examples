// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every WHO weight-status band (underweight / normal / overweight
// / obese class I–III), both severe thresholds, and several care settings.
// severeFlag is set whenever the BMI is >= 40 (obese class III) or < 18.5
// (underweight).

(function () {
'use strict';
window.BmiBsaCalculatorDashboard =
  window.BmiBsaCalculatorDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'GP-100482',
    patientName: 'Osei, Grace',
    careSetting: 'primary-care',
    bmi: 22.6,
    bmiCategory: 'normal',
    bsaMosteller: 1.73,
    severeFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'OP-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'outpatient',
    bmi: 27.8,
    bmiCategory: 'overweight',
    bsaMosteller: 2.04,
    severeFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ON-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'oncology',
    bmi: 17.2,
    bmiCategory: 'underweight',
    bsaMosteller: 1.52,
    severeFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'IP-100628',
    patientName: 'Ahmed, Bilal',
    careSetting: 'inpatient',
    bmi: 41.5,
    bmiCategory: 'obese-class-3',
    bsaMosteller: 2.38,
    severeFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'PO-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'pre-operative',
    bmi: 32.4,
    bmiCategory: 'obese-class-1',
    bsaMosteller: 2.11,
    severeFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'OP-880204',
    patientName: 'Silva, Marcos',
    careSetting: 'outpatient',
    bmi: 36.1,
    bmiCategory: 'obese-class-2',
    bsaMosteller: 2.25,
    severeFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'GP-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'primary-care',
    bmi: null,
    bmiCategory: 'unknown',
    bsaMosteller: null,
    severeFlag: false,
    assessedAt: '2026-06-28'
  }
];

window.BmiBsaCalculatorDashboard.sampleAssessments =
  sampleAssessments;
})();
