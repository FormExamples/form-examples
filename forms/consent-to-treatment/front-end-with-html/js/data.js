// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every consent status (pending/signed/expired)
// across multiple departments, with NHS numbers in the canonical
// "NNN NNN NNNN" display form.

(function () {
'use strict';
window.ConsentToTreatmentDashboard = window.ConsentToTreatmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    procedureName: 'Laparoscopic cholecystectomy',
    department: 'General Surgery',
    status: 'signed',
    scheduledDate: '2026-04-15'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    procedureName: 'Total knee replacement',
    department: 'Orthopaedics',
    status: 'pending',
    scheduledDate: '2026-04-18'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    procedureName: 'Cataract extraction',
    department: 'Ophthalmology',
    status: 'signed',
    scheduledDate: '2026-04-10'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    procedureName: 'Coronary angioplasty',
    department: 'Cardiology',
    status: 'pending',
    scheduledDate: '2026-04-22'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    procedureName: 'Hysterectomy',
    department: 'Gynaecology',
    status: 'expired',
    scheduledDate: '2026-03-01'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    procedureName: 'Appendicectomy',
    department: 'General Surgery',
    status: 'signed',
    scheduledDate: '2026-04-12'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    procedureName: 'Lumbar discectomy',
    department: 'Neurosurgery',
    status: 'pending',
    scheduledDate: '2026-04-25'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    procedureName: 'Hernia repair',
    department: 'General Surgery',
    status: 'signed',
    scheduledDate: '2026-04-08'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    procedureName: 'Mastectomy',
    department: 'Oncology',
    status: 'pending',
    scheduledDate: '2026-04-20'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    procedureName: 'Tonsillectomy',
    department: 'ENT',
    status: 'signed',
    scheduledDate: '2026-04-05'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    procedureName: 'Thyroidectomy',
    department: 'Endocrine Surgery',
    status: 'expired',
    scheduledDate: '2026-02-28'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    procedureName: 'Hip replacement',
    department: 'Orthopaedics',
    status: 'signed',
    scheduledDate: '2026-04-16'
  }
];

window.ConsentToTreatmentDashboard.samplePatients = samplePatients;
})();
