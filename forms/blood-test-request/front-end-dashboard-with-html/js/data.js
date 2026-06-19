// Sample request data for the blood-test-request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / stat),
// every appropriateness band, and every pre-analytical band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the required worked cases: a routine monitoring request, a stat case, a
// fasting-not-met case, and a no-test-selected case.

(function () {
'use strict';
window.BloodTestRequestDashboard = window.BloodTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'B001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testsSelectedCount: 3,
    indication: 'routine-monitoring',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'B002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testsSelectedCount: 2,
    indication: 'diabetes-monitoring',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['fasting-required-not-met']
  },
  {
    id: 'B003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testsSelectedCount: 1,
    indication: 'infection',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['stat-critical']
  },
  {
    id: 'B004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testsSelectedCount: 2,
    indication: 'cardiovascular-risk',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'stat',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['stat-critical', 'fasting-required-not-met']
  },
  {
    id: 'B005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testsSelectedCount: 0,
    indication: '',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 30,
    clinician: 'Dr H Iqbal',
    flags: ['no-test-selected', 'missing-indication']
  },
  {
    id: 'B006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testsSelectedCount: 4,
    indication: 'pre-operative',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'B007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testsSelectedCount: 1,
    indication: 'fatigue',
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-details']
  },
  {
    id: 'B008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testsSelectedCount: 2,
    indication: 'anaemia',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['blood-borne-virus-precaution']
  },
  {
    id: 'B009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testsSelectedCount: 1,
    indication: 'thyroid-symptoms',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'B010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testsSelectedCount: 5,
    indication: 'routine-monitoring',
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr M Adebayo',
    flags: ['retest-interval-breach', 'duplicate-recent-test']
  }
];

window.BloodTestRequestDashboard.sampleRequests = sampleRequests;
})();
