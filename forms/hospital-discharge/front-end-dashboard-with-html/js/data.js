// Sample patient data for the Hospital Discharge clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every completeness status and follow-up
// arrangement, with discharge destinations representative of UK acute-trust
// patient flow; NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.HospitalDischargeDashboard = window.HospitalDischargeDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    completenessStatus: 'Complete',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'GP',
    dischargeDestination: 'Home'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    completenessStatus: 'Partial',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'Outpatient Clinic',
    dischargeDestination: 'Home'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    completenessStatus: 'Incomplete',
    mandatoryFieldsMissing: 4,
    followUpArrangement: 'Community Nurse',
    dischargeDestination: 'Care Home'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    completenessStatus: 'Complete',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'GP',
    dischargeDestination: 'Home'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    completenessStatus: 'Incomplete',
    mandatoryFieldsMissing: 6,
    followUpArrangement: 'None',
    dischargeDestination: 'Other Hospital'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    completenessStatus: 'Complete',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'Outpatient Clinic',
    dischargeDestination: 'Home'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    completenessStatus: 'Partial',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'Community Nurse',
    dischargeDestination: 'Rehab'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    completenessStatus: 'Complete',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'GP',
    dischargeDestination: 'Care Home'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    completenessStatus: 'Incomplete',
    mandatoryFieldsMissing: 2,
    followUpArrangement: 'GP',
    dischargeDestination: 'Home'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    completenessStatus: 'Partial',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'Outpatient Clinic',
    dischargeDestination: 'Home'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    completenessStatus: 'Complete',
    mandatoryFieldsMissing: 0,
    followUpArrangement: 'Community Nurse',
    dischargeDestination: 'Rehab'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    completenessStatus: 'Incomplete',
    mandatoryFieldsMissing: 5,
    followUpArrangement: 'None',
    dischargeDestination: 'Other Hospital'
  }
];

window.HospitalDischargeDashboard.samplePatients = samplePatients;
})();
