// Sample patient data for the IPS clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every completeness status, with varying
// missing-mandatory-section counts (0-5) and allergy comorbidities flagged
// for a subset.

(function () {
'use strict';
window.InternationalPatientSummaryDashboard =
  window.InternationalPatientSummaryDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    ipsId: 'IPS-2026-0001',
    patientName: 'Smith, Jane',
    completeness: 'Complete',
    missingMandatorySections: 0,
    allergyFlag: true,
    authoringClinician: 'Dr. Aiden Walker',
    updatedAt: '2026-04-28'
  },
  {
    id: '2',
    ipsId: 'IPS-2026-0002',
    patientName: 'Patel, Priya',
    completeness: 'Partial',
    missingMandatorySections: 0,
    allergyFlag: true,
    authoringClinician: 'Dr. Maria Lopez',
    updatedAt: '2026-04-27'
  },
  {
    id: '3',
    ipsId: 'IPS-2026-0003',
    patientName: 'Jones, Margaret',
    completeness: 'Incomplete',
    missingMandatorySections: 3,
    allergyFlag: false,
    authoringClinician: 'Dr. Hiroshi Tanaka',
    updatedAt: '2026-04-25'
  },
  {
    id: '4',
    ipsId: 'IPS-2026-0004',
    patientName: 'Williams, David',
    completeness: 'Complete',
    missingMandatorySections: 0,
    allergyFlag: false,
    authoringClinician: 'Dr. Aiden Walker',
    updatedAt: '2026-04-26'
  },
  {
    id: '5',
    ipsId: 'IPS-2026-0005',
    patientName: 'Brown, Sarah',
    completeness: 'Incomplete',
    missingMandatorySections: 5,
    allergyFlag: true,
    authoringClinician: 'Dr. Fatima Khan',
    updatedAt: '2026-04-22'
  },
  {
    id: '6',
    ipsId: 'IPS-2026-0006',
    patientName: 'Taylor, James',
    completeness: 'Complete',
    missingMandatorySections: 0,
    allergyFlag: false,
    authoringClinician: 'Dr. Maria Lopez',
    updatedAt: '2026-04-29'
  },
  {
    id: '7',
    ipsId: 'IPS-2026-0007',
    patientName: 'Davies, Helen',
    completeness: 'Incomplete',
    missingMandatorySections: 2,
    allergyFlag: true,
    authoringClinician: 'Dr. Hiroshi Tanaka',
    updatedAt: '2026-04-21'
  },
  {
    id: '8',
    ipsId: 'IPS-2026-0008',
    patientName: 'Wilson, Robert',
    completeness: 'Partial',
    missingMandatorySections: 0,
    allergyFlag: false,
    authoringClinician: 'Dr. Fatima Khan',
    updatedAt: '2026-04-24'
  },
  {
    id: '9',
    ipsId: 'IPS-2026-0009',
    patientName: 'Evans, Catherine',
    completeness: 'Partial',
    missingMandatorySections: 0,
    allergyFlag: false,
    authoringClinician: 'Dr. Aiden Walker',
    updatedAt: '2026-04-23'
  },
  {
    id: '10',
    ipsId: 'IPS-2026-0010',
    patientName: 'Thomas, Michael',
    completeness: 'Complete',
    missingMandatorySections: 0,
    allergyFlag: false,
    authoringClinician: 'Dr. Maria Lopez',
    updatedAt: '2026-04-30'
  },
  {
    id: '11',
    ipsId: 'IPS-2026-0011',
    patientName: 'Robinson, Emma',
    completeness: 'Partial',
    missingMandatorySections: 0,
    allergyFlag: true,
    authoringClinician: 'Dr. Hiroshi Tanaka',
    updatedAt: '2026-04-20'
  },
  {
    id: '12',
    ipsId: 'IPS-2026-0012',
    patientName: 'Clark, George',
    completeness: 'Incomplete',
    missingMandatorySections: 4,
    allergyFlag: false,
    authoringClinician: 'Dr. Fatima Khan',
    updatedAt: '2026-04-18'
  }
];

window.InternationalPatientSummaryDashboard.samplePatients = samplePatients;
})();
