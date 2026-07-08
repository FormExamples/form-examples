// Sample incident data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every WHO severity and a representative slice
// of the NCC MERP A-I categories, with the reported flag set on a subset.
// NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.MedicalErrorReportDashboard = window.MedicalErrorReportDashboard || {};

/** @type {import('./types.js').IncidentRow[]} */
const sampleIncidents = [
  {
    id: '1',
    incidentId: 'MER-2026-0001',
    incidentDate: '2026-04-12',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    whoSeverity: 'Near Miss',
    merpCategory: 'B',
    errorType: 'Wrong dose intercepted',
    reportedFlag: true
  },
  {
    id: '2',
    incidentId: 'MER-2026-0002',
    incidentDate: '2026-04-14',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    whoSeverity: 'Mild',
    merpCategory: 'D',
    errorType: 'Delayed medication administration',
    reportedFlag: true
  },
  {
    id: '3',
    incidentId: 'MER-2026-0003',
    incidentDate: '2026-04-16',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    whoSeverity: 'Severe',
    merpCategory: 'G',
    errorType: 'Anticoagulant overdose',
    reportedFlag: true
  },
  {
    id: '4',
    incidentId: 'MER-2026-0004',
    incidentDate: '2026-04-17',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    whoSeverity: 'Mild',
    merpCategory: 'C',
    errorType: 'Wrong route administration',
    reportedFlag: false
  },
  {
    id: '5',
    incidentId: 'MER-2026-0005',
    incidentDate: '2026-04-18',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    whoSeverity: 'Critical',
    merpCategory: 'I',
    errorType: 'Allergy not recorded',
    reportedFlag: true
  },
  {
    id: '6',
    incidentId: 'MER-2026-0006',
    incidentDate: '2026-04-19',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    whoSeverity: 'Near Miss',
    merpCategory: 'A',
    errorType: 'Look-alike packaging hazard',
    reportedFlag: false
  },
  {
    id: '7',
    incidentId: 'MER-2026-0007',
    incidentDate: '2026-04-20',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    whoSeverity: 'Critical',
    merpCategory: 'H',
    errorType: 'Failure to monitor INR',
    reportedFlag: true
  },
  {
    id: '8',
    incidentId: 'MER-2026-0008',
    incidentDate: '2026-04-21',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    whoSeverity: 'Moderate',
    merpCategory: 'F',
    errorType: 'Insulin dosing error',
    reportedFlag: true
  },
  {
    id: '9',
    incidentId: 'MER-2026-0009',
    incidentDate: '2026-04-22',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    whoSeverity: 'Moderate',
    merpCategory: 'E',
    errorType: 'Missed dose, intervention required',
    reportedFlag: false
  },
  {
    id: '10',
    incidentId: 'MER-2026-0010',
    incidentDate: '2026-04-24',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    whoSeverity: 'Mild',
    merpCategory: 'C',
    errorType: 'Wrong patient documentation',
    reportedFlag: true
  },
  {
    id: '11',
    incidentId: 'MER-2026-0011',
    incidentDate: '2026-04-26',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    whoSeverity: 'Severe',
    merpCategory: 'G',
    errorType: 'Surgical site marking error',
    reportedFlag: true
  },
  {
    id: '12',
    incidentId: 'MER-2026-0012',
    incidentDate: '2026-04-28',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    whoSeverity: 'Near Miss',
    merpCategory: 'B',
    errorType: 'Pharmacy double-check caught error',
    reportedFlag: false
  }
];

window.MedicalErrorReportDashboard.sampleIncidents = sampleIncidents;
})();
