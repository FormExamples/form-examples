// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span the severity bands (mild / moderate / severe), an
// intubated-verbal-NT case (total undefined, reported "9T"), every care
// setting, and the airway-risk flag set whenever a defined total is <= 8.

(function () {
'use strict';
window.GlasgowComaScaleDashboard = window.GlasgowComaScaleDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'ED-100482',
    patientName: 'Osei, Grace',
    setting: 'ed',
    totalScore: 15,
    totalDisplay: '15',
    severityBand: 'mild',
    gcsP: 15,
    airwayFlag: false,
    assessedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'NR-573110',
    patientName: 'Mackenzie, Ian',
    setting: 'neuro',
    totalScore: 11,
    totalDisplay: '11',
    severityBand: 'moderate',
    gcsP: 11,
    airwayFlag: false,
    assessedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'CC-100517',
    patientName: 'Nowak, Zofia',
    setting: 'critical-care',
    totalScore: 6,
    totalDisplay: '6',
    severityBand: 'severe',
    gcsP: 5,
    airwayFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'PH-880204',
    patientName: 'Ahmed, Bilal',
    setting: 'pre-hospital',
    totalScore: 3,
    totalDisplay: '3',
    severityBand: 'severe',
    gcsP: 1,
    airwayFlag: true,
    assessedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'CC-573642',
    patientName: 'Fletcher, Rosemary',
    setting: 'critical-care',
    totalScore: null,
    totalDisplay: '9T',
    severityBand: '',
    gcsP: null,
    airwayFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'ED-100639',
    patientName: 'Silva, Marcos',
    setting: 'ed',
    totalScore: 14,
    totalDisplay: '14',
    severityBand: 'mild',
    gcsP: 14,
    airwayFlag: false,
    assessedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NR-880351',
    patientName: 'Byrne, Aoife',
    setting: 'neuro',
    totalScore: 8,
    totalDisplay: '8',
    severityBand: 'severe',
    gcsP: 7,
    airwayFlag: true,
    assessedAt: '2026-06-28'
  }
];

window.GlasgowComaScaleDashboard.sampleAssessments = sampleAssessments;
})();
