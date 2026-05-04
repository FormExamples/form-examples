// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every authorisation status and every purpose
// category, with NHS numbers in the canonical "NNN NNN NNNN" display form
// and ISO-8601 calendar dates.

(function () {
'use strict';
window.MedicalRecordsReleasePermissionDashboard =
  window.MedicalRecordsReleasePermissionDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    recipientOrg: 'Royal London Hospital',
    purpose: 'Continuing Care',
    status: 'approved',
    submittedDate: '2026-03-01'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    recipientOrg: 'Bupa Health Centre',
    purpose: 'Insurance',
    status: 'pending',
    submittedDate: '2026-03-05'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    recipientOrg: 'Kings College Hospital',
    purpose: 'Second Opinion',
    status: 'approved',
    submittedDate: '2026-02-20'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    recipientOrg: 'Harley Street Clinic',
    purpose: 'Personal Use',
    status: 'pending',
    submittedDate: '2026-03-07'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    recipientOrg: 'NHS England Legal',
    purpose: 'Legal Proceedings',
    status: 'approved',
    submittedDate: '2026-02-15'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    recipientOrg: 'Cambridge Research Institute',
    purpose: 'Research',
    status: 'expired',
    submittedDate: '2025-12-10'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    recipientOrg: 'St Thomas Hospital',
    purpose: 'Continuing Care',
    status: 'approved',
    submittedDate: '2026-01-28'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    recipientOrg: 'AXA PPP Healthcare',
    purpose: 'Insurance',
    status: 'pending',
    submittedDate: '2026-03-06'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    recipientOrg: 'University College Hospital',
    purpose: 'Second Opinion',
    status: 'approved',
    submittedDate: '2026-02-28'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    recipientOrg: 'NHS Occupational Health',
    purpose: 'Employment',
    status: 'expired',
    submittedDate: '2025-11-20'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    recipientOrg: 'Great Ormond Street Hospital',
    purpose: 'Continuing Care',
    status: 'pending',
    submittedDate: '2026-03-08'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    recipientOrg: 'Aviva Health',
    purpose: 'Insurance',
    status: 'approved',
    submittedDate: '2026-02-10'
  }
];

window.MedicalRecordsReleasePermissionDashboard.samplePatients = samplePatients;
})();
