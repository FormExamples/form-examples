// Sample request data for the breast mammography vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every clinical
// priority band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the required worked cases: a routine
// screening request, a two-week-wait breast-lump case, and a
// bloody-nipple-discharge case.

(function () {
'use strict';
window.MammographyTestRequestDashboard =
  window.MammographyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'M001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    examType: 'screening',
    indication: 'routine-screening',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'M002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    examType: 'diagnostic',
    indication: 'breast-lump',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Mr K Mensah',
    flags: ['suspected-cancer-2ww', 'breast-lump']
  },
  {
    id: 'M003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    examType: 'symptomatic',
    indication: 'nipple-discharge',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    priorityBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['bloody-nipple-discharge']
  },
  {
    id: 'M004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    examType: 'surveillance',
    indication: 'follow-up-known-cancer',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'M005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    examType: 'screening',
    indication: 'family-history',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'M006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    examType: 'symptomatic',
    indication: 'skin-change',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    priorityBand: 'high',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['suspected-cancer-2ww', 'skin-change']
  },
  {
    id: 'M007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    examType: 'screening',
    indication: 'routine-screening',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    priorityBand: 'low',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['age-below-screening', 'missing-clinical-question']
  },
  {
    id: 'M008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    examType: 'diagnostic',
    indication: 'recall-from-screening',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    priorityBand: 'moderate',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'M009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    examType: 'screening',
    indication: 'breast-lump',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    priorityBand: 'high',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['suspected-cancer-2ww', 'breast-lump']
  },
  {
    id: 'M010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    examType: 'symptomatic',
    indication: 'breast-pain',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    priorityBand: 'moderate',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['pregnancy-lactating']
  }
];

window.MammographyTestRequestDashboard.sampleRequests = sampleRequests;
})();
